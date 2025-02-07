"use client";

import { marked } from "marked";
import { SessionProvider, useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardContent } from '@/views/components/blocks/Card';
import { Dropdown } from "@/views/components/blocks/Dropdown";


interface Dnd5eHomePageInnerProps {
  player: any;
  characters: any;
  compendium: {
    'rule-sections'?: {
      results?: Array<{
        index: string;
        name: string;
        desc: string;
      }>;
    };
  };
  [key: string]: any;
}

const PageInner: React.FC<Dnd5eHomePageInnerProps> = ({ compendium, ...props }) => {
  const { data, status } = useSession();
  const isLoading = useMemo(() => status === 'loading', [status]);

  return (
    <div className="flex flex-row max-h-[calc(100vh-92px)]">
      <div className="flex flex-col gap-2">
        <h3>D&D5e SRD</h3>
        <ol>
        {compendium?.['rule-sections']?.results?.map((section) => (
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
      </div>
      <div className="w-full flex flex-col items-left overflow-y-auto">
        <div className="max-w-6xl">
          {compendium?.['rule-sections']?.results?.map((section) => (
            <Card id={section.index} key={section.index} className="mb-4">
              <CardHeader className="text-xl font-semibold">
                {section.name}
              </CardHeader>
              <CardContent
                className="prose"
              >
                <div className="parsed-markdown flex flex-col items-left gap-2" dangerouslySetInnerHTML={{ __html: marked.parse(section.desc) }} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dnd5eHomePage = ({ session, ...props }: any) => {

  return (
    <SessionProvider session={session}>
      <PageInner {...props} />
    </SessionProvider>
  );
};

export default Dnd5eHomePage;
