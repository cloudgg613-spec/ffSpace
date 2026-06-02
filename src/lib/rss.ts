import Parser from "rss-parser";
import { prisma } from "./prisma";

type CustomItem = {
  mediaContent?: { $: { url: string } };
  mediaThumbnail?: { $: { url: string } };
};

const parser = new Parser<Record<string, unknown>, CustomItem>({
  timeout: 10000,
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
    ],
  },
});

function detectLeague(title: string, content: string): string {
  const text = (title + " " + content).toLowerCase();

  if (/\b(transfer|signing|signed|joins|loan|bid|fee|contract|deal)\b/.test(text)) {
    return "transfer";
  }
  if (/\b(champions league|europa league|conference league|ucl|uel)\b/.test(text)) {
    return "champions-league";
  }
  if (/\b(premier league|epl|arsenal|chelsea|man city|man utd|manchester|liverpool|tottenham|newcastle|west ham|aston villa)\b/.test(text)) {
    return "premier-league";
  }
  if (/\b(la liga|laliga|barcelona|real madrid|atletico|sevilla|valencia|athletic)\b/.test(text)) {
    return "la-liga";
  }
  if (/\b(serie a|juventus|ac milan|inter milan|napoli|roma|lazio|fiorentina|atalanta)\b/.test(text)) {
    return "serie-a";
  }
  if (/\b(bundesliga|bayern munich|dortmund|borussia|rb leipzig|leverkusen)\b/.test(text)) {
    return "bundesliga";
  }
  if (/\b(v.?league|vietnam|viet nam|việt nam|hà nội fc|hoàng anh)\b/.test(text)) {
    return "v-league";
  }

  return "premier-league";
}

function extractImageFromHtml(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

export async function fetchAndSaveFeed(
  feedName: string,
  feedUrl: string,
  feedLeague: string
): Promise<{ saved: number; skipped: number }> {
  const feed = await parser.parseURL(feedUrl);
  let saved = 0;
  let skipped = 0;

  for (const item of feed.items) {
    const title = item.title?.trim();
    const link = item.link?.trim();
    if (!title || !link) continue;

    const existing = await prisma.article.findUnique({ where: { sourceUrl: link } });
    if (existing) {
      skipped++;
      continue;
    }

    const rawContent = (item.content || item.contentSnippet || "").trim();
    const summary = (item.contentSnippet || item.content || "")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 300);

    const league =
      feedLeague === "all"
        ? detectLeague(title, rawContent)
        : feedLeague;

    const imageUrl =
      item.mediaContent?.$.url ||
      item.mediaThumbnail?.$.url ||
      item.enclosure?.url ||
      extractImageFromHtml(rawContent) ||
      null;

    await prisma.article.create({
      data: {
        title,
        summary: summary || title,
        content: rawContent || title,
        imageUrl,
        source: feedName,
        league,
        sourceUrl: link,
        publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
        isManual: false,
      },
    });
    saved++;
  }

  return { saved, skipped };
}

export async function fetchAllActiveFeeds(): Promise<
  { name: string; saved: number; skipped: number; error?: string }[]
> {
  const feeds = await prisma.rssFeed.findMany({ where: { isActive: true } });
  const results = [];

  for (const feed of feeds) {
    try {
      const { saved, skipped } = await fetchAndSaveFeed(feed.name, feed.url, feed.league);
      results.push({ name: feed.name, saved, skipped });
    } catch (err) {
      results.push({
        name: feed.name,
        saved: 0,
        skipped: 0,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return results;
}
