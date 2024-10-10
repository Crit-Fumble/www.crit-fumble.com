import { getServerSession } from '@/services/auth';
import { getCampaignById } from '@/services/campaign';
import { getCharactersByPartyIds } from '@/services/character';
import { getPartyBySlug, getPartiesByParentPartyId, getPartyById } from '@/services/party';
import { getUserByDiscordName } from '@/services/user';
import { getWorld, getWorldById } from '@/services/worldAnvil';
import { redirect } from 'next/navigation';

export const getPartyPageProps = async ({ party: { slug: partySlug }}: any) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const player: any = await getUserByDiscordName(session?.user?.name);
  // const characters: any[] = await getCharactersByPlayerId(player.id);
  const party: any = await getPartyBySlug(partySlug);
  const parentParty = await getPartyById(party.parentParty);
  const subParties: any = await getPartiesByParentPartyId(party.id);
  const subPartyIds = subParties?.map((subParty: any) => subParty.id);
  const rawCharacters: any = await getCharactersByPartyIds([party?.id, ...subPartyIds]);

  const characters: any = await Promise.all(
    rawCharacters?.map(async (character: any) => ({
      ...character,
      party: await getPartyById(character?.party),
    }))
  );

  const campaign: any = await getCampaignById(party?.campaign);
  const world: any = await getWorldById(campaign?.worldAnvil?.id);

  const response = {
    session,
    player,
    party,
    parentParty,
    subParties,
    characters,
    campaign,
    world,
  }

  return response;
};