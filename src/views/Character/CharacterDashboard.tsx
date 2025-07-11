"use client";

import Dnd5eCharacterView from "@lib/components/blocks/Dnd5eCharacterView";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@lib/components/blocks/Card";
import Link from "next/link";
import { Providers } from "@/controllers/providers";

// TODO: determine game systems, and load appropriate view for each character sheet
// TODO: characters can have more that one sheet per character, for use in different systems

const CharacterDashboardInner = ({ error, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>Error</CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 items-center justify-center text-center">
            <p className="text-red-500">{error}</p>
            <p>The character you&apos;re looking for might not exist or you may not have permission to view it.</p>
            <div className="flex gap-2">
              <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Return Home
              </Link>
              <Link href="/character/create" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Create Character
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!props.character || Object.keys(props.character).length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <h2 className="text-xl font-semibold">Character Not Found</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 items-center justify-center text-center">
            <p>The character you&apos;re looking for could not be found.</p>
            <div className="flex gap-2">
              <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Return Home
              </Link>
              <Link href="/character/create" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Create Character
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (props.character) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {props.character.name || 'Character Sheet'}
          </h1>
          <Link 
            href={`/character/${props.character.slug || props.character.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 transition-colors duration-200"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Character
          </Link>
        </div>
        <Card className="w-full">
          <CardContent className="p-6">
            <Dnd5eCharacterView character={props.character} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Debug props being passed to Dnd5eCharacterView
  console.log("Props being passed to character view:", {
    characterHasParty: props.character && !!props.character.party_id,
    partyData: props.party ? `Party found with ID ${props.party.id}` : "No party data",
    partyObjectType: props.party ? typeof props.party : "N/A",
    partyKeys: props.party ? Object.keys(props.party) : [],
    campaignData: props.campaign ? `Campaign found with ID ${props.campaign.id}` : "No campaign data"
  });

  // Default fallback if no character is found
  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full">
        <CardHeader>Character Not Found</CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 items-center justify-center text-center">
            <p>The character you&apos;re looking for could not be found.</p>
            <div className="flex gap-2">
              <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Return Home
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const CharacterDashboard = ({ session, ...props }: any) => {
  return (
    <Providers session={session}>
      <div className="container mx-auto py-8 px-4">
        <CharacterDashboardInner {...props} />
      </div>
    </Providers>
  );
};

export default CharacterDashboard;
