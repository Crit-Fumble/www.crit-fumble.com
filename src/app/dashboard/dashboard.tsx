"use client";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import * as React from 'react';
import { UserMenu } from './userMenu'
import { useState } from "react";


interface DashboardProps {
  session: Session | null;
}

function DashboardInner() {
  const session = useSession();
  const { data, status, update } = session;
  const { user, expires } = data || { user: null };
  const [url, setUrl] = useState('https://www.crit-fumble.com');

  if (!session || status === 'unauthenticated') {
    return signIn();
  }

  return (
    <div className={"flex flex-col items-stretch text-center"}>
      <UserMenu user={user} url={url} setUrl={setUrl}/>
      {/* <div className={"flex"}>
        <iframe width={'100%'} height={'720'} src={url} />
      </div> */}
      {/* <div></div> */}
    </div>
  );
}

export default function Dashboard({ session }: DashboardProps) {

  return (
    <SessionProvider session={session}>
      <DashboardInner />
    </SessionProvider>
  );
}
