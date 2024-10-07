"use server";

import { getPlayerPageProps } from "@/controllers/player";
import Dnd5eCompendiumView from "@/views/pages/Dnd5e/Compendium";

const Page = async () => {
  const props = await getPlayerPageProps();

  return (<Dnd5eCompendiumView {...props} />);
};

export default Page;

