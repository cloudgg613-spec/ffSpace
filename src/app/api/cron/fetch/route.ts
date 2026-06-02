import { NextRequest, NextResponse } from "next/server";
import { fetchAllActiveFeeds } from "@/lib/rss";

function isAuthorized(request: NextRequest): boolean {
  if (!process.env.CRON_SECRET) return true;
  return request.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
}

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const results = await fetchAllActiveFeeds();
    const totalSaved = results.reduce((s, r) => s + r.saved, 0);
    return NextResponse.json({ ok: true, totalSaved, results });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch feeds" },
      { status: 500 }
    );
  }
}

export const GET = handle;
export const POST = handle;
