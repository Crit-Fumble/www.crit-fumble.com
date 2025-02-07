import { getServerSession } from '@/services/AuthService';
import { getCampaignBySlug } from '@/services/CampaignService';
import { getCharactersByCampaignId } from '@/services/CharacterService';
import { getPartiesByCampaignId } from '@/services/PartyService';
import { getUserByDiscordId } from '@/services/ProfileService';
import { getWorld } from '@/services/WorldAnvilService';
import { redirect } from 'next/navigation';

export const getCampaignPageProps = async (campaignSlug: string) => {
  if (!campaignSlug) {
    redirect(`/`);
  }
  // console.log(campaignSlug);

  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/campaign/${campaignSlug}`)}`);
  }

  const profile: any = await getUserByDiscordId(session.user.id);
  const campaign: any = await getCampaignBySlug(campaignSlug);
  const characters: any = await getCharactersByCampaignId(campaign.id);

  if (!profile) {
    // TODO: some screen or endpoint that lets them join CFG; I really need a DB
    redirect(`/`);
  }
  if (!characters?.find?.((character: any) => character.player === profile.id)) {
    // TODO: some screen that lets them create a character; I really need a DB
    redirect(`/`);
  }
  if (!campaign) {
    // TODO: some screen that lets them create a campaign; I really need a DB
    redirect(`/`);
  }


  const parties: any = await getPartiesByCampaignId((await campaign).id);
  const world: any = await getWorld(campaign?.worldAnvil);

  return {
    profile,
    parties,
    characters,
    campaign,
    world,
  }
};