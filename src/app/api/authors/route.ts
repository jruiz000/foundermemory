import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";

    if (search.length < 2) {
      return NextResponse.json({ authors: [] });
    }

    const authors = await prisma.author.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      take: 10,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ authors });
  } catch (error) {
    console.error("GET authors error:", error);
    return NextResponse.json(
      { error: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}