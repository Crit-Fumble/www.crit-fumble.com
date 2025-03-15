"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import Image from "next/image";
import useDarkMode from '@lib/hooks/useDarkMode';

const NavigationMenu = () => {
  const { data: session, status, update } = useSession();
  const { isDark, toggleDark } = useDarkMode();
  const isLoading = useMemo(() => (status === "loading"), [status]);
  const isLoggedIn = useMemo(() => (status === "authenticated"), [status]);
  const isPlayer = useMemo(() => (!!session?.profile?.id), [session?.profile?.id]);
  const campaigns = useMemo(() => session?.campaigns?.filter?.((campaign: any) => campaign?.active), [session?.campaigns]);
  const profile = useMemo(() => session?.profile, [session?.profile]);
  // const parties = useMemo(() => session?.parties, [session?.parties]);
  const characters = useMemo(() => session?.characters, [session?.characters]);
  const [dropdownOpen, setDropdownOpen] = useState('');

  useEffect(() => {
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async (): Promise<void> => {
    signOut({ callbackUrl: "/" });
  };
  
  const handleLogin = async (): Promise<void> => {
    signIn('discord');
  };

  const handleDropdown = async (menuId: string): Promise<void> => {
    setDropdownOpen((internalDropdownOpen) => {
      if (internalDropdownOpen === menuId) {
        return '';
      }

      return menuId;
    })
  };

  return (
    <nav className={`h-12 p-0 m-0 flex flex-row items-center justify-end ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex space-x-4 pl-4">
          {isPlayer && `${campaigns?.length}` && <li className="relative">
            <button
              className="hover:underline"
              onClick={() => handleDropdown('campaigns')}
            >
              Campaigns
            </button>
            {dropdownOpen === 'campaigns' && (
              <ul className={`${dropdownOpen === 'campaigns' ? '': 'hidden '}absolute bg-white dark:bg-black mt-3 shadow-lg`}>
                {isLoading
                  ? <li className="px-4 py-2 italic text-nowrap">Loading...</li>
                  : campaigns 
                    ? campaigns?.map?.((campaign: any) => (<li key={campaign?.id} className="px-4 py-2 hover:underline cursor-pointer text-nowrap">
                    <a href={`/campaign/${campaign.slug}`}>{campaign?.name}</a> 
                    </li>))
                    : <li className="px-4 py-2 italic text-nowrap">No Campaigns Found.</li>
                  }
              </ul>
            )}
          </li>}
          {isPlayer && <li className="relative">
            <button
              className="hover:underline"
              onClick={() => handleDropdown('characters')}
            >
              Characters
            </button>
            {dropdownOpen === 'characters' && (
              <ul className={`${dropdownOpen === 'characters' ? '': 'hidden '}absolute bg-white dark:bg-black mt-3 shadow-lg`}>
                {isLoading
                  ? <li className="px-4 py-2 italic text-nowrap">Loading...</li>
                  : characters 
                    ? characters?.map?.((character: any) => (<li key={character?.id} className="px-4 py-2 hover:underline cursor-pointer text-nowrap">
                    <a href={`/character/${character.slug}`}>{character?.name}</a> 
                    </li>))
                    : <li className="px-4 py-2 italic text-nowrap">No Characters Found.</li>
                  }
                <li className="px-4 py-2 hover:underline cursor-pointer text-nowrap border-t">
                  <a href="/character/create">Create New Character</a>
                </li>
              </ul>
            )}
          </li>}
        </ul>
      </div>

      <div className="ml-auto flex flex-row gap-2 items-center">
        <ul>
          <li 
          className="h-12 w-12 p-0 m-0"
        >
          {isLoggedIn ? (
            <button
              className="h-12 w-12 p-0 m-0 bg-cover bg-center hover:underline cursor-pointer"
              style={{backgroundImage: session?.user?.image ? `url(${session?.user?.image})` : ''}}
              onClick={() => handleDropdown('user')}
            >
              <span className="hidden">User</span>
            </button>
          ) : isLoading ? (
            <span className="hidden">Loading</span>
          ) : (
              <button 
                className="h-12 w-12 p-0 m-0 hover:underline cursor-pointer"
                onClick={() => {
                  handleLogin();
                }}
              >
                <span>Login</span>
              </button>
          )}

            {dropdownOpen === 'user' && (
              <ul className={`${dropdownOpen === 'user' ? '': 'hidden '}absolute right-0 text-right mt-[-6px] bg-white dark:bg-black shadow-lg`}>
                <li className="px-4 py-2 hover:underline cursor-pointer">
                  <a href="/">Home</a>
                </li>
                <li className="px-4 py-2 hover:underline cursor-pointer">
                  <a href="/dashboard">Dashboard</a>
                </li>
                {profile?.slug && <li className="px-4 py-2 hover:underline cursor-pointer">
                  <a href={`/user/${profile?.slug}`}>Profile</a>
                </li>}
                {profile?.admin && <li className="px-4 py-2 hover:underline cursor-pointer">
                  <a href={`/admin/${profile?.slug}`}>Admin</a>
                </li>}
                <hr/>
                <li className="px-4 py-2 cursor-pointer">
                  <a style={{padding: '2px'}} className="cursor-pointer" onClick={toggleDark}>
                    {isDark ? '🌙' : '☀️'}
                  </a>
                </li>
                <hr/>
                <li className="px-4 py-2 hover:underline cursor-pointer">
                  <button style={{padding: '2px'}}  className="cursor-pointer"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </li>
                
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationMenu;