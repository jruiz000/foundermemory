import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai, LIBRARIAN_SYSTEM_PROMPT } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Get all quotes to send to the AI
    const allQuotes = await prisma.quote.findMany({
      include: {
        author: true,
        _count: {
          select: { likes: true },
        },
      },
    });

    if (allQuotes.length === 0) {
      return NextResponse.json({ quotes: [] });
    }

    // Format quotes for the AI
    const quotesForAI = allQuotes.map((q) => ({
      id: q.id,
      text: q.text,
      author: q.author.name,
      context: q.context,
    }));

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      // Fallback: simple text matching
      const lowerQuery = query.toLowerCase();
      const matchedQuotes = allQuotes.filter(
        (q) =>
          q.text.toLowerCase().includes(lowerQuery) ||
          q.context?.toLowerCase().includes(lowerQuery) ||
          q.author.name.toLowerCase().includes(lowerQuery)
      );
      return NextResponse.json({ quotes: matchedQuotes.slice(0, 5) });
    }

    // Use AI to select relevant quotes
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: LIBRARIAN_SYSTEM_PROMPT },
        {
          role: "user",
          content: `User's situation: "${query}"

Available quotes:
${JSON.stringify(quotesForAI, null, 2)}

Select the most relevant quotes (up to 5) and return their IDs as a JSON array.`,
        },
      ],
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content || "[]";
    
    // Parse the AI response
    let selectedIds: string[] = [];
    try {
      selectedIds = JSON.parse(responseText);
    } catch {
      // If parsing fails, try to extract IDs from the response
      const idMatches = responseText.match(/"([^"]+)"/g);
      if (idMatches) {
        selectedIds = idMatches.map((m) => m.replace(/"/g, ""));
      }
    }

    // Get the selected quotes
    const selectedQuotes = allQuotes.filter((q) => selectedIds.includes(q.id));

    // Update search hits for selected quotes
    await Promise.all(
      selectedQuotes.map((q) =>
        prisma.quote.update({
          where: { id: q.id },
          data: { searchHits: { increment: 1 } },
        })
      )
    );

    return NextResponse.json({ quotes: selectedQuotes });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}