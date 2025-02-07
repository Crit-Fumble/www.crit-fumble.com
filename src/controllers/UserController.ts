import { handler as _authHandler, getServerSession as _getServerSession } from '@/services/AuthService'
import { getCharactersByPlayerId } from "@/services/CharacterService";
import { getPartyById } from "@/services/PartyService";
import { getUserByDiscordId, getUserBySlug } from "@/services/ProfileService";
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

  const characters: any = await Promise.all(
    rawCharacters?.map(async (character: any) => ({
      ...character,
      // party: await getPartyById(character?.party),
      // league: (character?.party?.parentParty && (await getPartyById(character?.party?.parentParty))) ?? undefined,
    }))
  );

  return {
    session,
    viewedUser,
    sessionUser,
    characters,
  }
};

export const authHandler = _authHandler;
export const getServerSession = _getServerSession;