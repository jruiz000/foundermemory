import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.length < 10) {
      return NextResponse.json({ language: "en", languageName: "English" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Detect the language of the given text. Return ONLY a JSON object with two fields:
- "code": ISO 639-1 language code (e.g., "en", "es", "fr", "de", "pt", "zh", "ja", "ko")
- "name": Full language name in English (e.g., "English", "Spanish", "French")

Example response: {"code": "es", "name": "Spanish"}`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0,
      max_tokens: 50,
    });

    const content = response.choices[0]?.message?.content || '{"code": "en", "name": "English"}';
    
    try {
      const result = JSON.parse(content);
      return NextResponse.json({
        language: result.code || "en",
        languageName: result.name || "English",
      });
    } catch {
      return NextResponse.json({ language: "en", languageName: "English" });
    }
  } catch (error) {
    console.error("Detect language error:", error);
    return NextResponse.json({ language: "en", languageName: "English" });
  }
}
