"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useMemo } from "react";

interface AdminDashboardProps {
  session: any;
  viewedUser: any;
  users: any;
}
interface AdminDashboardInnerProps {
  viewedUser: any;
  users: any;
}

const AdminDashboardInner = ({ viewedUser, users }: AdminDashboardInnerProps) => {
  const { data: sessionData, status } = useSession();
  const isLoading = useMemo(() => (status === "loading"), [status]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Left Column (Menu) */}
      <div className="w-64 p-4">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <p>Welcome, {viewedUser?.name}!</p>
        <ul>
        </ul>
      </div>

      {/* Right Column (Content) */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add your admin dashboard content here */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            {users ? users.map((user: any) => (
              <li key={user.id} className="mb-2">
                {user.name} ({user.admin ? 'Admin' : 'User'})
              </li>
            )) : <li>Loading...</li>}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ session, ...props }: AdminDashboardProps) => {
  return (
    <SessionProvider session={session}>
      <AdminDashboardInner {...props} />
    </SessionProvider>
  );
};

export default AdminDashboard;
