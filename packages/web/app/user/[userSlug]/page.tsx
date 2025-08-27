"use server";

import { getUserProfilePageProps } from "@cfg/next/controllers/UserController";
import UserProfile from "@cfg/next/views/User/UserProfile";


const Page = async ({ params: { userSlug } }: any) => {
  const { session, viewedUser, characters } = await getUserProfilePageProps(userSlug);

  return (<UserProfile session={session} viewedUser={viewedUser} characters={characters}/>);
};

export default Page;
