import { getServerSession } from '@/services/auth';
import { getCampaignById } from '@/services/campaign';
import { getCharactersByPlayerId } from '@/services/character';
import { getPartyBySlug } from '@/services/party';
import { getPlayerByDiscordName } from '@/services/player';
import { getWorld } from '@/services/worldAnvil';
import { redirect } from 'next/navigation';

export const getPartyPageProps = async ({ party: { slug: partySlug }, ...props}: any) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const player: any = await getPlayerByDiscordName(session?.user?.name);
  // const characters: any[] = await getCharactersByPlayerId(player.id);
  const party: any = await getPartyBySlug(partySlug);
  const campaign: any = await getCampaignById(party?.campaign);
  const world: any = await getWorld(campaign?.worldAnvil);

  const response = {
    ...props,
    session,
    player,
    party,
    campaign,
    world,
  }

  return response;
};