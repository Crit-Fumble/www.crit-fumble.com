import { getServerSession } from '@/services/auth';
import { getCampaignById } from '@/services/campaign';
import { getCharactersByPartyIds } from '@/services/character';
import { getPartyBySlug, getPartiesByParentPartyId, getPartyById } from '@/services/party';
import { getPlayerByDiscordName } from '@/services/player';
import { getWorld } from '@/services/worldAnvil';
import { redirect } from 'next/navigation';

export const getPartyPageProps = async ({ party: { slug: partySlug }}: any) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const player: any = await getPlayerByDiscordName(session?.user?.name);
  // const characters: any[] = await getCharactersByPlayerId(player.id);
  const party: any = await getPartyBySlug(partySlug);
  const parentParty = await getPartyById(party.parentParty);
  const subParties: any = await getPartiesByParentPartyId(party.id);
  const subPartyIds = subParties?.map((subParty: any) => subParty.id);

  const campaign: any = await getCampaignById(party?.campaign);
  const characters: any = await getCharactersByPartyIds([party?.id, ...subPartyIds]);
  const world: any = await getWorld(campaign?.worldAnvil);

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