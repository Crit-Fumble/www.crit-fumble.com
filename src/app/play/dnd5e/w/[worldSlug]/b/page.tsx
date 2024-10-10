"use server";

import { getWorldViewPageProps } from "@/controllers/world";
import WorldView from "@/views/pages/World/View";

const Page = async ({ params: { worldSlug } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  // TODO: show all blocks with client-side filtering
  return (<WorldView {...props}/>);
};

export default Page;
