"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useMemo } from 'react';
import useDarkMode from '@lib/hooks/useDarkMode';
import { useUserData } from '@/controllers/AuthController';
import Image from 'next/image';

const NavigationMenu = () => {
  const { data: session, status, update } = useSession();
  const { userData, isLoading: isLoadingUserData } = useUserData();
  const { isDark, toggleDark } = useDarkMode();
  
  // Memoize derived state to prevent recalculations on each render
  const isLoading = useMemo(() => (status === "loading" || isLoadingUserData), [status, isLoadingUserData]);
  const isLoggedIn = useMemo(() => (status === "authenticated"), [status]);
  const isPlayer = useMemo(() => !!session?.user?.id, [session?.user?.id]);
  const campaigns = useMemo(() => userData?.campaigns?.filter?.((campaign: any) => campaign?.active) || [], [userData?.campaigns]);
  
  // Session update on first load
  useEffect(() => {
    // Only update session once on initial mount
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

          {/* Campaigns link - Only show if user has campaigns */}
          {isPlayer && (campaigns?.length ?? 0) > 0 && (
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
                        {campaign.name} {campaign.isGm && <span className="text-xs text-green-600 dark:text-green-400 ml-1">(GM)</span>}
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
          )}

          {/* Characters link - Show for all logged in users */}
          {isPlayer && (
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
                      href="/character/new"
                      className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      + New Character
                    </a>
                  </li>
                </ul>
              </div>
            </li>
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
            <div className="group relative">
              {/* User avatar/profile picture */}
              <a className="flex items-center">
                {session?.user?.image ? (
                  <Image 
                    src={session.user.image} 
                    alt="User profile" 
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">U</span>
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