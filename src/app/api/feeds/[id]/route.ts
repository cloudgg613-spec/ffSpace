import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const feed = await prisma.rssFeed.findUnique({ where: { id: params.id } });
    if (!feed) return NextResponse.json({ error: "Feed not found" }, { status: 404 });

    const updated = await prisma.rssFeed.update({
      where: { id: params.id },
      data: { isActive: !feed.isActive },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update feed" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.rssFeed.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete feed" }, { status: 500 });
  }
}
