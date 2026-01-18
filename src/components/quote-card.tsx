"use client";

import { useState } from "react";
import { Heart, Eye } from "lucide-react";

interface QuoteCardProps {
  quote: {
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
  };
}

export function QuoteCard({ quote }: QuoteCardProps) {
  const [likes, setLikes] = useState(quote._count?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/quotes/${quote.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: getVisitorId() }),
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
      <blockquote className="text-xl text-zinc-100 leading-relaxed mb-4">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-amber-500 font-medium">{quote.author.name}</p>
          {quote.source && (
            <p className="text-zinc-500 text-sm">{quote.source}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-zinc-500 text-sm">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{quote.views}</span>
          </div>
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 transition-colors ${
              isLiked ? "text-red-500" : "hover:text-red-400"
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{likes}</span>
          </button>
        </div>
      </div>
      
      {quote.context && (
        <p className="mt-4 text-zinc-500 text-sm italic border-t border-zinc-800 pt-4">
          {quote.context}
        </p>
      )}
    </div>
  );
}

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  
  let visitorId = localStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("visitorId", visitorId);
  }
  return visitorId;
}