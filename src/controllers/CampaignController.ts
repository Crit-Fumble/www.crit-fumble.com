import { getServerSession } from '@/services/AuthService';
import { getCampaign, getCampaignBySlug } from '@/services/CampaignService';
import { getCharactersByUserId, getCharactersByCampaignId } from '@/services/CharacterService';
import { getPartiesByCampaignId } from '@/services/PartyService';
import { getUserByDiscordName } from '@/services/UserService';
import { getWorld } from '@/services/WorldAnvilService';
import { redirect } from 'next/navigation';

export const getCampaignPageProps = async (props: { campaign: { slug: string }}) => {
  const campaignSlug = props?.campaign?.slug;
  if (!campaignSlug) {
    redirect(`/`);
  }
  console.log(campaignSlug);

  const session = await getServerSession();
  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(`/campaign/${campaignSlug}`)}`);
  }

  const player: any = await getUserByDiscordName(session?.user?.name);
  const campaign: any = await getCampaignBySlug(campaignSlug);
  const characters: any = await getCharactersByCampaignId(campaign.id);

  if (!player) {
    // TODO: some screen or endpoint that lets them join CFG; I really need a DB
    redirect(`/`);
  }
  if (!characters?.find?.((character: any) => character.player === player.id)) {
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
    ...props,
    player,
    parties,
    characters,
    campaign,
    world,
  }
};