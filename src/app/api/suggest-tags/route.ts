import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.length < 10) {
      return NextResponse.json({ tags: [] });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a tag suggestion system for a founder wisdom library. Given a quote, suggest 2-4 relevant tags that categorize it.

Tags should be:
- Single words or short phrases (max 2 words)
- Lowercase, no special characters
- Relevant to startup/founder topics like: fundraising, hiring, product, growth, mindset, leadership, failure, persistence, vision, customers, team, culture, strategy, execution, focus, simplicity, innovation, risk, decision-making, etc.

Return ONLY a JSON array of tag strings, nothing else. Example: ["fundraising", "persistence", "mindset"]`,
        },
        {
          role: "user",
          content: `Suggest tags for this quote: "${text}"`,
        },
      ],
      temperature: 0.3,
      max_tokens: 100,
    });

    const content = response.choices[0]?.message?.content || "[]";
    
    // Parse the JSON response
    let tags: string[] = [];
    try {
      tags = JSON.parse(content);
      // Validate and clean tags
      tags = tags
        .filter((tag): tag is string => typeof tag === "string")
        .map((tag) => tag.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, ""))
        .filter((tag) => tag.length > 0 && tag.length <= 20)
        .slice(0, 4);
    } catch {
      console.error("Failed to parse tags:", content);
      tags = [];
    }

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Suggest tags error:", error);
    return NextResponse.json(
      { error: "Failed to suggest tags" },
      { status: 500 }
    );
  }
}
