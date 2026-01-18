"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "./auth-provider";
import { User, LogOut, Bookmark, ChevronDown } from "lucide-react";
import Link from "next/link";

export function AuthButton() {
  const { user, loading, signInWithGoogle, signInWithEmail, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowLoginModal(true)}
          className="flex items-center gap-2 px-4 py-2 glass glass-hover rounded-lg text-sm text-zinc-300 transition-all"
        >
          <User className="w-4 h-4" />
          Sign In
        </button>

        {/* Login Modal - rendered via portal to document.body */}
        {mounted && showLoginModal && createPortal(
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setShowLoginModal(false);
              setEmailSent(false);
              setEmail("");
            }}
          >
            <div 
              className="bg-zinc-900 border border-zinc-700/50 rounded-2xl p-8 max-w-md w-full animate-fade-in shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-zinc-100 mb-2">
                Welcome to FounderMemory
              </h2>
              <p className="text-zinc-400 mb-6">
                Sign in to save quotes, build collections, and track your contributions.
              </p>

              {!emailSent ? (
                <>
                  <button
                    onClick={signInWithGoogle}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-colors mb-4"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-zinc-900 text-zinc-500">or</span>
                    </div>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const { error } = await signInWithEmail(email);
                      if (!error) setEmailSent(true);
                    }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 mb-4"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-medium rounded-xl transition-colors"
                    >
                      Continue with Email
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-zinc-100 font-medium mb-2">Check your email</p>
                  <p className="text-zinc-400 text-sm">
                    We sent a magic link to <span className="text-zinc-100">{email}</span>
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setEmailSent(false);
                  setEmail("");
                }}
                className="w-full mt-4 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-1.5 glass glass-hover rounded-lg transition-all"
      >
        {user.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt=""
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
            <User className="w-3 h-3 text-amber-400" />
          </div>
        )}
        <span className="text-sm text-zinc-300 hidden sm:inline max-w-[100px] truncate">
          {user.user_metadata?.full_name || user.email?.split("@")[0]}
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-500" />
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-56 glass rounded-xl overflow-hidden z-50 animate-fade-in">
            <div className="px-4 py-3 border-b border-zinc-800">
              <p className="text-sm font-medium text-zinc-100 truncate">
                {user.user_metadata?.full_name || "Founder"}
              </p>
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            </div>
            
            <div className="py-1">
              <Link
                href="/profile"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800/50 transition-colors"
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>
              <Link
                href="/saved"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800/50 transition-colors"
              >
                <Bookmark className="w-4 h-4" />
                Saved Quotes
              </Link>
            </div>
            
            <div className="border-t border-zinc-800 py-1">
              <button
                onClick={() => {
                  signOut();
                  setShowDropdown(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-zinc-800/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
