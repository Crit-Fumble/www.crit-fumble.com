"use server";

import { getWorldViewPageProps } from "@/controllers/WorldController";
import { getBlockById } from "@/services/GameSystem/Base/World/WorldAnvilService";
import WorldView from "@/views/World/WorldView";

const Page = async ({ params: { worldSlug, blockId } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  const block = await getBlockById(blockId);

  // console.log(block);

  return (<WorldView {...props} />);
};

export default Page;
