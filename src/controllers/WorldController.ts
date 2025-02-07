import { getServerSession } from '@/services/AuthService';
import { getCampaignById } from '@/services/CampaignService';
import { getPartyBySlug } from '@/services/PartyService';
import { getUserByDiscordName } from '@/services/UserService';
import { getBlockById, getBlockFoldersByWorldId, getBlocksByBlockFolderId, getWorld, getWorldBySlug } from '@/services/WorldAnvilService';
import { redirect } from 'next/navigation';
import yaml from 'yaml';

export const getWorldPageProps = async (props: any) => {
  const session = await getServerSession();

  if (!session) {
    // TODO: get url for redirect
    redirect("/api/auth/signin");
  }

  const player: any = await getUserByDiscordName(session?.user?.name);
  const world: any = await getWorld(props?.world);

  return {
    ...props,
    player,
    world,
  }
};

const mapGetBlocksById = async (block: any) => {
  try {
    console.log(block);

    const newBlock = await getBlockById(block?.id);

    newBlock.data = yaml.parse(newBlock?.textualdata);

    console.log(newBlock);

    return newBlock;
  } catch (err) {
    return block;
  }
};

const mapGetBlockEntities = async (blockFolder: any) => {
  try {
    const blockFolderBlocks = await getBlocksByBlockFolderId(blockFolder.id);

    // console.log(blockFolderBlocks);

    const newBlocks = await Promise.all(blockFolderBlocks.entities.map(mapGetBlocksById));

    return {
      ...blockFolder,
      entities: newBlocks,
    };
  } catch (err: any) {
    console.error(err);

    return blockFolder;
  }
};

export const getWorldViewPageProps = async (props: any) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const player: any = await getUserByDiscordName(session?.user?.name);

  let worldSlug: any = props?.worldAnvil?.slug;

  // Hadoken!
  if (!worldSlug) {
    const partySlug = props?.party?.slug;
    if (partySlug) {
      const party: any = await getPartyBySlug(partySlug);
      const campaignId = party?.campaign;
      if (campaignId) {
        const campaign: any = await getCampaignById(campaignId);
        worldSlug = campaign?.worldAnvil?.slug;
      }
    }
  }

  if (!worldSlug) {
    console.error('World Cannot be found');

    return {
      ...props,
      player,
    }
  }

  try {
    const world = await getWorldBySlug(worldSlug);
  
    // console.log(world);
  
    world.blockFolders = await getBlockFoldersByWorldId(world?.id);
    // const newEntities = await Promise.all(world.blockFolders.entities?.map(mapGetBlockEntities));
    
    // world.blockFolders.entities = newEntities;
  
    return {
      ...props,
      player,
      world,
    }
  } catch (err) {

    return {
      ...props,
      player,
    }
  }
};

export const getWorldHomePageProps = async (props: any) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const player: any = await getUserByDiscordName(session?.user?.name);
  const world: any = await getWorld(props?.worldAnvil);

  const blockFolders = await getBlockFoldersByWorldId(world.id);

  console.log(blockFolders);

  return {
    ...props,
    player,
    world,
  }
};