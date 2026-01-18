"use client";

import { useState, useEffect } from "react";
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

export default function BrowsePage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch("/api/quotes?limit=50");
        if (response.ok) {
          const data = await response.json();
          setQuotes(data.quotes || []);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4 text-zinc-100">
          Browse the Library
        </h1>
        <p className="text-zinc-400">
          Explore all the wisdom shared by founders.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center text-zinc-500">Loading quotes...</div>
      ) : quotes.length === 0 ? (
        <div className="text-center text-zinc-500">No quotes yet. Be the first to add one!</div>
      ) : (
        <div className="space-y-6">
          {quotes.map((quote, index) => (
            <div
              key={quote.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <QuoteCard quote={quote} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}