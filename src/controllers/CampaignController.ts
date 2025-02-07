import { getServerSession } from '@/services/AuthService';
import { getCampaign } from '@/services/CampaignService';
import { getUserByDiscordName } from '@/services/UserService';
import { getWorld } from '@/services/WorldAnvilService';
import { redirect } from 'next/navigation';

export const getCampaignPageProps = async (props: { campaign: { slug: string }}) => {
  const slug = props?.campaign?.slug;
  if (!slug) {
    redirect(`/`);
  }

  const session = await getServerSession();
  if (!session) {
    redirect(`/api/auth/signin?redirect_uri=${encodeURIComponent(`/campaign/${slug}`)}`);
  }

  const player: any = await getUserByDiscordName(session?.user?.name);
  const campaign: any = await getCampaign(props?.campaign);
  const world: any = await getWorld(campaign?.worldAnvil);

  return {
    ...props,
    player,
    campaign,
    world,
  }
};