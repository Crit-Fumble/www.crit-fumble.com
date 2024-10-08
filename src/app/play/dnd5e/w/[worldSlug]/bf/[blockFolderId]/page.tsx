"use server";

import { getWorldViewPageProps } from "@/controllers/world";
import { getBlockById, getBlocksByBlockFolderId } from "@/services/worldAnvil";
import WorldView from "@/views/pages/World/View";

const Page = async ({ params: { worldSlug, blockFolderId } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  const blocks = await getBlocksByBlockFolderId(blockFolderId);

  console.log(blocks);

  return (<WorldView {...props} />);
};

export default Page;
