"use server";

import { getWorldViewPageProps } from "@lib/next/controllers/GameSystem/Base/World/WorldController";
import WorldView from "@/views/GameSystem/Base/World/WorldView";

const Page = async ({ params: { worldSlug } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  // TODO: show all block folders
  return (<WorldView {...props}/>);
};

export default Page;
