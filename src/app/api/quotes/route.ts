import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const quotes = await prisma.quote.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        _count: {
          select: { likes: true },
        },
      },
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("GET quotes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, authorName, source, context } = body;

    if (!text || !authorName) {
      return NextResponse.json(
        { error: "Text and author are required" },
        { status: 400 }
      );
    }

    if (text.length > 250) {
      return NextResponse.json(
        { error: "Quote must be 250 characters or less" },
        { status: 400 }
      );
    }

    let author = await prisma.author.findUnique({
      where: { name: authorName },
    });

    if (!author) {
      author = await prisma.author.create({
        data: { name: authorName },
      });
    }

    const quote = await prisma.quote.create({
      data: {
        text,
        authorId: author.id,
        source: source || null,
        context: context || null,
        originalLang: "en",
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json({ quote }, { status: 201 });
  } catch (error) {
    console.error("POST quote error:", error);
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 }
    );
  }
}