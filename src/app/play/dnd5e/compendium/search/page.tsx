"use server";

import { getUserPageProps } from "@/controllers/user";
import Dnd5eCompendiumSearchView from "@/views/pages/Dnd5e/Compendium/Search";

const Page = async () => {
  const props = await getUserPageProps();

  return (<Dnd5eCompendiumSearchView {...props} />);
};

export default Page;

