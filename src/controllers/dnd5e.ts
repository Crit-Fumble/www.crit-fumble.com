import { handler as _apiHandler } from "@/services/dnd5eSrd51Api";
import { getCharactersByUserId } from "@/services/character";
import { getPartyById } from "@/services/party";
import { getUserByDiscordName } from "@/services/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const apiHandler = _apiHandler;

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

  const baseCompendium = await apiHandler('/play/dnd5e/api/');
  
  const compendium: any = {
    ...baseCompendium,
    'ability-scores': await apiHandler(`/play/dnd5e${baseCompendium?.['ability-scores']}`),
    'alignments': await apiHandler(`/play/dnd5e${baseCompendium?.['alignments']}`),
    'equipment-categories': await apiHandler(`/play/dnd5e${baseCompendium?.['equipment-categories']}`)
      .then(async res => {
        const results = await Promise.all(res?.results?.map((section: any) => apiHandler(`/play/dnd5e${section?.url}`)));

        res.results = results;

        return res;
      }),
    'magic-schools': await apiHandler(`/play/dnd5e${baseCompendium?.['magic-schools']}`),
    'rule-sections': await apiHandler(`/play/dnd5e${baseCompendium?.['rule-sections']}`)
      .then(async res => {
        const results = await Promise.all(res?.results?.map((section: any) => apiHandler(`/play/dnd5e${section?.url}`)));

        res.results = results;

        return res;
      }),
    'skills': await apiHandler(`/play/dnd5e${baseCompendium?.['skills']}`),
    'weapon-properties': await apiHandler(`/play/dnd5e${baseCompendium?.['weapon-properties']}`),
  }

  console.log(compendium);

  return {
    session,
    player,
    characters,
    compendium,
  }
};
