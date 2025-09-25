import { Metadata } from "next";
import { getSession } from '../../lib/auth';
import { redirect } from 'next/navigation';
import Image from "next/image";

export const metadata: Metadata = {
  title: "Gamer Dashboard | Crit-Fumble Gaming",
  description: "PC gaming integrations and achievements",
};

const Card: React.FC<{ children?: any, className?: string, id?: string }> = ({ children, className = "", id }) => {
  return <div id={id} className={`bg-white dark:bg-gray-800 shadow-md overflow-hidden ${className}`}>{children}</div>;
};

const CardHeader: React.FC<{ children?: any, className?: string }> = ({ children, className = "" }) => {
  return <div className={`bg-[#552e66] text-white p-4 ${className}`}>{children}</div>;
};

const CardContent: React.FC<{ children?: any, className?: string }> = ({ className = "", children, ...props }) => {
  return <div className={`p-4 text-gray-900 dark:text-gray-300 ${className}`} {...props}>{children}</div>;
};

export const dynamic = 'force-dynamic';

export default async function GamerDashboard() {
  const userData = await getSession();
  if (!userData) redirect('/');

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
            <h1>🎮 Gamer Dashboard</h1>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6">
              Coming Soon! This dashboard will integrate with PC gaming platforms and achievements.
            </p>
            
            {/* <div className="text-left max-w-md mx-auto mb-6">
              <h3 className="font-semibold mb-2">Planned Features:</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Steam integration</li>
                <li>Achievement tracking</li>
                <li>Gaming session logs</li>
                <li>Multiplayer coordination</li>
                <li>Game library sync</li>
                <li>Performance metrics</li>
              </ul>
            </div> */}

            <div className="flex gap-2 justify-center">
              <a className={linkClass} href="/dashboard">← Dashboard</a>
              <a className={linkClass} href="/dashboard/player">Player Mode</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}