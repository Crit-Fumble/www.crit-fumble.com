import { getServerSession } from '../../../../../next/services/AuthService';
import { getCharacterBySlug } from '@crit-fumble/next/services/GameSystem/Base/Character/CharacterService';
import { redirect } from 'next/navigation';
import CharacterEditView from '../../../../../next/views/Character/CharacterEditView';

// Define a Character type that matches your Prisma schema
interface Character {
  id: string;
  player?: string | null;
  campaign?: string | null;
  party?: string | null;
  name?: string | null;
  slug?: string | null;
  dnd_beyond_id?: string | null;
  discord?: string | null;
  roll20?: string | null;
  pdf_url?: string | null;
  game_system_id?: string | null;
  campaign_id?: string | null;
  party_id?: string | null;
  sheet_data?: any;
}

export default async function CharacterEditPage({ params }: { params: { characterSlug: string } }) {
  const { characterSlug } = params;
  const session = await getServerSession();

  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/character/${characterSlug}/edit`)}`);
  }

  // Get the character by slug
  const character = await getCharacterBySlug(characterSlug) as Character;
  
  console.log('Character data:', character);
  console.log('Session user ID:', session.user.id);

  // Redirect if character not found
  if (!character || Object.keys(character).length === 0) {
    console.log('Character not found, redirecting to dashboard');
    redirect('/dashboard');
  }

  // Check if user is allowed to edit this character
  console.log('Character data:', character);
  console.log('Session user:', session.user);
  
  // Let's fetch the player record to compare properly
  const getUserByDiscordId = await import('../../../../../next/services/ProfileService').then(m => m.getUserByDiscordId);
  const player = await getUserByDiscordId(session.user.id);
  
  console.log('Player record from Discord ID:', player);
  console.log('Character player ID:', character.player);
  
  // Check if the player ID from the database matches the character's player field
  // This is the correct way to check ownership - using proper type guards
  const isOwner = player && typeof player === 'object' && 'id' in player && 
                  player.id === character.player;
  
  console.log('Is owner check result:', isOwner);
  
  // If not the owner, redirect
  if (!isOwner) {
    console.log('User is not the owner of this character');
    redirect(`/character/${character.slug}`);
  }

  return <CharacterEditView session={session} character={character} />;
}
