'use client';
import { useState, useEffect } from 'react';

export default function SearchBox({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === '') {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`/api/search?query=${query}`);
        const data = await res.json();
        setSuggestions(data.results?.map(r => r.name) || []);

        setShowDropdown(true);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative w-full max-w-md mx-auto mt-6">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          if (value.trim() === '') {
            onSelect(null);
          } else {
            onSelect(value);
          }
        }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        onFocus={() => {
          if (suggestions.length > 0) setShowDropdown(true);
        }}
        placeholder="Search medicine..."
        className="border border-gray-300 rounded-md px-4 py-2 w-full shadow-sm focus:outline-none focus:border-blue-400"
      />

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-200 rounded-md w-full shadow-md z-10 mt-1">
          {suggestions.map((name, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setQuery(name);
                setShowDropdown(false);
                onSelect(name);
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
