"use client";

import { Card, CardContent, CardHeader } from "@lib/components/blocks/Card";
import { DEFAULT } from "@/config/views";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const UserProfileInner = ({ viewedUser, characters, campaigns, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);
  
  return (
    <div className="flex flex-col align-middle items-center gap-2">
      <Card>
        <CardHeader>{viewedUser?.name}</CardHeader>
        <CardContent>
          This User Profile is a placeholder. We will add more here soon.
        </CardContent>
        {/* <div className="flex flex-grid align-middle items-center g-2"> */}
      </Card>
      {/* <Card>
        <CardHeader>Game Master</CardHeader>
        {campaigns ? <CardContent>
          {campaigns?.map(
            (campaign: any, idx: number) => (<p key={`${idx}-${campaign?.id}`}>{campaign.name}</p>)
          )}
        </CardContent> : <CardContent>
          No game master campaigns found.
        </CardContent>}
      </Card> */}
      <Card>
        <CardHeader>Characters</CardHeader>
        {characters ? <CardContent>
          {characters?.map(
            (character: any, idx: number) => (<p key={`${idx}-${character?.id}`}>{character.name}</p>)
          )}
        </CardContent> : <CardContent>
          No characters found.
        </CardContent>}
      </Card>
      </div>
  )
}

const UserProfile = ({ session, ...props }: any) => {

  return (
    <SessionProvider session={session}>
      <UserProfileInner {...props}/>
    </SessionProvider>
  );
};

export default UserProfile;
