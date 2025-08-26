"use client";

import { useSession } from "next-auth/react";
import { Providers } from "@lib/next/controllers/providers";

const AdminDashboard = ({ session, viewedUser, users, userDiscords }: {
  session: any;
  viewedUser: any;
  users: any[];
  userDiscords: any[];
}) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard - {viewedUser?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">User Details</h2>
          {viewedUser && (
            <div className="space-y-2">
              <p><span className="font-semibold">Name:</span> {viewedUser.name}</p>
              <p><span className="font-semibold">Email:</span> {viewedUser.email}</p>
              <p><span className="font-semibold">Admin:</span> {viewedUser.admin ? "Yes" : "No"}</p>
              <p><span className="font-semibold">Slug:</span> {viewedUser.slug}</p>
              <p><span className="font-semibold">Discord ID:</span> {viewedUser.discord}</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Admin</th>
                </tr>
              </thead>
              <tbody>
                {users && users.map((user) => (
                  <tr key={user.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.admin ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Discord Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="px-4 py-2 text-left">Discord ID</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Discriminator</th>
                <th className="px-4 py-2 text-left">Avatar</th>
              </tr>
            </thead>
            <tbody>
              {userDiscords && userDiscords.map((discord) => (
                <tr key={discord.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">{discord.id}</td>
                  <td className="px-4 py-2">{discord.username}</td>
                  <td className="px-4 py-2">{discord.discriminator}</td>
                  <td className="px-4 py-2">
                    {discord.avatar && (
                      <img 
                        src={`https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}`} 
                        alt="Avatar" 
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminDashboardWithProviders = (props: any) => {
  return (
    <Providers session={props.session}>
      <AdminDashboard {...props} />
    </Providers>
  );
};

export default AdminDashboardWithProviders;
