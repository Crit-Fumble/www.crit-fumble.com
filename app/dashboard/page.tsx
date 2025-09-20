import { Metadata } from "next";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from "next/image";
import { AccountConnections } from '@crit-fumble/react';

export const metadata: Metadata = {
  title: "Dashboard | Crit-Fumble Gaming",
  description: "Connect your accounts and manage your RPG data",
};

// Simple Card components - preserving original styling
const Card: React.FC<{ children?: any, className?: string, id?: string }> = ({ children, className = "", id }) => {
  return (
    <div id={id} className={`bg-white dark:bg-gray-800 shadow-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<{ children?: any, className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`bg-[#552e66] text-white p-4 ${className}`}>
      {children}
    </div>
  );
};

const CardContent: React.FC<{ children?: any, className?: string }> = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-4 text-gray-900 dark:text-gray-300 ${className}`} {...props}>
      {children}
    </div>
  );
};

import { getSession } from '../lib/auth';

// This page uses dynamic features (cookies)
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Get session from auth utility
  const userData = await getSession();

  // Redirect to home if not logged in
  if (!userData) {
    redirect('/');
  }

  const linkClass = "border-2 p-2 bg-[rgba(150,25,25,0.25)] text-white hover:bg-[rgba(150,25,25,0.5)] transition-colors inline-block";

  return (
    <div className={'flex flex-col justify-stretch items-center p-0 m-0'}>
      <div className="absolute h-[389px] p-0 m-0 w-full overflow-hidden"> 
        <Image fill sizes="100vw" style={{ objectFit: 'cover' }} className="w-full min-h-[389px]" alt="CFG Background" src='/img/dice-back.jpg'/>
      </div>
      <div className={'p-8 pt-[192px] flex flex-col items-center text-center'} >
        <div className={'p-4 flex justify-center'}>
          <Image className={'rounded-full'} alt="CFG Logo" src='/img/cfg-logo.jpg' height={'256'} width={'256'}/>
        </div>

        <Card>
          <CardHeader>
            <h1>Welcome, {userData.username}!</h1>
          </CardHeader>
          <CardContent>
            <AccountConnections linkClassName={linkClass} />

            <div className="flex gap-2 justify-center mt-6">
              <a className={linkClass} href="/">Home</a>
              <a className={linkClass} href="/api/auth/logout">Sign Out</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}