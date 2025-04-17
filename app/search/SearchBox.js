'use client';
import { useState, useEffect } from 'react';

export default function SearchBox({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!query.trim()) return setSuggestions([]);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const { results } = await res.json();
        setSuggestions(results || []);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full px-4 py-2 rounded-lg border focus:outline-none"
        placeholder="Search medicine..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white rounded-lg shadow mt-1 max-h-60 overflow-auto">
          {suggestions.map((m, i) => (
            <li
              key={i}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(m);
                setQuery('');       // clear the box
                setSuggestions([]); // hide dropdown
              }}
            >
              {m.name} — ₹{m.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
