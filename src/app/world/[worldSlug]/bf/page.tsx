"use server";

import { getWorldViewPageProps } from "@/controllers/WorldController";
import WorldView from "@/views/World/WorldView";

const Page = async ({ params: { worldSlug } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  // TODO: show all block folders
  return (<WorldView {...props}/>);
};

export default Page;
