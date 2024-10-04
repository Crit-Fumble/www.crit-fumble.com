import { Metadata } from "next";
import Image from "next/image";

// interface PageProps { session: Session | null };

export const metadata: Metadata = {
  title: "Crit-Fumble Gaming  |  Home",
  description: "Welcome to Crit Fumble Gaming! We're a VTTRPG group and have players with some of the worst luck and dumbest ideas. We started as an in-person group in the Midwest United States, but have moved our campaigns online and have since grown to include members all over the country. We play a few long-running campaigns, as well as plenty of one-shots and mini-campaigns that only last a few sessions.",
};

export default function Page({ session } : any) {
  // TODO: SEO and things
  
  return (
      <div className={'flex flex-col justify-stretch items-center'}>
        <div className="absolute h-[389px] p-0 m-0 w-full overflow-hidden"> 
          <Image layout="fill" objectFit="cover" className="w-full min-h-[389px]" alt="CFG Background" src='/img/dice-back.jpg'/>
        </div>
        <div className={'p-8 pt-[192px] flex flex-col items-center text-center'} >
          
        </div>
      </div>
  );
}
