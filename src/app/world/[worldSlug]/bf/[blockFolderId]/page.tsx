"use server";

import { getWorldViewPageProps } from "@/controllers/WorldController";
import { getBlockById, getBlocksByBlockFolderId } from "@/services/GameSystem/Base/World/WorldAnvilService";
import WorldView from "@/views/World/WorldView";

const Page = async ({ params: { worldSlug, blockFolderId } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  const blocks = await getBlocksByBlockFolderId(blockFolderId);

  // console.log(blocks);

  return (<WorldView {...props} />);
};

export default Page;
