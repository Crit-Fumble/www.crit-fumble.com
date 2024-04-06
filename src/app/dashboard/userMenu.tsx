"use client";
import Button from "@mui/material/Button";
import { signOut } from "next-auth/react";
import Image from "next/image";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from 'material-ui-popup-state/hooks'
// import { Input, MenuItem } from "@mui/material";
import useDarkMode from "@/hooks/useDarkMode";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
// import { useRef } from "react";

interface MenuProps {
  user: any;
  url: string;
  setUrl: (url: string) => void;
}

const className =
  "p-0 m-0 cursor-pointer bg-transparent transition-colors duration-300 border-none  decoration-none text-primary-500 hover:bg-primary-600 hover:text-white font-light centered !outline-none text-2xl";
const style = { height: "48px", width: "48px", minWidth: "48px" };

const handleLogout = async (): Promise<void> => {
  signOut({ callbackUrl: "/" });
};


// export const Menu = ({ user, url, setUrl }: MenuProps) => {
export const UserMenu = ({ user }: MenuProps) => {
  const { isDark, toggleDark } = useDarkMode();
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' });
  // const urlRef = useRef({ value: url })

  // const handleGo = async (): Promise<void> => {
  //   setUrl(urlRef.current.value);
  // };

  return (
    <div
      className={"flex flex-row items-start p-0 m-0"}
      style={{ height: "48px" }}
    >
      <>
        <Button style={style} className={className} {...bindTrigger(popupState)}>
          {user?.image && (
            <Image
              alt={`${user?.name}'s avatar`}
              width={48}
              height={48}
              src={user?.image}
            />
          )}
        </Button>
        <Menu {...bindMenu(popupState)}>
          <MenuItem onClick={popupState.close}>Profile</MenuItem>
          <MenuItem onClick={popupState.close}>My account</MenuItem>
          <MenuItem onClick={popupState.close}>Logout</MenuItem>
        </Menu>
      </>
      <Button onClick={toggleDark} style={style} className={className}>
        {isDark ? "🌙" : "☀️"}
      </Button>
      {/* <Input defaultValue={url} inputRef={urlRef} style={{ width: '100%' }} type="text" />
      <Button onClick={handleGo} style={style} className={className}>
        ➜
      </Button> */}
      <Button
        onClick={handleLogout}
        style={{ ...style, marginLeft: "auto" }}
        className={className}
      >
        🚪
      </Button>
    </div>
  );
};
