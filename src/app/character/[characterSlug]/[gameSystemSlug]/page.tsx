import { getDnd5eCharacterSheetPageProps } from '@lib/next/controllers/Character/Dnd5eCharacterSheetController';
import { getCharacterBySlug } from '@/services/GameSystem/Base/Character/CharacterService';
import { getCharacterSheetBySystem } from '@/services/GameSystem/Base/CharacterSheet/CharacterSheetService';
import { getServerSession } from '@/services/AuthService';
import { Card, CardContent, CardHeader } from '@lib/components/blocks/Card';
import { LinkButton } from '@lib/components/ui/Button';
import { redirect } from 'next/navigation';
import Dnd5eCharacterView from '@lib/components/blocks/Dnd5eCharacterView';

interface CharacterSheetPageProps {
  params: {
    characterSlug: string;
    gameSystemSlug: string;
  };
}

export default async function CharacterSheetPage({ params }: CharacterSheetPageProps) {
  const { characterSlug, gameSystemSlug } = params;
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  // Get character data with character sheets
  const character = await getCharacterBySlug(characterSlug) as any;
  
  // Get character sheets for this character
  const characterSheets = character ? await getCharacterSheetBySystem(
    character.id || '',
    gameSystemSlug === 'dnd5e' ? 'dnd5e' : gameSystemSlug
  ) : null;
  
  // Attach character sheets to character object
  if (character && characterSheets) {
    character.characterSheets = [characterSheets];
  }
  
  if (!character) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <p className="text-gray-500">Character not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user has permission to view this character
  if (character.player !== session?.user?.id) {
    // Check if user is GM of the campaign
    const campaign = character.campaign;
    if (!campaign || !campaign.gms?.includes(session?.user?.id)) {
      return (
        <div className="max-w-4xl mx-auto p-4">
          <Card>
            <CardContent className="flex justify-center items-center h-64">
              <p className="text-gray-500">You don't have permission to view this character</p>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Get game system-specific character sheet
  let characterSheet;
  if (gameSystemSlug === 'dnd5e') {
    const { characterSheet: dnd5eSheet } = await getDnd5eCharacterSheetPageProps(characterSlug);
    characterSheet = dnd5eSheet;
  } else if (gameSystemSlug === 'cypher') {
    // In the future, implement cypher character sheet retrieval
    // const { characterSheet: cypherSheet } = await getCypherCharacterSheetPageProps(characterSlug);
    // characterSheet = cypherSheet;
  } else if (gameSystemSlug === 'sw') {
    // In the future, implement savage worlds character sheet retrieval
    // const { characterSheet: swSheet } = await getSavageWorldsCharacterSheetPageProps(characterSlug);
    // characterSheet = swSheet;
  } else {
    // Unsupported game system
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <p className="text-gray-500">Unsupported game system: {gameSystemSlug}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {character.name} - {gameSystemSlug.toUpperCase()} Sheet
            </h1>
            <div className="flex gap-2">
              <LinkButton 
                href={`/character/${characterSlug}`} 
                variant="outline"
                size="sm"
              >
                Back to Character
              </LinkButton>
              <LinkButton 
                href={`/character/${characterSlug}/${gameSystemSlug}/edit`} 
                variant="primary"
                size="sm"
                icon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                }
              >
                Edit Sheet
              </LinkButton>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {characterSheet ? (
            <>
              {gameSystemSlug === 'dnd5e' && (
                <Dnd5eCharacterView 
                  character={character} 
                  characterSheet={characterSheet} 
                  player={session?.user}
                  campaign={character.campaign || undefined}
                  party={character.party || undefined}
                  world={character.world || undefined}
                />
              )}
              {gameSystemSlug === 'cypher' && (
                <div className="p-4 border border-gray-200 rounded-md">
                  <p className="text-center text-gray-500">Cypher character sheet view not yet implemented</p>
                </div>
              )}
              {gameSystemSlug === 'sw' && (
                <div className="p-4 border border-gray-200 rounded-md">
                  <p className="text-center text-gray-500">Savage Worlds character sheet view not yet implemented</p>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-center text-gray-500">
                No {gameSystemSlug.toUpperCase()} sheet found for this character.
              </p>
              <div className="flex justify-center mt-4">
                <LinkButton 
                  href={`/character/${characterSlug}/${gameSystemSlug}/edit`} 
                  variant="primary"
                  size="sm"
                >
                  Create New Sheet
                </LinkButton>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}