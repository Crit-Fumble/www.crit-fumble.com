"use server";

import { getWorldViewPageProps } from "@/controllers/WorldController";
import WorldView from "@/views/World/WorldView";

const Page = async ({ params: { worldSlug } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  // TODO: show all blocks with client-side filtering
  return (<WorldView {...props}/>);
};

export default Page;
