import { getServerSession } from '@/services/AuthService';
import { getCampaignById } from '@/services/CampaignService';
import { getCharacterBySlug } from '@/services/CharacterService';
import { getPartyById, getPartyBySlug } from '@/services/PartyService';
import { getUserByDiscordName } from '@/services/UserService';
import { getWorld } from '@/services/WorldAnvilService';
import { redirect } from 'next/navigation';

export const getCharacterPageProps = async ({ character: { slug: characterSlug }, ...incProps}: any) => {
  if (!characterSlug) {
    redirect("/");
  }
  const session = await getServerSession();

  if (!session) {
    // TODO: get url for redirect
    redirect(`/api/auth/signin?redirect_uri=${encodeURIComponent(`/character/${characterSlug}`)}`);
  }

  // const user: any = await getUser(props?.user);
  const player: any = await getUserByDiscordName(session?.user?.name);
  const character: any = await getCharacterBySlug(characterSlug);
  // TODO: ensure character is in party
  const party: any = await getPartyById(character?.party);
  const parentParty: any = await getPartyById(party?.parentParty);

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

  return outProps;
};