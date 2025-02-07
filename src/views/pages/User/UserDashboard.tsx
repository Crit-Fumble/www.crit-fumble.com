"use client";

import { Card, CardContent, CardHeader } from "@/views/components/blocks/Card";
import { DEFAULT } from "@/views/config";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const UserDashboardInner = ({ viewedUser, characters, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);
  console.log(characters);
  const inPdfr = characters?.find((character: any) => {
    return character.campaign === '0';
  });
  
  return (
    <div className="flex flex-col align-middle items-center gap-2">
      <Card>
        <CardHeader>Welcome, {viewedUser?.name}!</CardHeader>
        <CardContent>
          <p>This User Dashboard is a placeholder. We will add more here soon.</p>
        </CardContent>
      </Card>
    </div>
  )
}

const UserDashboard = ({ session, ...props }: any) => {

  return (
    <SessionProvider session={session}>
      <UserDashboardInner {...props}/>
    </SessionProvider>
  );
};

export default UserDashboard;
