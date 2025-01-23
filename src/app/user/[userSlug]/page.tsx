"use server";

import { getCharacterBySlug, getCharactersByUserId } from "@/services/CharacterService";
import { getUserBySlug } from "@/services/UserService";
import UserDashboard from "@/views/pages/User/UserDashboard";


const Page = async ({ params: { userSlug } }: any) => {
  const user: any = await getUserBySlug(userSlug);
  const characters = await getCharactersByUserId(user.id);

  return (<UserDashboard user={user} characters={characters}/>);
};

export default Page;
