import { Metadata } from "next";
import { redirect } from 'next/navigation';
import Image from "next/image";
import { getSession } from '../lib/auth';

export const metadata: Metadata = {
  title: "Linked Accounts | Crit-Fumble Gaming",
  description: "Manage your connected accounts and integrations",
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

export default async function LinkedAccountsPage() {
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
            <h1>Linked Accounts</h1>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Discord Account */}
              <div className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center gap-3">
                  <Image 
                    src="/img/discord.svg" 
                    alt="Discord" 
                    width={24} 
                    height={24}
                  />
                  <div className="text-left">
                    <div className="font-semibold">Discord</div>
                    <div className="text-sm text-gray-600">Connected as {userData.username}</div>
                  </div>
                </div>
                <span className="text-green-600 text-sm">✓ Connected</span>
              </div>

              {/* WorldAnvil Account */}
              <div className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-400 rounded"></div>
                  <div className="text-left">
                    <div className="font-semibold">World Anvil</div>
                    <div className="text-sm text-gray-600">Connect your World Anvil account</div>
                  </div>
                </div>
                <span className="text-gray-400 text-sm"></span>
              </div>

              {/* OpenAI Account */}
              <div className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-400 rounded"></div>
                  <div className="text-left">
                    <div className="font-semibold">OpenAI</div>
                    <div className="text-sm text-gray-600">Connect for AI features</div>
                  </div>
                </div>
                <span className="text-gray-400 text-sm"></span>
              </div>
            </div>

            <div className="flex gap-2 justify-center mt-6">
              <a className={linkClass} href="/dashboard">← Back to Dashboard</a>
              <a className={linkClass} href="/">Home</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}