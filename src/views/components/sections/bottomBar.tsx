"use client";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from 'next/navigation'
import { useMemo } from "react";
import { Session } from "next-auth";
import useDarkMode from "@/views/hooks/useDarkMode";

interface BottomBarProps {
  session?: Session | null;
}

export const BottomBarInner = () => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);
  const { isDark, toggleDark } = useDarkMode();
  const pathname = usePathname();

  return !isLoading && (<div
      className={"w-full flex flex-row justify-center items-center p-0 m-0 bottom-0 bg-gray-300 dark:bg-gray-700 "}
    >
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
        <div className="p-2">© 2024, Crit Fumble Gaming</div>
    </div>);
};

export const BottomBarSession = ({ session }: BottomBarProps) => {
  return (
    <SessionProvider session={session}>
      <BottomBarInner />
    </SessionProvider>
  );
};
