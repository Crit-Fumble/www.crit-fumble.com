"use server";

import AdminDashboard from "@cfg/next/views/Admin/AdminDashboard";
import { getAdminDashboardPageProps } from "@cfg/next/controllers/AdminController";


const Page = async ({ params: { userSlug } }: any) => {
  const { session, viewedUser, users, userDiscords } = await getAdminDashboardPageProps(userSlug);

  return (
    <AdminDashboard
      session={session}
      viewedUser={viewedUser}
      users={users}
      userDiscords={userDiscords}
    />
  );
};

export default Page;
