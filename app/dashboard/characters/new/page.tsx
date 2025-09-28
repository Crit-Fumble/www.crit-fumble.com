/**
 * Character Creation Page
 * 
 * Form to create a new character with basic information
 * Integrates with World Anvil for character block creation
 */

import { redirect } from 'next/navigation';
import { getSession } from '../../../lib/auth';
import CharacterForm from '../../../lib/components/characters/CharacterForm';

export default async function NewCharacterPage() {
  const session = await getSession();
  if (!session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Character</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create a character profile and optionally sync with World Anvil
            </p>
          </div>

          {/* Character Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <CharacterForm mode="create" userId={session.id} />
          </div>
        </div>
      </div>
    </div>
  );
}