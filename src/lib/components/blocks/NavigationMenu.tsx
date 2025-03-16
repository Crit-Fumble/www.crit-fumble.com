"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useCallback, useMemo } from 'react';
import useDarkMode from '@lib/hooks/useDarkMode';
import { useUserData } from '@/controllers/providers';
import Image from 'next/image';
import Link from 'next/link';

const NavigationMenu = () => {
  const { data: session, status } = useSession();
  const { userData, isLoading: isLoadingUserData, refetch } = useUserData();
  const { isDark, toggleDark } = useDarkMode();
  
  // Add a simple console.log to see session status
  console.log("NavigationMenu - Session status:", status, !!session);
  // Log the user data in a more readable way
  console.log("NavigationMenu - User data:", userData ? JSON.stringify(userData, null, 2) : "No user data");
  console.log("NavigationMenu - User:", userData?.user ? JSON.stringify(userData.user, null, 2) : "No user object");

  // Memoize derived state to prevent recalculations on each render
  const isLoading = useMemo(() => (status === "loading" || isLoadingUserData), [status, isLoadingUserData]);
  const isLoggedIn = useMemo(() => 
    status === "authenticated" && 
    session?.user &&
    (session.user.id !== undefined && session.user.id !== null), 
  [status, session]);
  
  // Memoize user-dependent data to prevent recalculations
  const userName = useMemo(() => session?.user?.name || "User", [session]);
  const hasCharacters = useMemo(() => (userData?.characters?.length ?? 0) > 0, [userData]);

  const isPlayer = useMemo(() => 
    session?.user?.id !== undefined && session?.user?.id !== null, 
  [session?.user?.id]);
  const campaigns = useMemo(() => userData?.campaigns?.filter?.((campaign: any) => campaign?.active) || [], [userData?.campaigns]);

  // Memoize campaign-related elements
  const campaignElements = useMemo(() => {
    // Don't render anything if still loading user data or no userData available
    if (isLoadingUserData || !userData) {
      return null;
    }
    
    return campaigns?.length > 0 ? (
      <li className="group relative">
        <a className="hover:underline cursor-pointer">Campaigns</a>
        <div className="invisible group-hover:visible hover:visible absolute left-0 top-5 w-48 bg-white dark:bg-gray-800 shadow-lg z-10 rounded">
          <ul className="py-1">
            {campaigns?.map((campaign: any) => (
              <li key={campaign.id}>
                <a 
                  href={`/campaign/${campaign.slug}`}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {campaign.name}
                </a>
              </li>
            ))}
            <li className="border-t border-gray-100 dark:border-gray-700">
              <a 
                href="/campaign/create"
                className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                + New Campaign
              </a>
            </li>
          </ul>
        </div>
      </li>
    ) : null;
  }, [campaigns, isLoadingUserData, userData]);

  // Memoize character-related elements
  const characterElements = useMemo(() => {
    // Don't render anything if still loading user data or no userData available
    if (isLoadingUserData || !userData) {
      return null;
    }
    
    return (
      <li className="group relative">
        <a className="hover:underline cursor-pointer">Characters</a>
        <div className="invisible group-hover:visible hover:visible absolute left-0 top-5 w-48 bg-white dark:bg-gray-800 shadow-lg z-10 rounded">
          <ul className="py-1">
            {userData?.characters && userData.characters.length > 0 ? (
              userData.characters.map((character: any) => (
                <li key={character.id}>
                  <a 
                    href={`/character/${character.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {character.name}
                  </a>
                </li>
              ))
            ) : (
              <li>
                <span className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No characters found
                </span>
              </li>
            )}
            <li className="border-t border-gray-100 dark:border-gray-700">
              <a 
                href="/character/create"
                className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                + Create Character
              </a>
            </li>
          </ul>
        </div>
      </li>
    );
  }, [isLoadingUserData, userData]);

  // Memoize event handlers to prevent recreation on render
  const handleLogout = useCallback(async (): Promise<void> => {
    signOut({ callbackUrl: "/" });
  }, []);
  
  const handleLogin = useCallback(async (): Promise<void> => {
    signIn('discord');
  }, []);

  return (
    <nav className={`h-12 p-0 m-0 flex flex-row items-center ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800'}`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side navigation */}
        <ul className="flex space-x-6 pl-4">
          <li>
            <a href="/" className="hover:underline">Home</a>
          </li>

          {/* Campaign and Character elements - only shown when logged in and data is loaded */}
          {isLoggedIn && !isLoadingUserData && userData && (
            <>
              {/* {campaignElements} */}
              {characterElements}
            </>
          )}
        </ul>

        {/* Right side user menu */}
        <div className="flex items-center pr-4">
          {/* Dark mode toggle */}
          <button 
            onClick={toggleDark} 
            className="mr-4 text-lg"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? '🌙' : '☀️'}
          </button>

          {/* User menu */}
          {isLoggedIn ? (
            <>
              {/* Show loading indicator if user data is still loading */}
              {isLoadingUserData ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin mr-2"></div>
                  <span className="text-sm">Loading...</span>
                </div>
              ) : (
                <div className="group relative">
                  {/* User avatar/profile picture */}
                  <a className="flex items-center">
                    {session?.user?.image ? (
                      <Image 
                        src={session?.user?.image} 
                        alt={`${session?.user?.name || 'User'}'s profile`}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">{session?.user?.name?.[0] || 'U'}</span>
                      </div>
                    )}
                  </a>
                  
                  {/* User dropdown menu */}
                  <div className="invisible group-hover:visible hover:visible absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 shadow-lg z-10 rounded">
                    <ul className="py-1">
                      <li>
                        <a href="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</a>
                      </li>
                      {userData?.user?.slug && (
                        <li>
                          <a href={`/user/${userData?.user?.slug}`} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Profile</a>
                        </li>
                      )}
                      {userData?.user?.admin && (
                        <li>
                          <a href={`/admin/${userData?.user?.slug}`} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Admin</a>
                        </li>
                      )}
                      <li>
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          ) : isLoading ? (
            <span className="text-sm">Loading...</span>
          ) : (
            <button 
              onClick={handleLogin}
              className="text-sm hover:underline"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;