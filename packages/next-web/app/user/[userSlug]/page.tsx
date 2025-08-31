"use server";

import { getUserProfilePageProps } from "../../../../next/client/controllers/UserController";
import UserProfile from "../../../../next/views/User/UserProfile";


const Page = async ({ params: { userSlug } }: any) => {
  const { session, viewedUser, characters } = await getUserProfilePageProps(userSlug);

  return (<UserProfile session={session} viewedUser={viewedUser} characters={characters}/>);
};

export default Page;
