"use server";

import { getWorldViewPageProps } from "@crit-fumble/next/controllers/GameSystem/Base/World/WorldController";
import { getBlockById } from "@crit-fumble/next/services/GameSystem/Base/World/WorldAnvilService";
import WorldView from "../../../../../../next/views/World/WorldView";

const Page = async ({ params: { worldSlug, blockId } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  const block = await getBlockById(blockId);

  // console.log(block);

  return (<WorldView {...props} />);
};

export default Page;
