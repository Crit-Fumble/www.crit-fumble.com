"use server";

import { getUserPageProps } from "@/controllers/UserController";
import Dnd5eCompendiumSearchView from "@/views/pages/System/Dnd5e/Compendium/Search";

const Page = async () => {
  const props = await getUserPageProps();

  return (<Dnd5eCompendiumSearchView {...props} />);
};

export default Page;

