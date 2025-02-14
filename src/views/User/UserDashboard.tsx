"use client";

import { Card, CardContent, CardHeader } from "@lib/components/blocks/Card";
import { DEFAULT } from "@/config/views";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const UserDashboardInner = ({ viewedUser }: any) => {
  const session = useSession();
  
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
