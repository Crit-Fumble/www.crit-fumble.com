import { Metadata } from "next";
import { redirect } from 'next/navigation';
import Image from "next/image";
import { getSession } from '../../lib/auth';

export const metadata: Metadata = {
  title: "Player Dashboard | Crit-Fumble Gaming",
  description: "Manage your characters and character sheets",
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

// This page uses dynamic features (cookies)
export const dynamic = 'force-dynamic';

export default async function PlayerDashboard() {
  // Get session from auth utility
  const userData = await getSession();

  // Redirect to home if not logged in
  if (!userData) {
    redirect('/');
  }

  const linkClass = "border-2 p-2 bg-[rgba(150,25,25,0.25)] text-white hover:bg-[rgba(150,25,25,0.5)] transition-colors inline-block";
  const buttonClass = "border-2 p-4 bg-[rgba(200,100,50,0.25)] text-white hover:bg-[rgba(200,100,50,0.5)] transition-colors text-center block w-full";

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
            <h1>🎭 Player Dashboard</h1>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6">
              Welcome, {userData.username}! Manage your characters and character sheets.
            </p>

            {/* Character Management Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Character Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                <a 
                  className={buttonClass}
                  href="/dashboard/characters"
                >
                  👥 My Characters
                  <br />
                  <small>View & manage all characters</small>
                </a>
                
                <a 
                  className={buttonClass}
                  href="/dashboard/characters/new"
                >
                  ➕ Create Character
                  <br />
                  <small>Start a new character</small>
                </a>
              </div>
            </div>

            {/* Character Sheets Section */}
            {/* <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Character Sheets</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
                <a 
                  className={buttonClass}
                  href="/dashboard/sheets"
                >
                  📋 My Sheets
                  <br />
                  <small>All character sheets</small>
                </a>
                
                <a 
                  className={buttonClass}
                  href="/dashboard/sheets/new"
                >
                  📝 New Sheet
                  <br />
                  <small>Create stat block</small>
                </a>
                
                <a 
                  className={buttonClass}
                  href="/dashboard/campaigns"
                >
                  🗺️ Campaigns
                  <br />
                  <small>Active campaigns</small>
                </a>
              </div>
            </div> */}

            {/* Quick Actions */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                {/* <a 
                  className={`${buttonClass} bg-[rgba(100,150,50,0.25)] hover:bg-[rgba(100,150,50,0.5)]`}
                  href="/dashboard/dice"
                >
                  🎲 Dice Roller
                  <br />
                  <small>Roll some dice</small>
                </a> */}
                
                <a 
                  className={`${buttonClass} bg-[rgba(50,100,200,0.25)] hover:bg-[rgba(50,100,200,0.5)]`}
                  href="/linked-accounts"
                >
                  🔗 Link Accounts
                  <br />
                  <small>Connect Online Accounts</small>
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-2 justify-center">
              <a className={linkClass} href="/dashboard">← Dashboard</a>
              <a className={linkClass} href="/">Home</a>
              <a className={linkClass} href="/api/auth/logout">Sign Out</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}