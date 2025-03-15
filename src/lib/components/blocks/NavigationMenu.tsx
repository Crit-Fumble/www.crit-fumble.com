"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import Image from "next/image";
import useDarkMode from '@lib/hooks/useDarkMode';

const NavigationMenu = () => {
  const { data: session, status, update } = useSession();
  const { isDark, toggleDark } = useDarkMode();
  
  // Memoize derived state to prevent recalculations on each render
  const isLoading = useMemo(() => (status === "loading"), [status]);
  const isLoggedIn = useMemo(() => (status === "authenticated"), [status]);
  const isPlayer = useMemo(() => (!!session?.profile?.id), [session?.profile?.id]);
  const campaigns = useMemo(() => session?.campaigns?.filter?.((campaign: any) => campaign?.active), [session?.campaigns]);
  const profile = useMemo(() => session?.profile, [session?.profile]);
  
  // State management
  const [characters, setCharacters] = useState<any[]>([]);
  const [fetchingCharacters, setFetchingCharacters] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState('');

  // Debug logging without causing re-renders
  useEffect(() => {
    console.log("NavigationMenu render - Auth status:", {
      isLoggedIn,
      isPlayer,
      fetchingCharacters,
      charactersCount: characters?.length,
      profileId: session?.profile?.id
    });
  }, [characters?.length, fetchingCharacters, isLoggedIn, isPlayer, session?.profile?.id]);

  // Session update on first load
  useEffect(() => {
    // Only update session once on initial mount
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Character fetching logic - memoize the fetch function to prevent recreation on render
  const fetchCharacters = useCallback(async () => {
    if (!isLoggedIn || fetchingCharacters) return;
    
    console.log("Fetching characters - setting loading state");
    setFetchingCharacters(true);
    
    try {
      // Try to get characters from the API first
      try {
        const response = await fetch('/api/user');
        console.log("API response:", response.status, response.statusText);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Characters data received from API:", data);
          if (data.characters && data.characters.length > 0) {
            setCharacters(data.characters);
            console.log("Characters state updated with", data.characters.length, "characters from API");
            
            // Only update session if character count differs to prevent loops
            const sessionCharLength = session?.characters?.length || 0;
            const dataCharLength = data.characters.length;
            
            if (sessionCharLength !== dataCharLength) {
              console.log("Character count differs, updating session");
              await update({ characters: data.characters });
            }
            
            setFetchingCharacters(false);
            return;
          }
        } else {
          console.error("API response not OK:", response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch characters from API:', error);
      }
      
      // If API call fails or returns no characters, fall back to session data
      const sessionCharacters = session?.characters;
      if (sessionCharacters && sessionCharacters.length > 0) {
        console.log("Falling back to session characters:", sessionCharacters);
        setCharacters(sessionCharacters);
        console.log("Characters state updated with", sessionCharacters.length, "characters from session");
      } else {
        console.log("No characters found in session either:", sessionCharacters);
      }
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    } finally {
      setFetchingCharacters(false);
    }
  // Safely reference session.characters without causing render loops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, fetchingCharacters, update, session?.characters?.length]);

  // Use a ref to track if we've done the initial fetch
  const initialFetchDone = React.useRef(false);
  
  // Run character fetching only once on login or when explicitly triggered
  useEffect(() => {
    if (!isLoggedIn) {
      initialFetchDone.current = false;
      return;
    }
    
    if (!initialFetchDone.current) {
      console.log("Initial character fetch");
      fetchCharacters();
      initialFetchDone.current = true;
    }
  // Keep fetchCharacters in dependencies to update if the function changes
  // but use the ref to prevent multiple executions
  }, [isLoggedIn, fetchCharacters]);

  // Memoize event handlers to prevent recreation on render
  const handleLogout = useCallback(async (): Promise<void> => {
    signOut({ callbackUrl: "/" });
  }, []);
  
  const handleLogin = useCallback(async (): Promise<void> => {
    signIn('discord');
  }, []);

  const handleDropdown = useCallback(async (menuId: string): Promise<void> => {
    setDropdownOpen((current) => current === menuId ? '' : menuId);
  }, []);

  // Only re-render what's necessary - use the memoized state
  return (
    <nav className={`h-12 p-0 m-0 flex flex-row items-center justify-end ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex space-x-4 pl-4">
          {isPlayer && (campaigns?.length ?? 0) > 0 && (
            <li className="relative">
              <button
                className="hover:underline"
                onClick={() => handleDropdown('campaigns')}
              >
                Campaigns
              </button>
              {dropdownOpen === 'campaigns' && (
                <ul className={`absolute bg-white dark:bg-black mt-3 shadow-lg`}>
                  {isLoading
                    ? <li className="px-4 py-2 italic text-nowrap">Loading...</li>
                    : campaigns 
                      ? campaigns.map((campaign: any) => (
                          <li key={campaign?.id} className="px-4 py-2 hover:underline cursor-pointer text-nowrap">
                            <a href={`/campaign/${campaign.slug}`}>{campaign?.name}</a> 
                          </li>
                        ))
                      : <li className="px-4 py-2 italic text-nowrap">No Campaigns Found.</li>
                  }
                </ul>
              )}
            </li>
          )}
          {isPlayer && (
            <li className="relative">
              <button
                className="hover:underline"
                onClick={() => handleDropdown('characters')}
              >
                Characters
              </button>
              {dropdownOpen === 'characters' && (
                <ul className={`absolute bg-white dark:bg-black mt-3 shadow-lg`}>
                  {fetchingCharacters ? (
                    <li className="px-4 py-2 italic text-nowrap">Loading...</li>
                  ) : characters && characters.length > 0 ? (
                    characters.map((character) => (
                      <li key={character?.id} className="px-4 py-2 hover:underline cursor-pointer text-nowrap">
                        <a href={`/character/${character.slug}`}>{character?.name}</a> 
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 italic text-nowrap">No Characters Found.</li>
                  )}
                  <li className="px-4 py-2 hover:underline cursor-pointer text-nowrap border-t">
                    <a href="/character/create">Create New Character</a>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>

      <div className="ml-auto flex flex-row gap-2 items-center">
        <ul>
          <li className="h-12 w-12 p-0 m-0">
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
                onClick={handleLogin}
              >
                <span>Login</span>
              </button>
            )}

            {dropdownOpen === 'user' && (
              <ul className={`absolute right-0 text-right mt-[-6px] bg-white dark:bg-black shadow-lg`}>
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