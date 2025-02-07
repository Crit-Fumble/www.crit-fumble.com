"use server";

import { getUserDashboardPageProps } from "@/controllers/UserController";
import UserDashboard from "@/views/pages/User/UserDashboard";


const Page = async () => {
  const { session, viewedUser, characters } = await getUserDashboardPageProps();

  return (<UserDashboard session={session} viewedUser={viewedUser} characters={characters}/>);
};

export default Page;
