/**
 * JSON Editor Component
 * 
 * Provides a JSON editor with syntax highlighting, validation,
 * and proper formatting for editing user data fields.
 */

'use client';

import React, { useState, useEffect } from 'react';

interface JsonEditorProps {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export function JsonEditor({
  value,
  onChange,
  placeholder = 'Enter JSON data...',
  className = '',
  readOnly = false
}: JsonEditorProps) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  // Initialize with value
  useEffect(() => {
    if (value !== undefined) {
      try {
        setJsonText(JSON.stringify(value, null, 2));
        setError(null);
        setIsValid(true);
      } catch (err) {
        setJsonText(String(value));
        setError('Invalid JSON value provided');
        setIsValid(false);
      }
    }
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setJsonText(newText);

    if (!newText.trim()) {
      // Empty is valid
      setError(null);
      setIsValid(true);
      onChange?.(null);
      return;
    }

    try {
      const parsed = JSON.parse(newText);
      setError(null);
      setIsValid(true);
      onChange?.(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setIsValid(false);
    }
  };

  const formatJson = () => {
    if (!jsonText.trim()) return;

    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      setError(null);
      setIsValid(true);
    } catch (err) {
      // Don't change text if invalid
    }
  };

  const minifyJson = () => {
    if (!jsonText.trim()) return;

    try {
      const parsed = JSON.parse(jsonText);
      const minified = JSON.stringify(parsed);
      setJsonText(minified);
      setError(null);
      setIsValid(true);
    } catch (err) {
      // Don't change text if invalid
    }
  };

  const clearJson = () => {
    setJsonText('');
    setError(null);
    setIsValid(true);
    onChange?.(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Controls */}
      {!readOnly && (
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={formatJson}
            disabled={!isValid || !jsonText.trim()}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Format
          </button>
          <button
            type="button"
            onClick={minifyJson}
            disabled={!isValid || !jsonText.trim()}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Minify
          </button>
          <button
            type="button"
            onClick={clearJson}
            disabled={!jsonText.trim()}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
      )}

      {/* JSON Textarea */}
      <div className="relative">
        <textarea
          value={jsonText}
          onChange={handleTextChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full px-3 py-2 border rounded font-mono text-sm resize-vertical min-h-32 focus:outline-none focus:ring-2 ${
            isValid
              ? 'border-gray-300 focus:ring-blue-500'
              : 'border-red-300 focus:ring-red-500 bg-red-50'
          } ${readOnly ? 'bg-gray-50' : ''}`}
          rows={8}
        />
        
        {/* Validation indicator */}
        <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
          jsonText.trim() === '' 
            ? 'bg-gray-300' 
            : isValid 
              ? 'bg-green-500' 
              : 'bg-red-500'
        }`} />
      </div>

      {/* Error message */}
      {error && (
        <div className="text-red-600 text-sm">
          <strong>JSON Error:</strong> {error}
        </div>
      )}

      {/* Character count */}
      <div className="text-xs text-gray-500 text-right">
        {jsonText.length} characters
      </div>
    </div>
  );
}

/**
 * Simple JSON Display Component
 * 
 * For read-only display of JSON data with syntax highlighting
 */
export function JsonDisplay({ value, className = '' }: { value: any; className?: string }) {
  if (value === null || value === undefined) {
    return <div className={`text-gray-500 italic ${className}`}>No data</div>;
  }

  try {
    const formatted = JSON.stringify(value, null, 2);
    return (
      <pre className={`bg-gray-50 p-3 rounded text-sm overflow-auto font-mono ${className}`}>
        {formatted}
      </pre>
    );
  } catch (err) {
    return (
      <div className={`text-red-600 italic ${className}`}>
        Invalid JSON data
      </div>
    );
  }
}