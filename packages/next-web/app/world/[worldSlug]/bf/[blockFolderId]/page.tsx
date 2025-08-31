"use server";

import { getWorldViewPageProps } from "@cfg/next/controllers/GameSystem/Base/World/WorldController";
import { getBlockById, getBlocksByBlockFolderId } from "@cfg/next/services/GameSystem/Base/World/WorldAnvilService";
import WorldView from "../../../../../../next/views/World/WorldView";

const Page = async ({ params: { worldSlug, blockFolderId } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  const blocks = await getBlocksByBlockFolderId(blockFolderId);

  // console.log(blocks);

  return (<WorldView {...props} />);
};

export default Page;
