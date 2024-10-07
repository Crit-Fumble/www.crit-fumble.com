"use server";

import { getCompendiumPageProps } from "@/controllers/dnd5e";
import Dnd5eCompendiumView from "@/views/pages/Dnd5e/Compendium/Home";

const Page = async () => {
  const props = await getCompendiumPageProps();

  return (<Dnd5eCompendiumView {...props} />);
};

export default Page;

