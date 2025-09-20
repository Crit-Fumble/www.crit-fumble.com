/**
 * User Autocomplete Component
 * 
 * Provides autocomplete functionality for user selection
 * with search and suggestions from the API.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface UserSuggestion {
  id: string;
  label: string;
  value: string;
}

interface UserAutocompleteProps {
  value?: string;
  onChange?: (userId: string | null) => void;
  placeholder?: string;
  className?: string;
}

export function UserAutocomplete({
  value = '',
  onChange,
  placeholder = 'Search users...',
  className = ''
}: UserAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Load suggestions when query changes
  useEffect(() => {
    const loadSuggestions = async () => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/admin/users/suggestions?q=${encodeURIComponent(query)}&limit=10`);
        
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setIsOpen(data.length > 0);
          setSelectedIndex(-1);
        } else {
          setSuggestions([]);
          setIsOpen(false);
        }
      } catch (error) {
        console.error('Error loading suggestions:', error);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(loadSuggestions, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // If query is cleared, clear selection
    if (!newQuery) {
      onChange?.(null);
    }
  };

  const handleSelectSuggestion = (suggestion: UserSuggestion) => {
    setQuery(suggestion.label);
    setIsOpen(false);
    setSelectedIndex(-1);
    onChange?.(suggestion.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay closing to allow for clicks on suggestions
    setTimeout(() => {
      if (!listRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  // Initialize with current value
  useEffect(() => {
    if (value && !query) {
      // Optionally load the display name for the current value
      // For now, just show the ID
      setQuery(value);
    }
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => {
          if (suggestions.length > 0) {
            setIsOpen(true);
          }
        }}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="off"
      />
      
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              className={`px-3 py-2 cursor-pointer ${
                index === selectedIndex
                  ? 'bg-blue-100 text-blue-900'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleSelectSuggestion(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="font-medium">{suggestion.label}</div>
              <div className="text-sm text-gray-500">ID: {suggestion.id}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}