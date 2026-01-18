import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang = "en" } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const languageNames: Record<string, string> = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      pt: "Portuguese",
      it: "Italian",
      zh: "Chinese",
      ja: "Japanese",
      ko: "Korean",
      ru: "Russian",
      ar: "Arabic",
    };

    const targetLanguage = languageNames[targetLang] || "English";

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the given quote to ${targetLanguage}. 
Preserve the meaning, tone, and style of the original quote.
Return ONLY the translated text, nothing else.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const translatedText = response.choices[0]?.message?.content || text;

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Translate error:", error);
    return NextResponse.json(
      { error: "Failed to translate" },
      { status: 500 }
    );
  }
}
