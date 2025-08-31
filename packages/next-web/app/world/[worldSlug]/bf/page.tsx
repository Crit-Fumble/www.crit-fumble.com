"use server";

import { getWorldViewPageProps } from "@cfg/next/controllers/GameSystem/Base/World/WorldController";
import WorldView from "../../../../../next/views/World/WorldView";

const Page = async ({ params: { worldSlug } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  // TODO: show all block folders
  return (<WorldView {...props}/>);
};

export default Page;
