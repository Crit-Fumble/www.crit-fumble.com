"use client";
import { SessionProvider } from "next-auth/react";
import LoginButton from "./loginButton";
import { Session } from "next-auth";

interface DashboardProps { session? : Session | null };

export default function Dashboard({ session } : DashboardProps) {
    return (
        <SessionProvider session={session} >
          <div className={'p-8 flex flex-col items-center text-center'} >
            <LoginButton />
          </div>
        </SessionProvider>
    )
}
