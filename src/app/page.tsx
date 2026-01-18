"use client";

import { useState } from "react";
import { SearchInput } from "@/components/search-input";
import { QuoteCard } from "@/components/quote-card";

interface Quote {
  id: string;
  text: string;
  source: string | null;
  context: string | null;
  views: number;
  author: {
    name: string;
  };
  _count?: {
    likes: number;
  };
}

export default function Home() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setQuotes([]);
      setHasSearched(false);
      return;
    }

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
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-zinc-100">
          What are you thinking about?
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Describe your situation and the librarian will find relevant wisdom from founders who&apos;ve been there.
        </p>
      </div>

      <SearchInput onSearch={handleSearch} isLoading={isLoading} />

      <div className="mt-12 space-y-6">
        {isLoading && (
          <div className="text-center text-zinc-500">
            The librarian is searching...
          </div>
        )}

        {!isLoading && hasSearched && quotes.length === 0 && (
          <div className="text-center text-zinc-500">
            No quotes found. Try describing your situation differently.
          </div>
        )}

        {quotes.map((quote, index) => (
          <div
            key={quote.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <QuoteCard quote={quote} />
          </div>
        ))}
      </div>
    </div>
  );
}