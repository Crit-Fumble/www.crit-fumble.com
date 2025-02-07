"use client";

import { DEFAULT } from "@/views/config";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo, useState } from "react";


const UserDashboardInner = ({ user, characters, ...props }: any) => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);
  
  return (
    <div className="flex flex-col align-middle items-center gap-2">
      Welcome, {user?.name}!
      
      <p>This User Dashboard is a placeholder. We will add more here soon.</p>

      {/* <div className="flex flex-col align-middle items-center">
        <div className="flex flex-row align-middle items-center gap-2">
          {characters?.map(
            (character: any) => (<a  className={DEFAULT.TW_CLASSES.LINK} key={character.id} href={`/character/${character?.slug}`}>
              Play as {character.name} 
              ({character?.party?.name})
            </a>)
          )}
        </div>
      </div> */}
      <a className={DEFAULT.TW_CLASSES.LINK} href='/api/auth/signout'>Log Out</a>
    </div>
  )
}

const UserDashboard = ({ session, ...props }: any) => {

  return (
    <SessionProvider session={session}>
      <UserDashboardInner {...props}/>
    </SessionProvider>
  );
};

export default UserDashboard;
