// manage world view layer, use World controller for control logic

// a world is any setting where a TTRPG story may take place

// each system will derive it's own world view from this base view, but this base view should be fully functional for worlds without an assigned system, or with an unrecognized system, in World Anvil.

// most of the "world" functionality will be facilitated by integrating with World Anvil directly, using .env variables WORLD_ANVIL_KEY and WORLD_ANVIL_TOKEN; this view is ONLY the interface for that functionality
"use client";

import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { Providers } from "@lib/next/controllers/providers";

const PageInner = ({ world, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);
  
  return isLoading ? (
    <div className="flex flex-col align-middle items-center">
      Loading...
    </div>
  ) : (
    <div className="flex flex-col align-middle items-center w-[100vw] ">
      <h1>{world?.title}</h1>
      {world?.url && <a href={world?.url}>World Anvil Link</a>}

      <h2>Stat Blocks</h2>
      <div className="flex flex-col align-middle items-center w-[100vw]">
        {world?.blockFolders?.entities?.map((blockFolder: any) => <div key={blockFolder.id} className="p-2">
          <h3>{blockFolder?.title}</h3>
          <div className="flex flex-col align-middle items-center gap-4">
            {!!blockFolder?.entities?.length && blockFolder?.entities?.map((block: any) => (
              <div key={block.id} className="flex flex-row align-middle items-center gap-4">
                <a href={`${block.url}`} target="_blank">{block.title}</a>
                <div>
                  {/* {yaml.stringify(block?.textualdata)} */}
                  {/* split textualdata on \\r\\n, then parse bbcode */}
                  {/* public json at https://www.worldanvil.com/sheet/${block.id}/json */}
                  {/* split properties on \r\n */}
                  {/* {JSON.stringify(block?.data, null, 2)} */}
                </div>
              </div>
            ))}
          </div>
          {/* {JSON.stringify(blockFolder, null, 2)} */}
          {/* {JSON.stringify(world.blocks.filter((block: any) => block.folderId === blockFolder.id), null, 2)} */}
        </div>)}
      </div>

      
      {/* {JSON.stringify({...world?.blockFolders?.entities}, null, 2)} */}
      {/* {JSON.stringify({...world, subscribergroups: undefined}, null, 2)} */}
      {/* <iframe className="w-[100vw] h-[85vh]" src={world.url}></iframe> */}
    </div>
  );
}

const Page = ({ session, ...props }: any) => {
  return (
    <Providers session={session}>
      <PageInner {...props} />
    </Providers>
  );
};

export default Page;
