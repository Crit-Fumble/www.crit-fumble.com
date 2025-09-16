"use server";

import { getWorldViewPageProps } from "@crit-fumble/next/controllers/RpgSystem/Base/World/WorldController";
import WorldView from "../../../../../next/client/views/World/WorldView";

const Page = async ({ params: { worldSlug } }: any) => {
  const props = await getWorldViewPageProps({
    worldAnvil: { slug: worldSlug },
  });

  // TODO: show all block folders
  return (<WorldView {...props}/>);
};

export default Page;
