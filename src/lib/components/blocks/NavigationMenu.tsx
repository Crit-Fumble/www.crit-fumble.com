"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useCallback, useMemo, useEffect } from 'react';
import useDarkMode from '@lib/hooks/useDarkMode';
import { useUserData } from '@/controllers/providers';
import Image from 'next/image';
import Link from 'next/link';

// Memoized loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center">
    <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin mr-2"></div>
    <span className="text-sm">Loading...</span>
  </div>
);

// Memoized user avatar component
const UserAvatar = ({ user }: { user: any }) => (
  user?.image ? (
    <Image 
      src={user.image} 
      alt={`${user.name || 'User'}'s profile`}
      width={32}
      height={32}
      className="rounded-full"
    />
  ) : (
    <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center">
      <span className="text-white text-xs">{user?.name?.[0] || 'U'}</span>
    </div>
  )
);

// Memoized dropdown menu item component
const DropdownMenuItem = ({ href, onClick, className, children }: { 
  href?: string; 
  onClick?: () => void; 
  className?: string;
  children: React.ReactNode;
}) => {
  const baseClass = "block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700";
  
  if (onClick) {
    return (
      <button onClick={onClick} className={`${baseClass} text-left w-full ${className || ''}`}>
        {children}
      </button>
    );
  }
  
  return (
    <Link href={href || '#'} className={`${baseClass} ${className || ''}`}>
      {children}
    </Link>
  );
};

const NavigationMenu = () => {
  const { data: session, status } = useSession();
  const { userData, isLoading: isLoadingUserData, refetch } = useUserData();
  const { isDark, toggleDark } = useDarkMode();
  
  // Memoize derived state to prevent recalculations on each render
  const isLoading = status === "loading" || isLoadingUserData;
  const isLoggedIn = status === "authenticated" && session?.user?.id != null;
  
  // Refetch user data if session is authenticated but user data is missing
  useEffect(() => {
    const refetchData = async () => {
      if (isLoggedIn && !userData && !isLoadingUserData) {
        console.log("NavigationMenu - Triggering user data refetch");
        try {
          await refetch();
        } catch (err) {
          console.error("Failed to refetch user data:", err);
        }
      }
    };
    
    refetchData();
  }, [isLoggedIn, userData, isLoadingUserData, refetch]);
  
  // Memoize user data to prevent unnecessary re-renders
  const userName = session?.user?.name || "User";
  const campaigns = useMemo(() => 
    userData?.campaigns?.filter?.((campaign: any) => campaign?.active) || [], 
    [userData?.campaigns]
  );
  
  // Memoize event handlers
  const handleLogout = useCallback(() => signOut({ callbackUrl: "/" }), []);
  const handleLogin = useCallback(() => signIn('discord'), []);
  const handleDarkModeToggle = useCallback(() => toggleDark(), [toggleDark]);

  // Memoize campaign dropdown
  const campaignElements = useMemo(() => {
    if (isLoading || !userData) return null;
    
    return campaigns?.length > 0 ? (
      <li className="group relative">
        <span className="hover:underline cursor-pointer">Campaigns</span>
        <div className="invisible group-hover:visible hover:visible absolute left-0 top-5 w-48 bg-white dark:bg-gray-800 shadow-lg z-10 rounded">
          <ul className="py-1">
            {campaigns.map((campaign: any) => (
              <li key={campaign.id}>
                <DropdownMenuItem href={`/campaign/${campaign.slug}`}>
                  {campaign.name}
                </DropdownMenuItem>
              </li>
            ))}
            <li className="border-t border-gray-100 dark:border-gray-700">
              <DropdownMenuItem 
                href="/campaign/create"
                className="text-blue-600 dark:text-blue-400"
              >
                + New Campaign
              </DropdownMenuItem>
            </li>
          </ul>
        </div>
      </li>
    ) : null;
  }, [campaigns, isLoading, userData]);

  // Memoize character dropdown
  const characterElements = useMemo(() => {
    if (isLoading || !userData) return null;
    
    return (
      <li className="group relative">
        <span className="hover:underline cursor-pointer">Characters</span>
        <div className="invisible group-hover:visible hover:visible absolute left-0 top-5 w-48 bg-white dark:bg-gray-800 shadow-lg z-10 rounded">
          <ul className="py-1">
            {userData.characters?.length > 0 ? (
              userData.characters.map((character: any) => (
                <li key={character.id}>
                  <DropdownMenuItem href={`/character/${character.slug}`}>
                    {character.name}
                  </DropdownMenuItem>
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
              <DropdownMenuItem 
                href="/character/create"
                className="text-blue-600 dark:text-blue-400"
              >
                + Create Character
              </DropdownMenuItem>
            </li>
          </ul>
        </div>
      </li>
    );
  }, [userData, isLoading]);

  return (
    <nav className={`h-12 p-0 m-0 flex flex-row items-center ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800'}`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side navigation */}
        <ul className="flex space-x-6 pl-4">
          <li>
            <Link href="/" className="hover:underline">Home</Link>
          </li>

          {/* Campaign and Character elements - only shown when logged in and data is loaded */}
          {isLoggedIn && !isLoading && userData && (
            <>
              {campaignElements}
              {characterElements}
            </>
          )}
        </ul>

        {/* Right side user menu */}
        <div className="flex items-center pr-4">
          {/* Dark mode toggle */}
          <button 
            onClick={handleDarkModeToggle}
            className="mr-4 text-lg"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? '🌙' : '☀️'}
          </button>

          {/* User menu */}
          {isLoggedIn ? (
            <div className="group relative">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  {/* User avatar/profile picture */}
                  <span className="flex items-center cursor-pointer">
                    <UserAvatar user={session?.user} />
                  </span>
                  
                  {/* User dropdown menu */}
                  <div className="invisible group-hover:visible hover:visible absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 shadow-lg z-10 rounded">
                    <ul className="py-1">
                      <li>
                        <DropdownMenuItem href="/dashboard">
                          Dashboard
                        </DropdownMenuItem>
                      </li>
                      {userData?.user?.slug && (
                        <li>
                          <DropdownMenuItem href={`/user/${userData.user.slug}`}>
                            Profile
                          </DropdownMenuItem>
                        </li>
                      )}
                      {userData?.user?.admin && (
                        <li>
                          <DropdownMenuItem href={`/admin/${userData.user.slug}`}>
                            Admin
                          </DropdownMenuItem>
                        </li>
                      )}
                      <li>
                        <DropdownMenuItem 
                          onClick={handleLogout}
                          className="text-red-600 dark:text-red-400"
                        >
                          Logout
                        </DropdownMenuItem>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          ) : isLoading ? (
            <LoadingSpinner />
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