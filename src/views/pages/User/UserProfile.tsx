"use client";

import { DEFAULT } from "@/views/config";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const UserProfileInner = ({ viewedUser, characters, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);
  
  return (
    <div className="flex flex-col align-middle items-center gap-2">
      {viewedUser?.name}
      <p>This User Profile is a placeholder. We will add more here soon.</p>
      {/* <div className="flex flex-grid align-middle items-center g-2"> */}
        <div className="flex flex-col align-middle items-center">
          <p>Characters</p>
          <div className="flex flex-row align-middle items-center gap-2">
            {characters?.map(
              (character: any, idx: number) => (<p key={`${idx}-${character?.id}`}>{character.name}</p>)
            )}
          </div>
        </div>
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
