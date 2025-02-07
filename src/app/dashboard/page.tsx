"use server";

import { getUserDashboardPageProps } from "@/controllers/UserController";
import { getCharacterBySlug, getCharactersByUserId } from "@/services/CharacterService";
import { getUserBySlug } from "@/services/UserService";
import UserDashboard from "@/views/pages/User/UserDashboard";


const Page = async () => {
  const { session, viewedUser, characters } = await getUserDashboardPageProps();

  return (<UserDashboard session={session} viewedUser={viewedUser} characters={characters}/>);
};

export default Page;
