
// a world is any setting where a TTRPG story may take place

// each system will derive it's own world controller from this base controller, but this base controller should be fully functional for worlds without an assigned system, or with an unrecognized system, in World Anvil.

// most of the "world" functionality will be facilitated by integrating with World Anvil directly, using .env variables WORLD_ANVIL_KEY and WORLD_ANVIL_TOKEN; this controller is ONLY the control logic for that functionality

import { getServerSession } from '@/services/AuthService';
import { getCampaignById } from '@/services/GameSystem/Base/Campaign/CampaignService';
import { getPartyBySlug } from '@/services/GameSystem/Base/Party/PartyService';
import { getUserByDiscordId } from '@/services/ProfileService';
import { getBlockById, getBlockFoldersByWorldId, getBlocksByBlockFolderId, getWorld, getWorldBySlug } from '@/services/GameSystem/Base/World/WorldAnvilService';
import { redirect } from 'next/navigation';
import yaml from 'yaml';

export const getWorldPageProps = async (props: any) => {
  const session = await getServerSession();

  if (!session?.user?.id) {
    // TODO: get url for redirect
    redirect("/api/auth/signin");
  }

  const player: any = await getUserByDiscordId(session.user.id);
  const world: any = await getWorld(props?.world);

  return {
    ...props,
    player,
    world,
  }
};

const mapGetBlocksById = async (block: any) => {
  try {
    // console.log(block);

    const newBlock = await getBlockById(block?.id);

    newBlock.data = yaml.parse(newBlock?.textualdata);

    // console.log(newBlock);

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

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const player: any = await getUserByDiscordId(session.user.id);

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

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const player: any = await getUserByDiscordId(session.user.id);
  const world: any = await getWorld(props?.worldAnvil);

  const blockFolders = await getBlockFoldersByWorldId(world.id);

  // console.log(blockFolders);

  return {
    ...props,
    player,
    world,
  }
};