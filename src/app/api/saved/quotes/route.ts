import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    });

    if (!dbUser) {
      return NextResponse.json({ quotes: [] });
    }

    const savedQuotes = await prisma.savedQuote.findMany({
      where: { userId: dbUser.id },
      include: {
        quote: {
          include: {
            author: true,
            _count: { select: { likes: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const quotes = savedQuotes.map((sq: { quote: unknown }) => sq.quote);

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("GET saved quotes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved quotes" },
      { status: 500 }
    );
  }
}
