"use server";

import { getUserProfilePageProps } from "@/controllers/UserController";
import { getCharacterBySlug, getCharactersByUserId } from "@/services/CharacterService";
import { getUserBySlug } from "@/services/UserService";
import UserProfile from "@/views/pages/User/UserProfile";


const Page = async ({ params: { userSlug } }: any) => {
  const { session, viewedUser, characters } = await getUserProfilePageProps(userSlug);

  return (<UserProfile session={session} viewedUser={viewedUser} characters={characters}/>);
};

export default Page;
