"use client";

import Dnd5eCharacterView from "@lib/components/blocks/Dnd5eCharacterView";
import { DEFAULT } from "@/config/views";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@lib/components/blocks/Card";
import Link from "next/link";

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
        <CardHeader>Character Not Found</CardHeader>
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

  // Debug props being passed to Dnd5eCharacterView
  console.log("Props being passed to character view:", {
    characterHasParty: props.character && !!props.character.party,
    partyData: props.party ? `Party found with ID ${props.party.id}` : "No party data",
    partyObjectType: props.party ? typeof props.party : "N/A",
    partyKeys: props.party ? Object.keys(props.party) : [],
    campaignData: props.campaign ? `Campaign found with ID ${props.campaign.id}` : "No campaign data"
  });

  return (
    <div className="flex flex-col gap-2">
      <Dnd5eCharacterView {...props} />
    </div>
  )
}

const CharacterDashboard = ({ session, ...props }: any) => {
  return (
    <SessionProvider session={session}>
      <div className="container mx-auto py-8 px-4">
        <CharacterDashboardInner {...props} />
      </div>
    </SessionProvider>
  );
};

export default CharacterDashboard;
