import Link from "next/link";
import { BookOpen, Search, Plus, Users, Sparkles, MessageSquare, Heart, Zap, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-zinc-300">Not a chatbot. A librarian.</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up text-glow">
            <span className="text-zinc-100">Founder</span>
            <span className="text-amber-400">Memory</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            A calm place to save, share, and retrieve the ideas that gave you conviction when things weren&apos;t clear.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/ask"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold rounded-xl transition-all glow-amber"
            >
              <Search className="w-5 h-5" />
              Ask the Librarian
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 glass glass-hover rounded-xl font-semibold text-zinc-100 transition-all"
            >
              <BookOpen className="w-5 h-5" />
              Browse Library
            </Link>
          </div>
        </div>
      </section>

      {/* What is this Section */}
      <section className="px-4 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
              What is FounderMemory?
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              A repository of wisdom from founders who&apos;ve been there, accessible exactly when you need it.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="liquid-glass rounded-2xl p-8 transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">Not a Chatbot</h3>
              <p className="text-zinc-400">
                The AI doesn&apos;t give advice or opinions. It&apos;s a librarian that retrieves real quotes from real founders.
              </p>
            </div>
            
            <div className="liquid-glass rounded-2xl p-8 transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">Not a Social Network</h3>
              <p className="text-zinc-400">
                No infinite feeds, no dopamine loops, no engagement tricks. Just calm, useful wisdom when you need it.
              </p>
            </div>
            
            <div className="liquid-glass rounded-2xl p-8 transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">External Memory</h3>
              <p className="text-zinc-400">
                Save the quotes that matter to you. Retrieve them when you&apos;re doubting, deciding, or need conviction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-4 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
              How the Librarian Works
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Describe your situation. Get relevant wisdom. That&apos;s it.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl glass mx-auto mb-6 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-amber-400" />
              </div>
              <div className="text-amber-400 font-mono text-sm mb-2">01</div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">Describe Your Situation</h3>
              <p className="text-zinc-400">
                &quot;I&apos;m doubting if my product is ready to launch&quot; or &quot;I&apos;m struggling with a co-founder decision&quot;
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl glass mx-auto mb-6 flex items-center justify-center">
                <Search className="w-8 h-8 text-amber-400" />
              </div>
              <div className="text-amber-400 font-mono text-sm mb-2">02</div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">The Librarian Searches</h3>
              <p className="text-zinc-400">
                AI understands your context and finds the most relevant quotes from the community library.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl glass mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-400" />
              </div>
              <div className="text-amber-400 font-mono text-sm mb-2">03</div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">Recover Conviction</h3>
              <p className="text-zinc-400">
                Read how other founders thought in similar situations. Remember you&apos;re not alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contribute Section */}
      <section className="px-4 py-24 relative">
        <div className="max-w-4xl mx-auto">
          <div className="liquid-glass rounded-3xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 mx-auto mb-6 flex items-center justify-center">
              <Plus className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
              Share Your Wisdom
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
              Found a quote that helped you? Share it with other founders. Build your reputation. Earn XP.
            </p>
            <Link
              href="/add"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold rounded-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Add a Quote
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-24 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-4">
            <details className="glass rounded-xl group">
              <summary className="px-6 py-4 cursor-pointer text-zinc-100 font-medium flex items-center justify-between">
                Why not just use ChatGPT?
                <ChevronRight className="w-5 h-5 text-zinc-400 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-4 text-zinc-400">
                ChatGPT invents answers and tells you what you want to hear. FounderMemory only retrieves real quotes from real founders so you can get useful wisdom when you need it. The AI is a librarian, not an advisor. It never gives opinions or makes up content.
              </div>
            </details>
            
            <details className="glass rounded-xl group">
              <summary className="px-6 py-4 cursor-pointer text-zinc-100 font-medium flex items-center justify-between">
                Who can add quotes?
                <ChevronRight className="w-5 h-5 text-zinc-400 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-4 text-zinc-400">
                Anyone can contribute. The community curates quality through likes and search frequency. Better quotes rise to the top organically.
              </div>
            </details>
            
            <details className="glass rounded-xl group">
              <summary className="px-6 py-4 cursor-pointer text-zinc-100 font-medium flex items-center justify-between">
                What makes a good quote?
                <ChevronRight className="w-5 h-5 text-zinc-400 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-4 text-zinc-400">
                Short (max 250 characters), clear, with author and source. The best quotes are useful, not just motivational. They should help founders make decisions or recover conviction.
              </div>
            </details>
            
            <details className="glass rounded-xl group">
              <summary className="px-6 py-4 cursor-pointer text-zinc-100 font-medium flex items-center justify-between">
                Is this free?
                <ChevronRight className="w-5 h-5 text-zinc-400 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-4 text-zinc-400">
                Yes, completely free and open source. This project exists to be useful, not to monetize. The value is in the utility, not in revenue.
              </div>
            </details>
            
            <details className="glass rounded-xl group">
              <summary className="px-6 py-4 cursor-pointer text-zinc-100 font-medium flex items-center justify-between">
                How do I earn XP?
                <ChevronRight className="w-5 h-5 text-zinc-400 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-4 text-zinc-400">
                Add quotes, get likes, have your quotes appear in searches. Contributors build reputation through the quality and usefulness of their contributions.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="px-4 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
              Built by Founders, for Founders
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Open source. Community-driven. No engagement tricks.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/leaderboard" className="liquid-glass rounded-2xl p-8 transition-all hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-amber-400" />
                </div>
                <ChevronRight className="w-6 h-6 text-zinc-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">Top Contributors</h3>
              <p className="text-zinc-400">
                See who&apos;s sharing the most valuable wisdom with the community.
              </p>
            </Link>
            
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-2xl p-8 transition-all hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <ChevronRight className="w-6 h-6 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">Open Source</h3>
              <p className="text-zinc-400">
                Contribute to the codebase. Extend the concept. Build together.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 mb-6">
            Ready to recover conviction?
          </h2>
          <p className="text-zinc-400 text-xl mb-12">
            The librarian is waiting.
          </p>
          <Link
            href="/ask"
            className="inline-flex items-center gap-2 px-12 py-5 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold rounded-xl text-lg transition-all glow-amber"
          >
            <Search className="w-6 h-6" />
            Ask the Librarian
          </Link>
        </div>
      </section>
    </div>
  );
}