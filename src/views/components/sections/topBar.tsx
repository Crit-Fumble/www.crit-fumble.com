"use client";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from 'next/navigation'
import { useMemo } from "react";
import { Session } from "next-auth";
import useDarkMode from "@/views/hooks/useDarkMode";

interface TopBarProps {
  session?: Session | null;
}

const handleLogout = async (): Promise<void> => {
  signOut({ callbackUrl: "/" });
};

const handleLogin = async (): Promise<void> => {
  signIn();
};

// const topBarStyle = (isDark: boolean) => ();

export const TopBarInner = () => {
  const session = useSession();
  const { data, status, update } = session;
  const isLoading = useMemo(() => status === "loading", [status]);
  const isLoggedIn = useMemo(() => status === "authenticated", [status])
  const { isDark, toggleDark } = useDarkMode();
  const pathname = usePathname();

  return !isLoading && (<div
      style={{
        position: 'absolute',
        top: 0,
        right: 0, 
        left: 0, 
        padding: 0,
        margin: 0,
        height: '48px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyItems: 'end',
        backgroundColor: isDark ? '#374151' : '#d1d5db',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        alignItems: 'center',
      }}>
        {data?.user?.image && (
          <Image
            priority
            alt={`${data?.user?.name}'s avatar`}
            width={48}
            height={48}
            src={data?.user?.image}
          />
        )}
        {/* {data?.user?.name && <p className="p-2">Welcome, {data?.user?.name}!</p>} */}
      </div>
      {/*   | */}
      {/* <a href="/"><button className="p-2 cursor-pointer">Home</button></a> */}

      {/* {isLoggedIn && '|' }

      {isLoggedIn && 
        <a href="/social"><button className="p-2 cursor-pointer">Social</button></a>
      } */}

      {/* {isLoggedIn && '|' } */}

      {isLoggedIn && 
        <a href="/"><button className="p-2 cursor-pointer">Home</button></a>
      }

      {isLoggedIn && '|' }

      {isLoggedIn && 
        <a href="/game"><button className="p-2 cursor-pointer">Video</button></a>
      }

      {isLoggedIn && '|' }

      {isLoggedIn && 
        <a href="/play"><button className="p-2 cursor-pointer">Tabletop</button></a>
      }

      {/* {isLoggedIn && '|' } */}

      {/* {session?.status === "authenticated" && (pathname !== '/dashboard') && (<>
        <a className="p-2" href="/dashboard">Dashboard</a>
      </>)} */}

      <div style={{
        marginLeft: 'auto',
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        alignItems: 'center',
      }}>
        <a style={{padding: '2px'}} className="cursor-pointer" onClick={toggleDark}>
          {isDark ? '🌙' : '☀️'}
        </a>
        {session?.status === "authenticated" ? (
          <button style={{padding: '2px'}}  className="cursor-pointer"
            onClick={() => {
              handleLogout();
            }}
          >Logout</button>
        ) : (
          <button style={{padding: '2px'}} className="cursor-pointer"
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
