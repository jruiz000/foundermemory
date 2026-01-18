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
      include: {
        quotes: {
          include: {
            author: true,
            _count: { select: { likes: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            savedQuotes: true,
          },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate stats
    const totalLikes = dbUser.quotes.reduce(
      (acc, q) => acc + q._count.likes,
      0
    );
    const totalViews = dbUser.quotes.reduce((acc, q) => acc + q.views, 0);

    const stats = {
      quotesCount: dbUser.quotes.length,
      totalLikes,
      totalViews,
      xp: dbUser.xp,
      savedCount: dbUser._count.savedQuotes,
      createdAt: dbUser.createdAt.toISOString(),
    };

    return NextResponse.json({
      stats,
      quotes: dbUser.quotes,
    });
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
