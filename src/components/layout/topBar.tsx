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
      {(pathname !== '/') && <a href="/"><button className="p-2 cursor-pointer">Home</button></a>}

      {/* {session?.status === "authenticated" && (pathname !== '/dashboard') && (<>
        <a className="p-2" href="/dashboard">Dashboard</a>
      </>)} */}

      <div className="ml-auto flex flex-row items-center">
        <a className="p-2 cursor-pointer" href="https://www.patreon.com/critfumbleweb" target="_blank">
          <Image alt={'Patreon Logo'} width={24} height={24} src={'/img/patreon.svg'} />
        </a>
        <a className="p-2 cursor-pointer" href="https://github.com/Crit-Fumble" target="_blank">
          <Image alt={'Github Logo'} width={24} height={24} src={isDark ? '/img/github-white.svg' : '/img/github.svg'} />
        </a>
        <a className="p-2 cursor-pointer" href="https://app.roll20.net/users/6244861/crit-fumble-gaming" target="_blank">
          <Image alt={'Roll20 Logo'} width={28} height={28} src={'/img/roll20.png'} />
        </a>
        <a className="p-2 cursor-pointer" href="https://discord.gg/dZzsst6TdG" target="_blank">
          <Image alt={'Discord Logo'} width={28} height={28} src={'/img/discord.svg'} />
        </a>
        <a className="p-2 cursor-pointer" onClick={toggleDark}>
          {isDark ? '🌙' : '☀️'}
        </a>
        {session?.status === "authenticated" ? (
          <button className="p-2 cursor-pointer"
            onClick={() => {
              handleLogout();
            }}
          >Logout</button>
        ) : (
          <button className="p-2 cursor-pointer"
            onClick={() => {
              handleLogin();
            }}
          >Login</button>
        )}
      </div>

        
    </div>);
};

export const TopBarSession = ({ session }: TopBarProps) => {
  return (
    <SessionProvider session={session}>
      <TopBarInner />
    </SessionProvider>
  );
};
