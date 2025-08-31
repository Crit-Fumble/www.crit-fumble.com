"use server";

import { getWorldViewPageProps } from "@crit-fumble/next/controllers/World/WorldController";
import WorldView from "../../../../next/views/World/WorldView";

const Page = async ({ params: { worldSlug } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  return (<WorldView {...props}/>);
};

export default Page;
