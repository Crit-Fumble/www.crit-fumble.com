"use server";

import { getUserDashboardPageProps } from "../../../next/client/controllers/UserController";
import UserDashboard from "../../../next/views/User/UserDashboard";


const Page = async () => {
  const { sessionUser, viewedUser, characters } = await getUserDashboardPageProps();

  return (<UserDashboard session={sessionUser} viewedUser={viewedUser} characters={characters}/>);
};

export default Page;
