
import { getCharactersByPlayerId } from "@/services/character";
import { getPartyById } from "@/services/party";
import { getPlayerByDiscordName } from "@/services/player";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const getPlayerPageProps = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const { user: user } = session;

  // TODO: verify correct user for character

  const player: any = await getPlayerByDiscordName(user?.name);
  const rawCharacters = await getCharactersByPlayerId(player.id);

  const characters: any = await Promise.all(
    rawCharacters?.map(async (character: any) => ({
      ...character,
      party: await getPartyById(character?.party),
    }))
  );

  return {
    session,
    player,
    characters,
  }
};
