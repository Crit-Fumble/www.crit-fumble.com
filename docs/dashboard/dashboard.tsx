"use client";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import * as React from "react";
import { useState } from "react";
import { Welcome } from "./welcome";

interface DashboardProps {
  session: Session | null;
}

function CharacterSelect() {}

function DashboardInner() {
  const session = useSession();
  const { data, status, update } = session;
  const { user, expires } = data || { user: null };
  const [url, setUrl] = useState("https://www.crit-fumble.com");

  if (!session || status === "unauthenticated") {
    return signIn();
  }

  return (
    user?.name && (
      <div className={"flex flex-col items-stretch text-center"}>
        {/* TODO: if user has done onboarding, skip the welcome screen */}
        <Welcome user={user} />
        {/* <div></div> */}
        {/* <div></div> */}
        {/* <div></div> */}
        {/* <div></div> */}
        {/* <div></div> */}
        {/* <div className={"flex"}>
        <iframe width={'100%'} height={'720'} src={url} />
      </div> */}
      </div>
    )
  );
}

export default function Dashboard({ session }: DashboardProps) {
  return (
    <SessionProvider session={session}>
      <DashboardInner />
    </SessionProvider>
  );
}
