import { getServerSession } from '@/services/AuthService';
import { getCharacterBySlug } from '@/services/CharacterService';
import { redirect } from 'next/navigation';
import CharacterEditView from '@/views/Character/CharacterEditView';

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

  // Redirect if character not found
  if (!character || Object.keys(character).length === 0) {
    redirect('/dashboard');
  }

  // Check if user is allowed to edit this character
  const isOwner = character.player === session.user.id;
  
  // If not the owner, redirect
  if (!isOwner) {
    // TODO: Add GM permission check here if needed
    redirect(`/character/${character.slug}`);
  }

  return <CharacterEditView session={session} character={character} />;
}
