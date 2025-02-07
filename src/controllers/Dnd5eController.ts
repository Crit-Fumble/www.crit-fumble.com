import { srdHandler as _srdHandler } from "@/services/Dnd5eSrdApiService";
import { fiveEToolsHandler as _fiveEToolsHandler, fiveEToolsDataHandler as _fiveEToolsDataHandler } from "@/services/FiveEToolsService";
import { getCharactersByPlayerId } from "@/services/CharacterService";
import { getPartyById } from "@/services/PartyService";
import { getUserByDiscordId } from "@/services/ProfileService";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const srdApiHandler = _srdHandler;
export const fiveEToolsDataApiHandler = _fiveEToolsDataHandler;
export const fiveEToolsApiHandler = _fiveEToolsHandler;

export const getCompendiumPageProps = async () => {
  const session = await getServerSession();

  if (!session?.user?.id) {
    // TODO: get url for redirect
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/system/dnd5e`)}`);
  }

  const { user: user } = session;

  // TODO: verify correct user for character

  const profile: any = await getUserByDiscordId(user?.id);
  const rawCharacters = await getCharactersByPlayerId(profile.id);

  const characters: any = await Promise.all(
    rawCharacters?.map(async (character: any) => ({
      ...character,
      party: await getPartyById(character?.party),
    }))
  );

  return {
    session,
    profile,
    characters,
  }
};
