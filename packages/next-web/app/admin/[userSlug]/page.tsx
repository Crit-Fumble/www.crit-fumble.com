"use server";

import AdminDashboard from "../../../../next/client/views/Admin/AdminDashboard";
import { getAdminDashboardPageProps } from "../../../../next/client/controllers/AdminController";


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
