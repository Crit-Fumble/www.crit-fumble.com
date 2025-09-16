"use server";

import { getWorldViewPageProps } from "@crit-fumble/next/controllers/RpgSystem/Base/World/WorldController";
import { getBlockById } from "@crit-fumble/next/services/RpgSystem/Base/World/WorldAnvilService";
import WorldView from "../../../../../../next/client/views/World/WorldView";

const Page = async ({ params: { worldSlug, blockId } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  const block = await getBlockById(blockId);

  // console.log(block);

  return (<WorldView {...props} />);
};

export default Page;
