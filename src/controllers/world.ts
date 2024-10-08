import { getServerSession } from '@/services/auth';
import { getCampaignById } from '@/services/campaign';
import { getPartyBySlug } from '@/services/party';
import { getPlayerByDiscordName } from '@/services/player';
import { getBlockById, getBlockFoldersByWorldId, getBlocksByBlockFolderId, getWorld, getWorldBySlug } from '@/services/worldAnvil';
import { redirect } from 'next/navigation';
import yaml from 'yaml';

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

  const player: any = await getPlayerByDiscordName(session?.user?.name);

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
    throw new Error('World Cannot be found');
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

  const player: any = await getPlayerByDiscordName(session?.user?.name);
  const world: any = await getWorld(props?.worldAnvil);

  const blockFolders = await getBlockFoldersByWorldId(world.id);

  console.log(blockFolders);

  return {
    ...props,
    player,
    world,
  }
};