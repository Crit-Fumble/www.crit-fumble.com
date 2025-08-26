"use server";

import AdminDashboard from "@/views/GameSystem/Base/Admin/AdminDashboard";
import { getAdminDashboardPageProps } from "@lib/next/controllers/AdminController";


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
