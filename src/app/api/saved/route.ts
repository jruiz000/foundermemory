import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ savedQuoteIds: [] });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      include: {
        savedQuotes: {
          select: { quoteId: true },
        },
      },
    });

    const savedQuoteIds = dbUser?.savedQuotes.map((sq) => sq.quoteId) || [];

    return NextResponse.json({ savedQuoteIds });
  } catch (error) {
    console.error("GET saved error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved quotes" },
      { status: 500 }
    );
  }
}
