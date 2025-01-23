import { getServerSession } from '@/services/AuthService';
import { getCampaign } from '@/services/CampaignService';
import { getUserByDiscordName } from '@/services/UserService';
import { getWorld } from '@/services/WorldAnvilService';
import { redirect } from 'next/navigation';

export const getCampaignPageProps = async (props: any) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
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