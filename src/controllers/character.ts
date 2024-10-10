import { getServerSession } from '@/services/auth';
import { getCampaignById } from '@/services/campaign';
import { getCharacterBySlug } from '@/services/character';
import { getPartyById, getPartyBySlug } from '@/services/party';
import { getUserByDiscordName } from '@/services/user';
import { getWorld } from '@/services/worldAnvil';
import { redirect } from 'next/navigation';

export const getCharacterPageProps = async ({ character: { slug: characterSlug }, party: { slug: partySlug }, ...incProps}: any) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  // const user: any = await getUser(props?.user);
  const player: any = await getUserByDiscordName(session?.user?.name);
  const party: any = await getPartyBySlug(partySlug);
  const parentParty: any = await getPartyById(party?.parentParty);
  const character: any = await getCharacterBySlug(characterSlug);
  // TODO: ensure character is in party, otherwise, redirect to correct party and route

  const campaign: any = await getCampaignById(party?.campaign);
  const world: any = await getWorld(campaign?.worldAnvil);
  // const party: any = await getParty();
  // const league: any = await getParties(;
  // const guild: any = await getParties();
  // const world: any = await getWorld();

  // const character: any = campaign?.find;

  const outProps = {
    ...incProps,
    session,
    player,
    campaign,
    party,
    parentParty,
    character,
    world,
  }

  console.log(outProps);

  return outProps;
};