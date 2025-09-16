"use server";

import { getWorldViewPageProps } from "@crit-fumble/next/controllers/RpgSystem/Base/World/WorldController";
import { getBlockById, getBlocksByBlockFolderId } from "@crit-fumble/next/services/RpgSystem/Base/World/WorldAnvilService";
import WorldView from "../../../../../../next/client/views/World/WorldView";

const Page = async ({ params: { worldSlug, blockFolderId } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  const blocks = await getBlocksByBlockFolderId(blockFolderId);

  // console.log(blocks);

  return (<WorldView {...props} />);
};

export default Page;
