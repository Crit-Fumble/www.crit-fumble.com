"use server";

import { getAdminDashboardPageProps } from "@/controllers/AdminController";
import AdminDashboard from "@/views/Admin/AdminDashboard";

const Page = async ({ params: { userSlug } }: any) => {
  const { session, viewedUser, users } = await getAdminDashboardPageProps(userSlug);

  return (<AdminDashboard session={session} viewedUser={viewedUser} users={users}/>);
};

export default Page;
