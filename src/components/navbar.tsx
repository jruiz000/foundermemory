"use client";

import Link from "next/link";
import { BookOpen, Plus, Search } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BookOpen className="h-5 w-5 text-amber-500" />
            <span className="font-semibold text-lg">FounderMemory</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>
            <Link
              href="/browse"
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Browse</span>
            </Link>
            <Link
              href="/add"
              className="flex items-center gap-1.5 text-sm bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Quote</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}