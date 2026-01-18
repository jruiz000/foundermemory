"use client";

import { useState, useEffect } from "react";
import { Heart, Eye, Filter, X, Bookmark, BookmarkCheck, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

interface Quote {
  id: string;
  text: string;
  source: string | null;
  context: string | null;
  views: number;
  author: {
    name: string;
  };
  contributor?: {
    name: string | null;
    email: string | null;
  } | null;
  tags?: {
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  _count?: {
    likes: number;
  };
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count: {
    quotes: number;
  };
}

export default function LibraryPage() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [savedQuotes, setSavedQuotes] = useState<Set<string>>(new Set());
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quotesRes, tagsRes] = await Promise.all([
          fetch(`/api/quotes?limit=200${selectedTag ? `&tag=${selectedTag}` : ""}`),
          fetch("/api/tags"),
        ]);

        if (quotesRes.ok) {
          const data = await quotesRes.json();
          setQuotes(data.quotes || []);
        }

        if (tagsRes.ok) {
          const data = await tagsRes.json();
          setTags(data.tags || []);
        }

        // Fetch saved quotes if user is logged in
        if (user) {
          const savedRes = await fetch("/api/saved");
          if (savedRes.ok) {
            const data = await savedRes.json();
            setSavedQuotes(new Set(data.savedQuoteIds || []));
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedTag, user]);

  const handleLike = async (quoteId: string) => {
    try {
      const visitorId = getVisitorId();
      await fetch(`/api/quotes/${quoteId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId }),
      });
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleSave = async (quoteId: string) => {
    if (!user) return;
    
    try {
      const isSaved = savedQuotes.has(quoteId);
      const response = await fetch(`/api/quotes/${quoteId}/save`, {
        method: isSaved ? "DELETE" : "POST",
      });

      if (response.ok) {
        setSavedQuotes((prev) => {
          const next = new Set(prev);
          if (isSaved) {
            next.delete(quoteId);
          } else {
            next.add(quoteId);
          }
          return next;
        });
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 py-8 border-b border-zinc-800/50">
        <div className="w-full px-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">
                The Library
              </h1>
              <p className="text-zinc-400">
                {quotes.length} quotes from founders who&apos;ve been there
              </p>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 glass glass-hover rounded-xl text-zinc-300 transition-all"
            >
              <Filter className="w-4 h-4" />
              Filter
              {selectedTag && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          </div>

          {/* Tags Filter */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 animate-fade-in">
              <button
                onClick={() => setSelectedTag(null)}
                className={`tag ${!selectedTag ? "bg-amber-500/30 border-amber-500/50" : ""}`}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.slug)}
                  className={`tag ${selectedTag === tag.slug ? "bg-amber-500/30 border-amber-500/50" : ""}`}
                >
                  #{tag.name}
                  <span className="ml-1 text-zinc-500">({tag._count.quotes})</span>
                </button>
              ))}
            </div>
          )}

          {selectedTag && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-zinc-400 text-sm">Filtering by:</span>
              <button
                onClick={() => setSelectedTag(null)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm"
              >
                #{selectedTag}
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Masonry Grid - Full Width */}
      <div className="px-2 py-6">
        {isLoading ? (
          <div className="text-center py-12 text-zinc-500">
            Loading the library...
          </div>
        ) : quotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500 mb-4">No quotes found.</p>
            <Link
              href="/add"
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              Be the first to add one
            </Link>
          </div>
        ) : (
          <div className="masonry-grid">
            {quotes.map((quote, index) => (
              <div
                key={quote.id}
                className="masonry-item glass rounded-xl p-4 animate-fade-in transition-all group relative"
                style={{ animationDelay: `${Math.min(index * 20, 400)}ms` }}
              >
                {/* Save button on hover */}
                {user && (
                  <button
                    onClick={() => handleSave(quote.id)}
                    className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all ${
                      savedQuotes.has(quote.id)
                        ? "bg-amber-500/20 text-amber-400"
                        : "opacity-0 group-hover:opacity-100 bg-zinc-800/80 text-zinc-400 hover:text-amber-400"
                    }`}
                  >
                    {savedQuotes.has(quote.id) ? (
                      <BookmarkCheck className="w-4 h-4" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                )}

                <blockquote className="text-sm md:text-base text-zinc-200 leading-relaxed mb-3 pr-6">
                  &ldquo;{quote.text}&rdquo;
                </blockquote>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-medium truncate max-w-[60%]">
                    {quote.author.name}
                  </span>
                  
                  <div className="flex items-center gap-3 text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {quote.views}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(quote.id);
                      }}
                      className="flex items-center gap-1 hover:text-red-400 transition-colors"
                    >
                      <Heart className="w-3 h-3" />
                      {quote._count?.likes || 0}
                    </button>
                  </div>
                </div>

                {/* Contributor info */}
                {quote.contributor && (
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-zinc-800/50 text-[10px] text-zinc-500">
                    <User className="w-3 h-3" />
                    <span>Added by {quote.contributor.name || quote.contributor.email?.split("@")[0]}</span>
                  </div>
                )}

                {/* Tags */}
                {quote.tags && quote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-zinc-800/50">
                    {quote.tags.slice(0, 3).map((qt) => (
                      <span
                        key={qt.tag.id}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/50 text-zinc-400"
                      >
                        #{qt.tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function generateUUID(): string {
  // Fallback for browsers that don't support crypto.randomUUID
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback using crypto.getRandomValues
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) >> (c === "x" ? 0 : 3);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  
  let visitorId = localStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = generateUUID();
    localStorage.setItem("visitorId", visitorId);
  }
  return visitorId;
}
