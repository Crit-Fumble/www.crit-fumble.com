"use server";

import { getWorldViewPageProps } from "@cfg/next/controllers/GameSystem/Base/World/WorldController";
import { getBlockById } from "@/services/GameSystem/Base/World/WorldAnvilService";
import WorldView from "@cfg/next/views/GameSystem/Base/World/WorldView";

const Page = async ({ params: { worldSlug, blockId } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  const block = await getBlockById(blockId);

  // console.log(block);

  return (<WorldView {...props} />);
};

export default Page;
