"use server";

import { getWorldViewPageProps } from "@/controllers/WorldController";
import WorldView from "@/views/pages/World/WorldView";

const Page = async ({ params: { worldSlug } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  return (<WorldView {...props}/>);
};

export default Page;
