import { handler as _authHandler, getServerSession as _getServerSession } from '@/services/AuthService'
import { getCharactersByUserId } from "@/services/CharacterService";
import { getPartyById } from "@/services/PartyService";
import { getUserByDiscordName } from "@/services/UserService";
import { redirect } from "next/navigation";

export const getUserPageProps = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin");
  }

  const { user: sessionUser } = session;

  // TODO: verify correct user for character

  const user: any = await getUserByDiscordName(sessionUser?.name);
  const rawCharacters = await getCharactersByUserId(user.id);

  const characters: any = await Promise.all(
    rawCharacters?.map(async (character: any) => ({
      ...character,
      party: await getPartyById(character?.party),
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