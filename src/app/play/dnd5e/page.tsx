"use server";

import { getUserPageProps } from "@/controllers/user";
import Dnd5ePlayerHomeView from "@/views/pages/Dnd5e/Player/Home";

const Page = async () => {
  const props = await getUserPageProps();

  return (<Dnd5ePlayerHomeView {...props} />);
};

export default Page;

