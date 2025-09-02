import { createAuthHandler, createServerSessionGetter, createAuthConfig } from '../../services/AuthService';
import { getCharactersByPlayerId } from "../../services/Character/CharacterService";
import { getPartyById } from "../../services/Party/PartyService";
import { getUserByDiscordId, getUserBySlug } from "../../services/ProfileService";
import { redirect } from "next/navigation";

export const getUserProfilePageProps = async (userSlug: string) => {
  const session = await getServerSession();

  if (!session?.user?.id) {
    // TODO: get url for redirect
    redirect("/auth/signin");
  }

  const sessionUser: any = await getUserByDiscordId(session?.user?.id);
  const viewedUser: any = await getUserBySlug(userSlug);
  // const user: any = await getUserByDiscordName(sessionUser?.name);
  const rawCharacters = await getCharactersByPlayerId(viewedUser.id);

  const characters: any = await Promise.all(
    rawCharacters?.map(async (character: any) => ({
      ...character,
      party: await getPartyById(character?.party),
      league: (character?.party?.parentParty && (await getPartyById(character?.party?.parentParty))) ?? undefined,
    }))
  );

  return {
    session,
    viewedUser,
    sessionUser,
    characters,
  }
};
export const getUserDashboardPageProps = async () => {
  const session = await getServerSession();

  if (!session?.user?.id) {
    // TODO: get url for redirect
    redirect("/auth/signin");
  }

  const sessionUser: any = await getUserByDiscordId(session?.user?.id);
  const viewedUser: any = sessionUser;
  const rawCharacters = await getCharactersByPlayerId(sessionUser.id);

  return {
    sessionUser,
    viewedUser,
    characters: await Promise.all(
      rawCharacters?.map(async (character: any) => ({
        ...character,
        party: await getPartyById(character?.party),
        league: (character?.party?.parentParty && (await getPartyById(character?.party?.parentParty))) ?? undefined,
      }))
    )
  };
};

/**
 * Updates user information by making a POST request to the user API
 * @param updateData Object containing the fields to update (roll20, dd_beyond, world_anvil)
 * @returns Promise that resolves to the updated user data or throws an error
 */
export const updateUserInfo = async (updateData: {
  roll20?: string;
  dd_beyond?: string;
  world_anvil?: string;
}) => {
  try {
    // Ensure at least one field is being updated
    if (!updateData.roll20 && !updateData.dd_beyond && !updateData.world_anvil) {
      throw new Error('At least one field (roll20, dd_beyond, or world_anvil) must be provided');
    }

    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update user information');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user info:', error);
    throw error;
  }
};

// Using default config from environment variables
const defaultAuthConfig = createAuthConfig({
  clientId: process.env.DISCORD_WEB_APP_ID ?? '',
  clientSecret: process.env.DISCORD_WEB_SECRET ?? '',
});

export const authHandler = createAuthHandler(defaultAuthConfig);
export const getServerSession = createServerSessionGetter(defaultAuthConfig);