/**
 * Character Edit Page
 * 
 * Form to edit an existing character
 */

import { redirect } from 'next/navigation';
import { getSession } from '../../../../lib/auth';
import CharacterForm from '../../../../components/characters/CharacterForm';

interface CharacterEditPageProps {
  params: {
    id: string;
  };
}

export default async function CharacterEditPage({ params }: CharacterEditPageProps) {
  const session = await getSession();
  if (!session) {
    redirect('/');
  }

  // Fetch character data
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/characters/${params.id}`, {
    cache: 'no-store',
    headers: {
      'user-id': session.id
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      redirect('/dashboard/characters');
    }
    throw new Error('Failed to load character');
  }

  const { character } = await response.json();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Character: {character.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Update your character information and World Anvil integration
            </p>
          </div>

          {/* Character Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <CharacterForm 
              mode="edit" 
              userId={session.id}
              initialData={character}
            />
          </div>
        </div>
      </div>
    </div>
  );
}