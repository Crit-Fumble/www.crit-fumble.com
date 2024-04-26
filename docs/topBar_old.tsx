"use client";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
// import { Input, MenuItem } from "@mui/material";
import useDarkMode from "@/hooks/useDarkMode";
import { use, useMemo, useState } from "react";
import { Session } from "next-auth";
// import { useRef } from "react";

interface TopBarProps {
  session: Session;
}

const className =
  "cursor-pointer bg-transparent transition-colors duration-300 border-none  decoration-none text-primary-500 hover:bg-primary-600 hover:text-white font-light centered !outline-none text-3xl";
const style = { padding: 0, margin: 0 , height: "48px", width: "48px", minWidth: "48px", minHeight: "48px" };

const handleLogout = async (): Promise<void> => {
  signOut({ callbackUrl: "/" });
};

const handleLogin = async (): Promise<void> => {
  signIn();
};

const UserMenu = ({
  session,
}: {
  session: {
    update?: Function;
    data?: Session | null;
    status: "loading" | "authenticated" | "unauthenticated";
  } | null;
}) => {
  const popupState = usePopupState({ variant: "popover", popupId: "userMenu" });
  const { isDark, toggleDark } = useDarkMode();
  const isAuth = useMemo(() => session?.status === "authenticated", [session?.status]);
  const user = useMemo(() => session?.data?.user, [session?.data?.user]);

  return (
    <div className="ml-auto">
      <button style={style} className={className} {...bindTrigger(popupState)}>
        {user?.image ? (
          <Image
            alt={`${user?.name}'s avatar`}
            width={48}
            height={48}
            src={user?.image}
          />
        ) : (
          '👤'
        )}
      </button>
      <div {...bindMenu(popupState)}>
        {/* <MenuItem onClick={popupState.close}>Profile</MenuItem> */}
        {isAuth && <div><a href='/dashboard' onClick={popupState.close}>Dashboard</a></div>}
        <div onClick={toggleDark}>
          Use {isDark ? "Light" : "Dark"} Mode
        </div>
        {isAuth ? (
          <div
            onClick={() => {
              popupState.close();
              handleLogout();
            }}
          >
            Logout
          </div>
        ) : (
          <div
            onClick={() => {
              popupState.close();
              handleLogin();
            }}
          >
            Login
          </div>
        )}
      </div>
    </div>
  );
};

// export const Menu = ({ user, url, setUrl }: MenuProps) => {
export const TopBarInner = () => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);

  // const urlRef = useRef({ value: url })

  // const handleGo = async (): Promise<void> => {
  //   setUrl(urlRef.current.value);
  // };

  return !isLoading && (<div
      className={"flex flex-row items-end p-0 m-0 w-100 top-0 absolute"}
    >
      {/* <Button>
        My Games
      </Button> */}
      <UserMenu session={{ data, status, update }} />
      {/* <Input defaultValue={url} inputRef={urlRef} style={{ width: '100%' }} type="text" />
      <Button onClick={handleGo} style={style} className={className}>
        ➜
      </Button> */}
    </div>);
};

export const TopBar = ({ session }: TopBarProps) => {
  return (
    <SessionProvider session={session}>
      <TopBarInner />
    </SessionProvider>
  );
};
