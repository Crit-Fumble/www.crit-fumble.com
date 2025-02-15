"use client";

import { Card, CardContent, CardHeader } from "@lib/components/blocks/Card";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";

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
  const [newUser, setNewUser] = useState({ name: '', discord: '', admin: false });

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
    <div className="flex flex-col gap-2">  
      <div className={`w-64 p-4`}>  
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <p>Welcome, {viewedUser?.name}!</p>
        <ul>
          {/* Additional menu items can go here */}
        </ul>
      </div>

      <Card >
        <CardHeader>Users</CardHeader>
        <CardContent>
          <table className="min-w-full">
            <thead>
              <tr className="w-full">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Discord</th>
                <th className="py-2 px-4 border-b">Role</th>
                {/* <th className="py-2 px-4 border-b">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {users ? users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-400 hover:dark:bg-gray-700">
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  {/* TODO: show profile preview in the right hand side when discord id clicked */}
                  <td className="py-2 px-4 border-b">{user.discord}</td>
                  <td className="py-2 px-4 border-b">{user.admin ? 'Admin' : 'User'}</td>
                  {/* <td className="py-2 px-4 border-b">
                    <div className="flex gap-2">
                      <button className="text-blue-500 dark:text-blue-300 hover:underline">Edit</button>
                      <button className="text-red-500 dark:text-red-300 hover:underline">Delete</button>
                    </div>
                  </td> */}
                </tr>
              )) : <tr><td colSpan={4} className="py-2 px-4 border-b">Loading...</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>Add User</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="mb-4">
            <input type="text" name="name" value={newUser.name} onChange={handleInputChange} placeholder="Name" required className="border p-2 mr-2" />
            <input type="text" name="discord" value={newUser.discord} onChange={handleInputChange} placeholder="Discord Profile" required className="border p-2 mr-2" />
            <label>
              <input type="checkbox" name="admin" checked={newUser.admin} onChange={handleInputChange} /> Admin
            </label>
            <button type="submit" className="bg-blue-500 text-white p-2 ml-2">Add User</button>
          </form>
        </CardContent>
      </Card> */}
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
