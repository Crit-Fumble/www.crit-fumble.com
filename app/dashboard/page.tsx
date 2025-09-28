import { Metadata } from "next";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from "next/image";
import { getSession } from '../lib/auth';
import UserRolesDisplay from './components/UserRolesDisplay';

export const metadata: Metadata = {
  title: "Dashboard | Crit-Fumble Gaming",
  description: "Connect your accounts and manage your RPG data",
};

// Simple Card components - preserving original styling
const Card: React.FC<{ children?: any, className?: string, id?: string }> = ({ children, className = "", id }) => {
  return (
    <div id={id} className={`bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<{ children?: any, className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`bg-[#552e66] dark:bg-purple-900 text-white p-4 ${className}`}>
      {children}
    </div>
  );
};

const CardContent: React.FC<{ children?: any, className?: string }> = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-4 text-gray-900 dark:text-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
};

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
  const buttonClass = "border-2 p-4 bg-[rgba(200,100,50,0.25)] text-white hover:bg-[rgba(200,100,50,0.5)] transition-colors text-center block w-full";

  return (
    <div className={'flex flex-col justify-stretch items-center p-0 m-0 min-h-screen bg-gray-50 dark:bg-gray-900'}>
      <div className="absolute h-[389px] p-0 m-0 w-full overflow-hidden"> 
        <Image fill sizes="100vw" style={{ objectFit: 'cover' }} className="w-full min-h-[389px] opacity-60 dark:opacity-30" alt="CFG Background" src='/img/dice-back.jpg'/>
      </div>
      <div className={'p-8 pt-[192px] flex flex-col items-center text-center relative z-10'} >
        <div className={'p-4 flex justify-center'}>
          <Image className={'rounded-full'} alt="CFG Logo" src='/img/cfg-logo.jpg' height={'256'} width={'256'}/>
        </div>

        <Card>
          <CardHeader>
            <h1>Dashboard</h1>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6">
              Welcome back, {userData.name}!
            </p>

            {/* Discord Roles Section */}
            <div className="mb-6">
              <UserRolesDisplay />
            </div>

            {/* Admin notice */}
            {userData.admin && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-800 dark:text-red-200 text-center">
                <div className="font-medium">🛡️ Admin Access</div>
                <div className="text-sm">You have administrative privileges</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}