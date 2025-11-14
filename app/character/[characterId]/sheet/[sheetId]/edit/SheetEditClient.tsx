'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SheetEditClientProps {
  sheet: {
    id: string;
    title: string;
    worldanvil_block_id: string;
  };
  character: {
    id: string;
    name: string;
  };
}

export default function SheetEditClient({ sheet, character }: SheetEditClientProps) {
  const [isLoading, setIsLoading] = useState(true);

  const worldAnvilEditUrl = `https://www.worldanvil.com/heroes/sheet/${sheet.worldanvil_block_id}/edit`;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/character/${character.id}`}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm mb-1 block"
              >
                ← Back to {character.name}
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {sheet.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Editing in World Anvil
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={worldAnvilEditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Open in New Tab →
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Editing in World Anvil
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                You're editing your character sheet directly in World Anvil. Changes are saved automatically by World Anvil.
                If the iframe doesn't load, click "Open in New Tab" above to edit in a separate window.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 280px)' }}>
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading World Anvil editor...</p>
              </div>
            </div>
          )}
          <iframe
            src={worldAnvilEditUrl}
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            title={`Edit ${sheet.title}`}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            allow="fullscreen"
          />
        </div>
      </div>

      {/* Footer with additional info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Having trouble? Try{' '}
            <a
              href={worldAnvilEditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              opening the editor in a new window
            </a>
            {' '}or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
