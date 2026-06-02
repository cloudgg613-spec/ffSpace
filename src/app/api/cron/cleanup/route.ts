import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthorized(request: NextRequest): boolean {
  if (!process.env.CRON_SECRET) return true;
  return request.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
}

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const cutoff = new Date(Date.now() - 72 * 60 * 60 * 1000);
    const { count } = await prisma.article.deleteMany({
      where: { publishedAt: { lt: cutoff } },
    });
    return NextResponse.json({ ok: true, deleted: count });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to cleanup" },
      { status: 500 }
    );
  }
}

export const GET = handle;
export const POST = handle;
