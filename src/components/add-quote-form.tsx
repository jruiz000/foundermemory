"use client";

import { useState } from "react";
import { AuthorCombobox } from "./author-combobox";

export function AddQuoteForm() {
  const [text, setText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [source, setSource] = useState("");
  const [context, setContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || !authorName.trim()) {
      setMessage({ type: "error", text: "Quote and author are required" });
      return;
    }

    if (text.length > 250) {
      setMessage({ type: "error", text: "Quote must be 250 characters or less" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          authorName: authorName.trim(),
          source: source.trim() || null,
          context: context.trim() || null,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Quote added successfully!" });
        setText("");
        setAuthorName("");
        setSource("");
        setContext("");
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.error || "Failed to add quote" });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage({ type: "error", text: "Failed to add quote" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Quote <span className="text-red-500">*</span>
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="The wisdom you want to share..."
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none"
          rows={4}
          maxLength={250}
        />
        <p className="text-xs text-zinc-500 mt-1">{text.length}/250 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Author <span className="text-red-500">*</span>
        </label>
        <AuthorCombobox value={authorName} onChange={setAuthorName} />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Source
        </label>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Book, podcast, interview, etc."
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Context
        </label>
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="When is this quote useful? e.g., 'When you doubt your product'"
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-900/50 text-green-300 border border-green-800"
              : "bg-red-900/50 text-red-300 border border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg transition-colors font-medium"
      >
        {isSubmitting ? "Adding..." : "Add Quote"}
      </button>
    </form>
  );
}