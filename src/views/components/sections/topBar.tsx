"use client";
// import { usePathname } from 'next/navigation'
import { useMemo } from "react";
import useDarkMode from "@/controllers/hooks/useDarkMode";
import { SessionProvider } from "@/controllers/AuthController";
import NavigationMenu from "../blocks/NavigationMenu";
import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";

interface TopBarProps {
  session?: Session | null;
}

// const topBarStyle = (isDark: boolean) => ();

export const TopBarInner = () => {

  return <div
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
    </div>;
};

export const TopBarSession = ({ session }: TopBarProps) => {
  return (
    <SessionProvider session={session}>
      <TopBarInner />
    </SessionProvider>
  );
};
