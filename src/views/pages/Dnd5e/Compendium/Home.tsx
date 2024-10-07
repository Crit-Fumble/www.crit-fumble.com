"use client";

import { marked } from "marked";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const PageInner = ({ player, characters, compendium, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  return (
    <div className="flex flex-col justify-items-center items-center">
      <div 
        style={{ height: '128px', borderBottom: '1px solid' }} 
        className="flex flex-row flex-wrap gap-4 justify-items-center items-center text-xs"
      >
        {compendium?.['rule-sections']?.results?.map((section: any) => (
          <a key={section.index} href={`#${section.index}`}>{section.name}</a>
        ))}
      </div>
      <hr />
      <div style={{ height: 'calc(100vh - 270px)'}} className="flex flex-col justify-items-center items-center gap-4 overflow-y-auto">
        {compendium?.['rule-sections']?.results?.map((section: any) => (
          <div key={section.index} >
            <div 
              className="border-2 border-slate-100 p-4" 
              id={section.index} 
              dangerouslySetInnerHTML={{ __html: marked.parse(section.desc)}} 
            />
          </div>
        ))}
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
