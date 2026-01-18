"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Award, TrendingUp, Quote } from "lucide-react";

interface Contributor {
  id: string;
  name: string | null;
  email: string | null;
  xp: number;
  _count: {
    quotes: number;
  };
}

export default function LeaderboardPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        if (response.ok) {
          const data = await response.json();
          setContributors(data.contributors || []);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-amber-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-zinc-300" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-zinc-500 font-mono">{index + 1}</span>;
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-amber-500/20 to-transparent border-amber-500/30";
      case 1:
        return "bg-gradient-to-r from-zinc-400/10 to-transparent border-zinc-400/20";
      case 2:
        return "bg-gradient-to-r from-amber-700/15 to-transparent border-amber-700/25";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-zinc-300">Community Rankings</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
            Top Contributors
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            The founders sharing the most valuable wisdom with the community.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="liquid-glass rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-1">
              {contributors.reduce((acc, c) => acc + c._count.quotes, 0)}
            </div>
            <div className="text-sm text-zinc-400">Total Quotes</div>
          </div>
          <div className="liquid-glass rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-zinc-100 mb-1">
              {contributors.length}
            </div>
            <div className="text-sm text-zinc-400">Contributors</div>
          </div>
          <div className="liquid-glass rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-1">
              {contributors.reduce((acc, c) => acc + c.xp, 0)}
            </div>
            <div className="text-sm text-zinc-400">Total XP</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12 text-zinc-500">
              Loading leaderboard...
            </div>
          ) : contributors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 mb-4">No contributors yet.</p>
              <p className="text-zinc-400">Be the first to share wisdom!</p>
            </div>
          ) : (
            contributors.map((contributor, index) => (
              <div
                key={contributor.id}
                className={`glass rounded-xl p-4 flex items-center gap-4 animate-fade-in transition-all hover:scale-[1.01] ${getRankBg(index)}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-shrink-0">
                  {getRankIcon(index)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-zinc-100 truncate">
                    {contributor.name || contributor.email?.split("@")[0] || "Anonymous"}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Quote className="w-3 h-3" />
                      {contributor._count.quotes} quotes
                    </span>
                  </div>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <div className="text-xl font-bold text-amber-400">
                    {contributor.xp}
                  </div>
                  <div className="text-xs text-zinc-500">XP</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* How XP Works */}
        <div className="mt-16 liquid-glass rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">
            How XP Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-amber-400 font-medium mb-1">+10 XP</div>
              <div className="text-zinc-400">Add a quote with source</div>
            </div>
            <div>
              <div className="text-amber-400 font-medium mb-1">+5 XP</div>
              <div className="text-zinc-400">Your quote gets liked</div>
            </div>
            <div>
              <div className="text-amber-400 font-medium mb-1">+2 XP</div>
              <div className="text-zinc-400">Your quote appears in search</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
