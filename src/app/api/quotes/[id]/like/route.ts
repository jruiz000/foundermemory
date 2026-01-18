import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { visitorId } = body;

    if (!visitorId) {
      return NextResponse.json(
        { error: "Visitor ID is required" },
        { status: 400 }
      );
    }

    // Check if quote exists
    const quote = await prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        visitorId_quoteId: {
          visitorId,
          quoteId: id,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      const likeCount = await prisma.like.count({
        where: { quoteId: id },
      });

      return NextResponse.json({ liked: false, likes: likeCount });
    } else {
      // Like
      await prisma.like.create({
        data: {
          visitorId,
          quoteId: id,
        },
      });

      const likeCount = await prisma.like.count({
        where: { quoteId: id },
      });

      return NextResponse.json({ liked: true, likes: likeCount });
    }
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}