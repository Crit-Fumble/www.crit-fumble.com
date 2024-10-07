import { getServerSession } from '@/services/auth';
import { getCampaign } from '@/services/campaign';
import { getPlayerByDiscordName } from '@/services/player';
import { getWorld } from '@/services/worldAnvil';
import { redirect } from 'next/navigation';

export const getCampaignPageProps = async (props: any) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const player: any = await getPlayerByDiscordName(session?.user?.name);
  const campaign: any = await getCampaign(props?.campaign);
  const world: any = await getWorld(campaign?.worldAnvil);

  return {
    ...props,
    player,
    campaign,
    world,
  }
};