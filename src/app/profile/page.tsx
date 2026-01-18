"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Quote, Heart, Eye, TrendingUp, Calendar, Bookmark } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserStats {
  quotesCount: number;
  totalLikes: number;
  totalViews: number;
  xp: number;
  savedCount: number;
  createdAt: string;
}

interface UserQuote {
  id: string;
  text: string;
  author: { name: string };
  views: number;
  _count: { likes: number };
  createdAt: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [quotes, setQuotes] = useState<UserQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, loading, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setQuotes(data.quotes || []);
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
    } finally {
      setIsLoading(false);
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
        {/* Profile Header */}
        <div className="liquid-glass rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center">
                <span className="text-3xl text-amber-400">
                  {(user.user_metadata?.full_name || user.email)?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-zinc-100">
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </h1>
              <p className="text-zinc-400">{user.email}</p>
              {stats && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium">
                    {stats.xp} XP
                  </span>
                  <span className="text-zinc-500 text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {new Date(stats.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-xl p-4 text-center">
              <Quote className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-zinc-100">{stats.quotesCount}</div>
              <div className="text-xs text-zinc-500">Quotes Added</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <Heart className="w-5 h-5 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-zinc-100">{stats.totalLikes}</div>
              <div className="text-xs text-zinc-500">Total Likes</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <Eye className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-zinc-100">{stats.totalViews}</div>
              <div className="text-xs text-zinc-500">Total Views</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <Bookmark className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-zinc-100">{stats.savedCount}</div>
              <div className="text-xs text-zinc-500">Saved Quotes</div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/saved"
            className="glass glass-hover rounded-xl p-6 flex items-center gap-4 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-medium text-zinc-100">Saved Quotes</h3>
              <p className="text-sm text-zinc-500">View your saved collection</p>
            </div>
          </Link>
          
          <Link
            href="/add"
            className="glass glass-hover rounded-xl p-6 flex items-center gap-4 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-medium text-zinc-100">Add Quote</h3>
              <p className="text-sm text-zinc-500">Share wisdom, earn XP</p>
            </div>
          </Link>
        </div>

        {/* My Quotes */}
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">My Quotes</h2>
          
          {quotes.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center">
              <p className="text-zinc-500 mb-4">You haven&apos;t added any quotes yet.</p>
              <Link
                href="/add"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-medium rounded-lg transition-colors"
              >
                Add Your First Quote
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div key={quote.id} className="glass rounded-xl p-4">
                  <blockquote className="text-zinc-200 mb-2">
                    &ldquo;{quote.text}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-amber-400">{quote.author.name}</span>
                    <div className="flex items-center gap-4 text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {quote.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
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
    </div>
  );
}
