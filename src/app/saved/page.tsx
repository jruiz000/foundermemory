"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Heart, Eye, Bookmark, BookmarkX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SavedQuote {
  id: string;
  text: string;
  source: string | null;
  author: { name: string };
  views: number;
  _count: { likes: number };
}

export default function SavedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }

    if (user) {
      fetchSavedQuotes();
    }
  }, [user, loading, router]);

  const fetchSavedQuotes = async () => {
    try {
      const response = await fetch("/api/saved/quotes");
      if (response.ok) {
        const data = await response.json();
        setQuotes(data.quotes || []);
      }
    } catch (error) {
      console.error("Fetch saved quotes error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async (quoteId: string) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/save`, {
        method: "DELETE",
      });

      if (response.ok) {
        setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
      }
    } catch (error) {
      console.error("Unsave error:", error);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-zinc-300">Your Collection</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
            Saved Quotes
          </h1>
          <p className="text-zinc-400 text-lg">
            {quotes.length} quotes in your personal library
          </p>
        </div>

        {/* Quotes */}
        {quotes.length === 0 ? (
          <div className="liquid-glass rounded-2xl p-12 text-center">
            <Bookmark className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 mb-4">
              You haven&apos;t saved any quotes yet.
            </p>
            <Link
              href="/library"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-medium rounded-xl transition-colors"
            >
              Browse the Library
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="glass glass-hover rounded-xl p-6 group relative"
              >
                <button
                  onClick={() => handleUnsave(quote.id)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove from saved"
                >
                  <BookmarkX className="w-4 h-4" />
                </button>

                <blockquote className="text-lg text-zinc-200 leading-relaxed mb-4 pr-10">
                  &ldquo;{quote.text}&rdquo;
                </blockquote>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-400 font-medium">{quote.author.name}</p>
                    {quote.source && (
                      <p className="text-zinc-500 text-sm">{quote.source}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-zinc-500 text-sm">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {quote.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {quote._count.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
