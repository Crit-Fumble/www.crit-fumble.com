"use server";

import { getUserPageProps } from "@/controllers/UserController";
import Dnd5ePlayerHomeView from "@/views/pages/System/Dnd5e/Player/Home";

const Page = async () => {
  const props = await getUserPageProps();

  return (<Dnd5ePlayerHomeView {...props} />);
};

export default Page;

