/**
 * Character Management Dashboard - List View
 * 
 * Shows all characters for the current user with options to create, edit, or view
 */

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';
import Link from 'next/link';

export default async function CharacterListPage() {
  const session = await getSession();
  if (!session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Characters</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your RPG characters and their sheets
            </p>
          </div>
          <Link
            href="/dashboard/characters/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create New Character
          </Link>
        </div>

        {/* Character List */}
        <Suspense fallback={<CharacterListSkeleton />}>
          <CharacterList userId={session.id} />
        </Suspense>
      </div>
    </div>
  );
}

async function CharacterList({ userId }: { userId: string }) {
  // Fetch characters from API
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/characters?userId=${userId}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    return <div className="text-center py-12">Failed to load characters</div>;
  }

  const { characters } = await response.json();

  if (characters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
          🎭
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          No Characters Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Create your first character to get started with character sheets and World Anvil integration.
        </p>
        <Link
          href="/dashboard/characters/new"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Create Your First Character
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {characters.map((character: any) => (
        <div key={character.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Character Portrait */}
          <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
            {character.portrait_url ? (
              <img
                src={character.portrait_url}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-6xl text-white">🎭</span>
              </div>
            )}
            {/* Character Level Badge (if has sheets) */}
            {character.rpg_sheets?.length > 0 && (
              <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                Sheets: {character.rpg_sheets.length}
              </div>
            )}
          </div>

          {/* Character Info */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {character.name}
            </h3>
            {character.title && (
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">
                {character.title}
              </p>
            )}
            {character.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {character.description}
              </p>
            )}

            {/* World Anvil Status */}
            {character.worldanvil_character_id && (
              <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm mb-4">
                🗺️ <span className="ml-1">Synced with World Anvil</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Link
                href={`/character/${character.slug}`}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded text-center text-sm font-medium transition-colors"
              >
                View Profile
              </Link>
              <Link
                href={`/dashboard/characters/edit/${character.id}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center text-sm font-medium transition-colors"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CharacterListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
            <div className="flex gap-2">
              <div className="flex-1 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="flex-1 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}