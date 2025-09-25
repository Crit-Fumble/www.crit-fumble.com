/**
 * Character Profile Page
 * 
 * Public-facing character profile page accessible via character slug
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '../../lib/auth';

interface CharacterProfilePageProps {
  params: {
    slug: string;
  };
}

export default async function CharacterProfilePage({ params }: CharacterProfilePageProps) {
  const session = await getSession();
  
  // Fetch character by slug
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/characters/slug/${params.slug}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    if (response.status === 404) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Character Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The character you're looking for doesn't exist.</p>
            <Link href="/dashboard/characters" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              View All Characters
            </Link>
          </div>
        </div>
      );
    }
    throw new Error('Failed to load character');
  }

  const { character, isOwner } = await response.json();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Character Portrait */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
            <div className="md:flex">
              {/* Portrait */}
              <div className="md:w-1/3">
                <div className="h-64 md:h-full bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  {character.portrait_url ? (
                    <img
                      src={character.portrait_url}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-8xl text-white">🎭</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Character Info */}
              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {character.name}
                    </h1>
                    {character.title && (
                      <p className="text-xl text-blue-600 dark:text-blue-400 font-medium">
                        {character.title}
                      </p>
                    )}
                  </div>
                  
                  {/* Edit Button (only for owner) */}
                  {isOwner && (
                    <Link
                      href={`/dashboard/characters/edit/${character.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Edit Character
                    </Link>
                  )}
                </div>

                {/* Description */}
                {character.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {character.description}
                    </p>
                  </div>
                )}

                {/* World Anvil Integration */}
                {character.worldanvil_character_id && (
                  <div className="flex items-center text-purple-600 dark:text-purple-400 mb-4">
                    🗺️ <span className="ml-2">Synced with World Anvil</span>
                  </div>
                )}

                {/* Character Metadata */}
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Created: {new Date(character.created_at).toLocaleDateString()}</p>
                  {character.updated_at !== character.created_at && (
                    <p>Updated: {new Date(character.updated_at).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Character Sheets */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Character Sheets</h2>
              {isOwner && (
                <Link
                  href={`/dashboard/characters/sheets/new?characterId=${character.id}`}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Create Sheet
                </Link>
              )}
            </div>

            {character.sheets && character.sheets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {character.sheets.map((sheet: any) => (
                  <div key={sheet.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{sheet.title}</h3>
                      {sheet.rpg_system && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                          {sheet.rpg_system.name}
                        </span>
                      )}
                    </div>
                    
                    {sheet.summary && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{sheet.summary}</p>
                    )}

                    <div className="flex gap-2">
                      <Link
                        href={`/sheets/${sheet.slug}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-3 py-2 rounded text-center text-xs font-medium transition-colors"
                      >
                        View Sheet
                      </Link>
                      {isOwner && (
                        <Link
                          href={`/dashboard/characters/sheets/edit/${sheet.id}`}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-center text-xs font-medium transition-colors"
                        >
                          Edit
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  📋
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Character Sheets
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {isOwner 
                    ? "Create your first character sheet to start playing"
                    : "This character doesn't have any sheets yet"
                  }
                </p>
                {isOwner && (
                  <Link
                    href={`/dashboard/characters/sheets/new?characterId=${character.id}`}
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Create First Sheet
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}