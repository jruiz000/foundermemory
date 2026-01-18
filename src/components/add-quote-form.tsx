"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AuthorCombobox } from "./author-combobox";
import { Mic, MicOff, Loader2, Sparkles, X } from "lucide-react";

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  isConfident: boolean;
  isInterim: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxResults: number;
  minConfidence: number;
  onaudiostart: ((event: Event) => void) | null;
  onaudioend: ((event: Event) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onnomatch: ((event: SpeechRecognitionEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onsoundend: ((event: Event) => void) | null;
  onsoundstart: ((event: Event) => void) | null;
  onspeechend: ((event: Event) => void) | null;
  onspeechstart: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function AddQuoteForm() {
  const [text, setText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [source, setSource] = useState("");
  const [context, setContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // AI Auto-tagging state
  const [tags, setTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const tagDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced tag suggestion
  const suggestTags = useCallback(async (quoteText: string) => {
    if (quoteText.length < 30) {
      setSuggestedTags([]);
      return;
    }

    setIsLoadingTags(true);
    try {
      const response = await fetch("/api/suggest-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: quoteText }),
      });

      if (response.ok) {
        const data = await response.json();
        // Filter out already selected tags
        const newSuggestions = (data.tags || []).filter(
          (tag: string) => !tags.includes(tag)
        );
        setSuggestedTags(newSuggestions);
      }
    } catch (error) {
      console.error("Tag suggestion error:", error);
    } finally {
      setIsLoadingTags(false);
    }
  }, [tags]);

  // Trigger tag suggestion when text changes
  useEffect(() => {
    if (tagDebounceRef.current) {
      clearTimeout(tagDebounceRef.current);
    }

    if (text.length >= 30) {
      tagDebounceRef.current = setTimeout(() => {
        suggestTags(text);
      }, 1000);
    } else {
      setSuggestedTags([]);
    }

    return () => {
      if (tagDebounceRef.current) {
        clearTimeout(tagDebounceRef.current);
      }
    };
  }, [text, suggestTags]);

  const addTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setSuggestedTags(suggestedTags.filter((t) => t !== tag));
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setText((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        // Show user-friendly message for common errors
        if (event.error === "network") {
          setMessage({ 
            type: "error", 
            text: "Voice input requires a secure connection (HTTPS) or localhost. Please use the keyboard instead." 
          });
        } else if (event.error === "not-allowed") {
          setMessage({ 
            type: "error", 
            text: "Microphone access denied. Please allow microphone permissions in your browser." 
          });
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

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
          tags: tags,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Quote added successfully!" });
        setText("");
        setAuthorName("");
        setSource("");
        setContext("");
        setTags([]);
        setSuggestedTags([]);
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
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-zinc-300">
            Quote <span className="text-red-500">*</span>
          </label>
          {voiceSupported && (
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                isListening
                  ? "bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Voice
                </>
              )}
            </button>
          )}
        </div>
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isListening ? "Listening... speak now" : "The wisdom you want to share..."}
            className={`w-full px-4 py-3 bg-zinc-900 border rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none ${
              isListening ? "border-red-500/50 ring-2 ring-red-500/20" : "border-zinc-800"
            }`}
            rows={4}
            maxLength={250}
          />
          {isListening && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-400">Recording</span>
            </div>
          )}
        </div>
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

      {/* AI Auto-Tagging */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-sm font-medium text-zinc-300">
            Tags
          </label>
          {isLoadingTags && (
            <div className="flex items-center gap-1 text-xs text-amber-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>AI suggesting...</span>
            </div>
          )}
        </div>

        {/* Selected Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-amber-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* AI Suggested Tags */}
        {suggestedTags.length > 0 && (
          <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-xs text-zinc-400">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>AI suggested tags (click to add)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full text-sm transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {tags.length === 0 && suggestedTags.length === 0 && text.length < 30 && (
          <p className="text-xs text-zinc-500">
            Start typing your quote to get AI tag suggestions
          </p>
        )}
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