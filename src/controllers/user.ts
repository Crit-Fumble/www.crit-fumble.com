
import { getCharactersByUserId } from "@/services/character";
import { getPartyById } from "@/services/party";
import { getUserByDiscordName } from "@/services/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const getUserPageProps = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
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
