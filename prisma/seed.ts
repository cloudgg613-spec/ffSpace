import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const feeds = [
    {
      name: "BBC Sport Football",
      url: "https://feeds.bbci.co.uk/sport/football/rss.xml",
      league: "all",
    },
    {
      name: "Goal.com",
      url: "https://www.goal.com/feeds/en/news",
      league: "all",
    },
    {
      name: "ESPN FC",
      url: "https://www.espn.com/espn/rss/soccer/news",
      league: "all",
    },
  ];

  for (const feed of feeds) {
    await prisma.rssFeed.upsert({
      where: { url: feed.url },
      update: {},
      create: feed,
    });
    console.log(`Seeded: ${feed.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
