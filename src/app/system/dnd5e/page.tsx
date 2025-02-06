"use server";

import { getCompendiumPageProps } from "@/controllers/Dnd5eController";
import Dnd5eHomePage from "@/views/pages/System/Dnd5e/Compendium/Home";

const Page = async () => {
  const props = await getCompendiumPageProps();

  return (<Dnd5eHomePage {...props} />);
};

export default Page;

