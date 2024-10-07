"use server";

import { getPlayerPageProps } from "@/controllers/player";
import Dnd5eCompendiumSearchView from "@/views/pages/Dnd5e/CompendiumSearch";

const Page = async () => {
  const props = await getPlayerPageProps();

  return (<Dnd5eCompendiumSearchView {...props} />);
};

export default Page;

