// TODO: move all client side code to client.tsx, leave server code in page.tsx

'use client';

import { Card, CardContent, CardHeader } from "../../next/views/components/blocks/Card";
import Image from "next/image";

// Define prop types for the client component
interface HomePageClientProps {
  session: any;
  config: {
    twClasses: {
      LINK: string;
      [key: string]: string;
    };
    isLoggedIn: boolean;
    userData: any | null;
  };
}

/**
 * Client-side homepage component
 * Receives data from page.tsx which gets it from server.tsx
 */
export default function HomePageClient({ session, config }: HomePageClientProps) {
  // All UI rendering happens here - no data fetching
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
          <CardHeader><h1>Crit Fumble Gaming</h1></CardHeader>
          <CardContent>
            <p className={'p-4 italic'}>If the GM doesn't kill you, the dice will.</p>

            <p className={'p-4'}>
              Welcome to Crit Fumble Gaming! We're a VTTRPG group and have players with some of the worst luck and dumbest ideas. We started as an in-person group in the Midwest United States, but have moved our campaigns online and have since grown to include members all over the country. We play a few long-running campaigns, as well as plenty of one-shots and &quot;mini-campaigns&quot; that only last a few sessions.
            </p>

            <div className="flex flex-col gap-2 justify-center items-center">
              {!config.isLoggedIn && <a className={config.twClasses.LINK} href='/api/auth/signin'>Log In</a>}
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}
