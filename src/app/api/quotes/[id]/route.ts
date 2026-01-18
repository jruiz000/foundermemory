import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quote = await prisma.quote.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        author: true,
        _count: {
          select: { likes: true },
        },
      },
    });

    return NextResponse.json({ quote });
  } catch (error) {
    console.error("GET quote error:", error);
    return NextResponse.json(
      { error: "Quote not found" },
      { status: 404 }
    );
  }
}