"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Plus, Search, Trophy, Menu, X } from "lucide-react";
import { useState } from "react";
import { AuthButton } from "./auth-button";

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/ask", label: "Ask", icon: Search },
    { href: "/library", label: "Library", icon: BookOpen },
    { href: "/leaderboard", label: "Rankings", icon: Trophy },
  ];

  return (
    <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-amber-400" />
            </div>
            <span className="font-semibold text-lg">
              <span className="text-zinc-100">Founder</span>
              <span className="text-amber-400">Memory</span>
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                  isActive(link.href)
                    ? "bg-zinc-800/50 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            
            <Link
              href="/add"
              className="flex items-center gap-2 ml-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-medium rounded-lg text-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Quote
            </Link>

            <div className="ml-3 pl-3 border-l border-zinc-800">
              <AuthButton />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <AuthButton />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                  isActive(link.href)
                    ? "bg-zinc-800/50 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            
            <Link
              href="/add"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-medium rounded-lg text-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Quote
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}