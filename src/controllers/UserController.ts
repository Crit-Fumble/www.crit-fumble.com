import { handler as _authHandler, getServerSession as _getServerSession } from '@/services/AuthService'
import { getCharactersByUserId } from "@/services/CharacterService";
import { getPartyById } from "@/services/PartyService";
import { getUserByDiscordName, getUserBySlug } from "@/services/UserService";
import { redirect } from "next/navigation";

export const getUserProfilePageProps = async (userSlug: string) => {
  const session = await getServerSession();

  if (!session) {
    // TODO: get url for redirect
    redirect("/auth/signin");
  }

  const { user: sessionUser } = session;

  // TODO: verify correct user for character

  const viewedUser: any = await getUserBySlug(userSlug);
  // const user: any = await getUserByDiscordName(sessionUser?.name);
  const rawCharacters = await getCharactersByUserId(viewedUser.id);

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

  if (!session) {
    // TODO: get url for redirect
    redirect("/auth/signin");
  }

  const { user: sessionUser } = session;
  const user: any = await getUserByDiscordName(sessionUser?.name);
  const rawCharacters = await getCharactersByUserId(user.id);

  const characters: any = await Promise.all(
    rawCharacters?.map(async (character: any) => ({
      ...character,
      party: await getPartyById(character?.party),
      league: (character?.party?.parentParty && (await getPartyById(character?.party?.parentParty))) ?? undefined,
    }))
  );

  return {
    session,
    user,
    characters,
  }
};

export const authHandler = _authHandler;
export const getServerSession = _getServerSession;