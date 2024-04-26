import Footer from "@/components/layout/footer";
import { Metadata } from "next";
import Image from "next/image";
import { Session } from "next-auth";
import Link from "next/link";


// interface PageProps { session: Session | null };

export const metadata: Metadata = {
  title: "Crit-Fumble Gaming  |  Home",
  description: "Welcome to Crit Fumble Gaming! We're a VTTRPG group and have players with some of the worst luck and dumbest ideas. We started as an in-person group in the Midwest United States, but have moved our campaigns online and have since grown to include members all over the country. We play a few long-running campaigns, as well as plenty of one-shots and mini-campaigns that only last a few sessions.",
};

export default function Page({ session } : any) {
  // TODO: SEO and things
  
  return (
      <div className={'flex flex-col justify-center'}>
        <div className={'p-8 flex flex-col items-center text-center'} >
            <div className={'p-4 flex justify-center'}>
              <Image className={'rounded-full'} alt="CFG Logo" src='/img/cfg-logo.jpg' height={'256'} width={'256'}/>
            </div>

            <h1>Crit Fumble Gaming</h1>

            <p className={'p-4 italic'}>If the GM doesn&apos;t kill you, the dice will.</p>

            {/* <Link className="text-5xl	border-2 border-slate-700 p-4" href="/dashboard">Enter</Link> */}

            <p className={'p-4'}>Welcome to Crit Fumble Gaming! We&apos;re a VTTRPG group and have players with some of the worst luck and dumbest ideas. We started as an in-person group in the Midwest United States, but have moved our campaigns online and have since grown to include members all over the country. We play a few long-running campaigns, as well as plenty of one-shots and &quot;mini-campaigns&quot; that only last a few sessions.</p>
        </div>
        <Footer />
      </div>
  );
}
