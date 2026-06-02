import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const feeds = await prisma.rssFeed.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(feeds);
  } catch {
    return NextResponse.json({ error: "Failed to fetch feeds" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, url, league } = await request.json();

    if (!name?.trim() || !url?.trim()) {
      return NextResponse.json({ error: "Thiếu tên hoặc URL" }, { status: 400 });
    }

    const feed = await prisma.rssFeed.create({
      data: { name: name.trim(), url: url.trim(), league: league?.trim() || "all" },
    });

    return NextResponse.json(feed, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create feed" }, { status: 500 });
  }
}
