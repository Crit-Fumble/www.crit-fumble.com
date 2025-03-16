"use client";

import { Card, CardContent, CardHeader } from "@lib/components/blocks/Card";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { Providers } from "@/controllers/providers";

interface AdminDashboardProps {
  session: any;
  viewedUser: any;
  users: any;
  userDiscords: any;
}
interface AdminDashboardInnerProps {
  viewedUser: any;
  users: any;
  userDiscords: any;
}

const AdminDashboardInner = ({ viewedUser, users, userDiscords }: AdminDashboardInnerProps) => {
  const { data: sessionData, status } = useSession();
  const isLoading = useMemo(() => (status === "loading"), [status]);
  const [newUser, setNewUser] = useState({ name: '', discord: '', admin: false });
  const [selectedUser, setSelectedUser] = useState(null as any);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewUser({ ...newUser, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/admin/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    if (response.ok) {
      // Optionally refresh the user list or handle success
      setNewUser({ name: '', discord: '', admin: false }); // Reset form
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto">  
      <div className={`w-64 p-4`}>  
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <p>Welcome, {viewedUser?.name}!</p>
        <ul>
          {/* Additional menu items can go here */}
        </ul>
      </div>

      <div className="flex flex-row gap-2 align-middle items-center justify-center">
        <Card>
          <CardHeader>Discord Sign-ins</CardHeader>
          <CardContent className="w-full overflow-y-auto max-h-[calc(100vh-192px)]">
            <table className="min-w-full">
              <thead>
                <tr className="w-full">
                  <th className="py-2 px-4 border-b">CFG Id</th>
                  <th className="py-2 px-4 border-b">CFG Name</th>
                  {/* <th className="py-2 px-4 border-b">CFG Admin</th> */}
                  <th className="py-2 px-4 border-b">Discord Name</th>
                  {/* <th className="py-2 px-4 border-b">Display Name</th> */}
                  {/* <th className="py-2 px-4 border-b">Discord</th>
                  <th className="py-2 px-4 border-b">Roll20</th>
                  <th className="py-2 px-4 border-b">World Anvil</th>
                  <th className="py-2 px-4 border-b">D&D Beyond</th> */}
                </tr>
              </thead>
              <tbody>
                {userDiscords ? userDiscords.map((userDiscord: any) => {
                  const user = users.find((user: any) => user.discord === userDiscord.id);

                  return (
                    <tr key={userDiscord.id} onClick={() => setSelectedUser(user)} className="hover:bg-gray-400 hover:dark:bg-gray-700">
                    <td className="py-2 px-4 border-b">{user?.id}</td>
                    <td className="py-2 px-4 border-b">{user?.name}</td>
                    {/* <td className="py-2 px-4 border-b">{user?.admin ? "True" : "False"}</td> */}
                      <td className="py-2 px-4 border-b">{userDiscord.name}</td>
                      {/* <td className="py-2 px-4 border-b">{userDiscord.displayName}</td> */}
                      {/* <td className="py-2 px-4 border-b">{user?.discord}</td>
                      <td className="py-2 px-4 border-b">{user?.roll20}</td>
                      <td className="py-2 px-4 border-b">{user?.world_anvil}</td>
                      <td className="py-2 px-4 border-b">{user?.dd_beyond}</td> */}
                    </tr>
                  )}) : <tr><td colSpan={4} className="py-2 px-4 border-b">Loading...</td></tr>}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-row gap-2 align-middle items-center justify-center">
        {selectedUser && <Card>
          <CardHeader>User View</CardHeader>
          <CardContent>
            <pre>
              {JSON.stringify(selectedUser, (key, value) =>
                typeof value === 'bigint'
                    ? value.toString()
                    : value
              , 2)}
            </pre>
          </CardContent>
          <CardContent>
            <pre>
              {selectedUser?.discord && JSON.stringify(userDiscords
                .find((userDiscord: any) => userDiscord.id === selectedUser.discord)
              , (key, value) =>
                typeof value === 'bigint'
                    ? value.toString()
                    : value
              , 2)}
            </pre>
            {/* <pre>
              {selectedUser?.discord && JSON.stringify(userDiscords
                .find((userDiscord: any) => userDiscord.id === selectedUser.discord)
              , null, 2)}
            </pre> */}
            
          </CardContent>
        </Card>}
      </div>
    </div>
  );
};

const AdminDashboard = ({ session, ...props }: any) => {
  return (
    <Providers session={session}>
      <AdminDashboardInner {...props} />
    </Providers>
  );
};

export default AdminDashboard;
