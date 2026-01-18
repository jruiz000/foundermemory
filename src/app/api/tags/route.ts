import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { quotes: true },
        },
      },
      orderBy: {
        quotes: {
          _count: "desc",
        },
      },
    });

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("GET tags error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
