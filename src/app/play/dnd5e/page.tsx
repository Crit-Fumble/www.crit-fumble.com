"use server";

import { getPlayerPageProps } from "@/controllers/player";
import Dnd5ePlayerView from "@/views/pages/Dnd5e/Player/Home";

const Page = async () => {
  const props = await getPlayerPageProps();

  return (<Dnd5ePlayerView {...props} />);
};

export default Page;

