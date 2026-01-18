import { AddQuoteForm } from "@/components/add-quote-form";
import { Plus, Sparkles } from "lucide-react";

export default function AddPage() {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Plus className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-zinc-300">Contribute</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
            Share Founder Wisdom
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Found a quote that helped you? Share it with other founders. Help someone find it when they need it most.
          </p>
        </div>

        {/* Tips */}
        <div className="liquid-glass rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-zinc-400">
              <p className="font-medium text-zinc-300 mb-2">Tips for great quotes:</p>
              <ul className="space-y-1">
                <li>• Keep it short (max 250 characters)</li>
                <li>• Include the source (book, podcast, interview)</li>
                <li>• Add context: when is this quote useful?</li>
                <li>• Be specific about the author</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="liquid-glass rounded-2xl p-8">
          <AddQuoteForm />
        </div>

        {/* XP Info */}
        <div className="mt-8 text-center text-sm text-zinc-500">
          <p>You&apos;ll earn <span className="text-amber-400 font-medium">+10 XP</span> for adding a quote with source</p>
        </div>
      </div>
    </div>
  );
}