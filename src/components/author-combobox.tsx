"use client";

import { useState, useEffect } from "react";

interface AuthorComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

interface Author {
  id: string;
  name: string;
}

export function AuthorCombobox({ value, onChange }: AuthorComboboxProps) {
  const [suggestions, setSuggestions] = useState<Author[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      if (value.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/authors?search=${encodeURIComponent(value)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.authors || []);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Author search error:", error);
      }
    };

    const debounce = setTimeout(fetchAuthors, 300);
    return () => clearTimeout(debounce);
  }, [value]);

  const handleSelect = (author: Author) => {
    onChange(author.name);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder="Start typing to search or add new..."
        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
      />
      
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg max-h-48 overflow-auto">
          {suggestions.map((author) => (
            <button
              key={author.id}
              type="button"
              onClick={() => handleSelect(author)}
              className="w-full px-4 py-2 text-left text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              {author.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}