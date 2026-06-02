import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const league = searchParams.get("league");

    const since = new Date(Date.now() - 72 * 60 * 60 * 1000);
    const includeHidden = searchParams.get("includeHidden") === "1";

    const articles = await prisma.article.findMany({
      where: {
        publishedAt: { gte: since },
        ...(league && league !== "all" ? { league } : {}),
        ...(!includeHidden ? { isHidden: false } : {}),
      },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { count } = await prisma.article.deleteMany({});
    return NextResponse.json({ success: true, deleted: count });
  } catch {
    return NextResponse.json({ error: "Failed to delete articles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, summary, content, imageUrl, source, league, sourceUrl } = body;

    if (!title?.trim() || !summary?.trim() || !content?.trim() || !source?.trim() || !league?.trim()) {
      return NextResponse.json({ error: "Thiếu trường bắt buộc" }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        imageUrl: imageUrl?.trim() || null,
        source: source.trim(),
        league: league.trim(),
        sourceUrl: sourceUrl?.trim() || null,
        isManual: true,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
