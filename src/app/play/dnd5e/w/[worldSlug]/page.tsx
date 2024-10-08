"use server";

import { getWorldViewPageProps } from "@/controllers/world";
import WorldView from "@/views/pages/World/View";

const Page = async ({ params: { worldSlug } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  return (<WorldView {...props}/>);
};

export default Page;
