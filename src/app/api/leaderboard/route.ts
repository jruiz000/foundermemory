import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contributors = await prisma.user.findMany({
      where: {
        quotes: {
          some: {},
        },
      },
      include: {
        _count: {
          select: { quotes: true },
        },
      },
      orderBy: {
        xp: "desc",
      },
      take: 50,
    });

    return NextResponse.json({ contributors });
  } catch (error) {
    console.error("GET leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
