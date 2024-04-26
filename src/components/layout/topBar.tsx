"use client";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from 'next/navigation'
import { useMemo } from "react";
import { Session } from "next-auth";
import useDarkMode from "@/hooks/useDarkMode";

interface TopBarProps {
  session?: Session | null;
}

const handleLogout = async (): Promise<void> => {
  signOut({ callbackUrl: "/" });
};

const handleLogin = async (): Promise<void> => {
  signIn();
};

export const TopBarInner = () => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);
  const { isDark, toggleDark } = useDarkMode();
  const pathname = usePathname();

  return !isLoading && (<div
      className={"w-full flex flex-row justify-items-end items-center p-0 m-0 top-0 right-0 absolute bg-gray-300 dark:bg-gray-700 "}
    >
      <div className="flex flex-row items-center ">
        {data?.user?.image && (
          <Image
            priority
            alt={`${data?.user?.name}'s avatar`}
            width={48}
            height={48}
            src={data?.user?.image}
          />
        )}
        {data?.user?.name && <p className="p-2">{data?.user?.name}</p>}
      </div>
      {(pathname !== '/') && <a href="/"><button className="p-2">Home</button></a>}

      {/* {session?.status === "authenticated" && (pathname !== '/dashboard') && (<>
        <a className="p-2" href="/dashboard">Dashboard</a>
      </>)} */}
      
      <div className="ml-auto flex flex-row items-center">
        <a onClick={toggleDark}>
          {isDark ? '🌙' : '☀️'}
        </a>
      </div>
      {session?.status === "authenticated" ? (
        <>
          <button className="p-2"
            onClick={() => {
              handleLogout();
            }}
          >Logout</button>
        </>
        ) : (
          <button className="p-2"
            onClick={() => {
              handleLogin();
            }}
          >
            Login
          </button>
        )}
        
    </div>);
};

export const TopBarSession = ({ session }: TopBarProps) => {
  return (
    <SessionProvider session={session}>
      <TopBarInner />
    </SessionProvider>
  );
};
