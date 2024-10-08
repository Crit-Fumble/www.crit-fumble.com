"use server";

import { getPlayerPageProps } from "@/controllers/player";
import { getWorldViewPageProps } from "@/controllers/world";
import Dnd5ePlayerView from "@/views/pages/Dnd5e/Player/Home";

const Page = async ({ params: { worldSlug }} : any) => {
  const props = await getWorldViewPageProps({ worldAnvil: { slug: worldSlug }});

  return (<Dnd5ePlayerView {...props} />);
};

export default Page;

