"use client";

import { marked } from "marked";
import { SessionProvider, useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardContent } from '@lib/components/blocks/Card';
import { Dropdown } from "@lib/components/blocks/Dropdown";


interface Dnd5eSpellsPageInnerProps {
  player: any;
  characters: any;
  compendium: {
    'spells'?: {
      results?: Array<{
        index: string;
        name: string;
        desc: string;
      }>;
    };
  };
  [key: string]: any;
}

const Dnd5eSpellsPageInner: React.FC<Dnd5eSpellsPageInnerProps> = ({ compendium, ...props }) => {
  const { data, status } = useSession();
  const isLoading = useMemo(() => status === 'loading', [status]);

  return (
    <div className="flex flex-row max-h-[calc(100vh-92px)]">
      <div className="flex flex-col gap-2">
        <div>
          <h3>D&D5e Spells</h3>
        </div>
        <ol>
        {compendium?.['spells']?.results?.map((section) => (
          <li key={section.index}>
            <a
              key={section.index}
              href={`#${section.index}`}
              className="hover:underline"
            >
              <em>{section.name}</em>
            </a>
          </li>
        ))}
        </ol>
        <small><em>powered by <a className="underline"href="https://www.dnd5eapi.co/" target="_blank">dnd5eapi.co</a></em></small>
      </div>
      <div className="w-full flex flex-col items-left overflow-y-auto">
        <div className="max-w-6xl">
          {compendium?.['spells']?.results?.map((section) => (
            <Card id={section.index} key={section.index} className="mb-4">
              <CardHeader className="text-xl font-semibold">
                {section.name}
              </CardHeader>
              <CardContent
                className="prose"
              >
                <pre>{JSON.stringify(section, null, 2)}</pre>
                {/* <div className="parsed-markdown flex flex-col items-left gap-2" dangerouslySetInnerHTML={{ __html: marked.parse(section.desc) }} /> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dnd5eSpellsPage = ({ session, ...props }: any) => {

  return (
    <SessionProvider session={session}>
      <Dnd5eSpellsPageInner {...props} />
    </SessionProvider>
  );
};

export default Dnd5eSpellsPage;
