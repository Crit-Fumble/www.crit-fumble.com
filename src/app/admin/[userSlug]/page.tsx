"use server";

import AdminDashboard from "@/views/GameSystem/Base/Admin/AdminDashboard";
import { getAdminDashboardPageProps } from "@/controllers/GameSystem/Base/Admin/AdminController";


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
