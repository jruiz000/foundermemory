"use client";

import { useState } from "react";
import { Search, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

interface Quote {
  id: string;
  text: string;
  source: string | null;
  context: string | null;
  views: number;
  author: {
    name: string;
  };
  tags?: {
    tag: {
      name: string;
      slug: string;
    };
  }[];
  _count?: {
    likes: number;
  };
}

export default function AskPage() {
  const [query, setQuery] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuotes(data.quotes || []);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-zinc-300">The Librarian</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
            What are you thinking about?
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Describe your situation, doubt, or decision. The librarian will find relevant wisdom from founders who&apos;ve been there.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="liquid-glass rounded-2xl p-2">
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="I'm struggling with... / I'm doubting if... / I need to decide..."
                className="w-full px-6 py-4 bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none resize-none text-lg"
                rows={3}
                disabled={isLoading}
              />
              <div className="flex items-center justify-between px-4 pb-2">
                <p className="text-xs text-zinc-500">
                  Be specific about your situation for better results
                </p>
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-900 font-semibold rounded-xl transition-all"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Ask
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Results */}
        <div className="space-y-6">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 text-zinc-400">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                The librarian is searching the archives...
              </div>
            </div>
          )}

          {!isLoading && hasSearched && quotes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-500 mb-4">
                No quotes found for this situation yet.
              </p>
              <Link
                href="/add"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
              >
                Be the first to add relevant wisdom
              </Link>
            </div>
          )}

          {!isLoading && quotes.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-500 text-center mb-8">
                Found {quotes.length} relevant {quotes.length === 1 ? "quote" : "quotes"}
              </p>
              
              {quotes.map((quote, index) => (
                <div
                  key={quote.id}
                  className="glass glass-hover rounded-2xl p-6 animate-fade-in-up transition-all"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <blockquote className="text-xl text-zinc-100 leading-relaxed mb-4">
                    &ldquo;{quote.text}&rdquo;
                  </blockquote>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-400 font-medium">{quote.author.name}</p>
                      {quote.source && (
                        <p className="text-zinc-500 text-sm">{quote.source}</p>
                      )}
                    </div>
                  </div>
                  
                  {quote.context && (
                    <p className="mt-4 text-zinc-500 text-sm italic border-t border-zinc-800/50 pt-4">
                      💡 {quote.context}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggestions */}
        {!hasSearched && (
          <div className="mt-12">
            <p className="text-sm text-zinc-500 text-center mb-6">Try asking about:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "launching too early",
                "co-founder conflicts",
                "running out of money",
                "imposter syndrome",
                "hiring decisions",
                "pivoting the product",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(`I'm dealing with ${suggestion}`)}
                  className="px-4 py-2 glass glass-hover rounded-full text-sm text-zinc-300 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
