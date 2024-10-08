"use server";

import { getWorldViewPageProps } from "@/controllers/world";
import { getBlockById } from "@/services/worldAnvil";
import WorldView from "@/views/pages/World/View";

const Page = async ({ params: { worldSlug, blockId } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  const block = await getBlockById(blockId);

  console.log(block);

  return (<WorldView {...props} />);
};

export default Page;
