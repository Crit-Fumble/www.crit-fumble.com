"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useMemo } from "react";
import useDarkMode from "@/lib/hooks/useDarkMode";

export const BottomBarInner = () => {
  const session = useSession();
  const { data, status } = session;
  const isLoading = useMemo(() => status === "loading", [status]);
  const { isDark } = useDarkMode();

  return !isLoading && (
    <div className="w-full flex flex-row justify-center items-center py-3 px-4 bg-gray-300 dark:bg-gray-700">
      <a className="p-3 mx-2 cursor-pointer hover:opacity-80 transition-opacity" href="https://www.patreon.com/critfumbleweb" target="_blank">
        <Image alt={'Patreon Logo'} width={24} height={24} src={'/img/patreon.svg'} />
      </a>
      <a className="p-3 mx-2 cursor-pointer hover:opacity-80 transition-opacity" href="https://github.com/Crit-Fumble" target="_blank">
        <Image alt={'Github Logo'} width={24} height={24} src={isDark ? '/img/github-white.svg' : '/img/github.svg'} />
      </a>
      <a className="p-3 mx-2 cursor-pointer hover:opacity-80 transition-opacity" href="https://app.roll20.net/users/6244861/crit-fumble-gaming" target="_blank">
        <Image alt={'Roll20 Logo'} width={28} height={28} src={'/img/roll20.png'} />
      </a>
      <a className="p-3 mx-2 cursor-pointer hover:opacity-80 transition-opacity" href="https://discord.gg/dZzsst6TdG" target="_blank">
        <Image alt={'Discord Logo'} width={28} height={28} src={'/img/discord.svg'} style={{ width: 'auto', height: 'auto' }} />
      </a>
      <div className="px-4 text-sm">© 2025, Crit Fumble Gaming</div>
    </div>
  );
};

export const BottomBarSession = () => {
  return <BottomBarInner />;
};
