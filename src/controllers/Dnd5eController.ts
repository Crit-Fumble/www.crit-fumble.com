import { srdHandler as _srdHandler } from "@/services/Dnd5eSrd51ApiService";
import { fiveEToolsHandler as _fiveEToolsHandler, fiveEToolsDataHandler as _fiveEToolsDataHandler } from "@/services/FiveEToolsService";
import { getCharactersByUserId } from "@/services/CharacterService";
import { getPartyById } from "@/services/PartyService";
import { getUserByDiscordName } from "@/services/UserService";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const srdApiHandler = _srdHandler;
export const fiveEToolsDataApiHandler = _fiveEToolsDataHandler;
export const fiveEToolsApiHandler = _fiveEToolsHandler;

export const getCompendiumPageProps = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const { user: user } = session;

  // TODO: verify correct user for character

  const player: any = await getUserByDiscordName(user?.name);
  const rawCharacters = await getCharactersByUserId(player.id);

  const characters: any = await Promise.all(
    rawCharacters?.map(async (character: any) => ({
      ...character,
      party: await getPartyById(character?.party),
    }))
  );

  const baseCompendium = await srdApiHandler('/play/dnd5e/api/');
  
  const compendium: any = {
    ...baseCompendium,
    'ability-scores': await srdApiHandler(`/play/dnd5e${baseCompendium?.['ability-scores']}`),
    'alignments': await srdApiHandler(`/play/dnd5e${baseCompendium?.['alignments']}`),
    'equipment-categories': await srdApiHandler(`/play/dnd5e${baseCompendium?.['equipment-categories']}`)
      .then(async res => {
        const results = await Promise.all(res?.results?.map((section: any) => srdApiHandler(`/play/dnd5e${section?.url}`)));

        res.results = results;

        return res;
      }),
    'magic-schools': await srdApiHandler(`/play/dnd5e${baseCompendium?.['magic-schools']}`),
    'rule-sections': await srdApiHandler(`/play/dnd5e${baseCompendium?.['rule-sections']}`)
      .then(async res => {
        const results = await Promise.all(res?.results?.map((section: any) => srdApiHandler(`/play/dnd5e${section?.url}`)));

        res.results = results;

        return res;
      }),
    'skills': await srdApiHandler(`/play/dnd5e${baseCompendium?.['skills']}`),
    'weapon-properties': await srdApiHandler(`/play/dnd5e${baseCompendium?.['weapon-properties']}`),
  }

  console.log(compendium);

  return {
    session,
    player,
    characters,
    compendium,
  }
};
