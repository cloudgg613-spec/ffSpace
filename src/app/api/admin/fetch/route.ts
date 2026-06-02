import { NextResponse } from "next/server";
import { fetchAllActiveFeeds } from "@/lib/rss";

export async function POST() {
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
