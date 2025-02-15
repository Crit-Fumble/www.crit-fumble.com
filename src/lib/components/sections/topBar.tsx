"use client";
import { SessionProvider } from "@/controllers/AuthController";
import NavigationMenu from "../blocks/NavigationMenu";
import { Session } from "next-auth";

interface TopBarProps {
  session?: Session | null;
}

export const TopBarSession = ({ session }: TopBarProps) => {
  return (
    <SessionProvider session={session}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0, 
          left: 0, 
          padding: 0,
          margin: 0,
          width: '100%',
        }}
      >
        <NavigationMenu />
      </div>
    </SessionProvider>
  );
};
