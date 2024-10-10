"use client";

import { SATISFACTORY } from "@/views/config";
import { marked } from "marked";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const PageInner = ({ gamer, characters, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);
  
  return (
    <div className="flex flex-col align-middle items-center gap-2 max-w-[1200px]">
      <div className="border-2 p-2">
        <div className="flex flex-col align-middle items-center gap-2 p-2">
          <h1>🏭 FICSIT, CFG Division</h1>
          <pre className="border-2 p-2">
            Address: ficsit.crit-fumble.com
          </pre>
          <pre className="border-2 p-2">
            Port: 30600
          </pre>
          <h2>Server Rules</h2>
          <ol>
            <li>1. All <a href="https://discord.com/channels/1002008886137589771/1124065939894309066">#server-guidelines</a> on our Discord server apply while playing on our Satisfactory Server as well. Keep it classy and mixed-company friendly for our families at home.</li>
            <li>2. Don&apos;t remove or place the Hub without discussing with a @V-Gaming Mod. We will build hypertubes to accommodate easy travel to your preferred starting area.</li>
            <li>3. Some resources are shared among players or only available in limited quantities. For example, you may only have one space elevator on the map and (to the best of my knowledge) power slugs and hard drives are both limited. Be mindful of this as we play and let&apos;s coordinate our efforts for buildings like this and limited resources such as tickets and biomass.</li>
            <li>4. Try not to do anything that necessitates adding to this list. This is a small enough group that we shouldn&apos;t need many guidelines.</li>
          </ol>
        </div>
      </div>
      {/* <div><h3>Save File</h3></div> */}
      {/* <div></div> */}

      <div><h3>Interactive Map</h3></div>
      <div className="flex flex-grid gap-2 items-center">
        <a 
          className={SATISFACTORY.TW_CLASSES.LINK} 
          href={"https://satisfactory-calculator.com/en/interactive-map"}
          target="tab-satisfactory-imap"
        >
          Open Tab
        </a>
        <button 
          className={SATISFACTORY.TW_CLASSES.BUTTON} 
          onClick={() => window.open("https://satisfactory-calculator.com/en/interactive-map", "popup-satisfactory-imap", 'height=720, width=1280')}
        >
          Open Popup
        </button>
      </div>
    </div>
  )
}

const Page = ({ session, ...props }: any) => {

  return (
    <SessionProvider session={session}>
      <PageInner {...props} />
    </SessionProvider>
  );
};

export default Page;
