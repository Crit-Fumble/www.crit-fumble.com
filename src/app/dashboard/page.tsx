import Dashboard from "./dashboard";
import { Metadata } from "next";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from 'next/image';
import Button from '@mui/material/Button';

interface PageProps { session: Session | null };

export const metadata: Metadata = {
  title: "Crit-Fumble Gaming  | Dashboard",
  description: "",
};

export default async function Page({ session } : PageProps) {

  return (
      <div className={'flex flex-col justify-center'}>
        <Dashboard session={session} />
      </div>
  );
}
