"use server";

import { getPlayerPageProps } from "@/controllers/player";
import Dnd5eGmView from "@/views/pages/Dnd5e/GM/Home";

const Page = async () => {
  const props = await getPlayerPageProps();

  return (<Dnd5eGmView {...props} />);
};

export default Page;

