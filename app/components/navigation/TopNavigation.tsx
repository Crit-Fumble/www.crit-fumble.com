'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import Image from 'next/image';

interface Session {
  id: string;
  userId: string;
  username: string;
  name: string | null;
  email: string | null;
  avatar?: string;
  admin: boolean;
  roles?: string[];
}

export default function TopNavigation() {
  const { theme, toggleTheme } = useTheme();
  const [session, setSession] = useState<Session | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check for session data (simplified version)
    const sessionCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('fumble-session='));
    
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(sessionCookie.split('=')[1]));
        setSession(sessionData);
      } catch (error) {
        console.error('Error parsing session:', error);
      }
    }
  }, []);

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/linked-accounts', label: 'Linked Accounts', icon: '🔗' },
    { href: '/dashboard/characters', label: 'Characters', icon: '🎭' },
    ...(session?.admin ? [
      { href: '/admin', label: 'Admin', icon: '⚙️' }
    ] : []),
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center space-x-2">
              <Image 
                src="/img/cfg-logo.jpg" 
                alt="CFG Logo" 
                width={32} 
                height={32} 
                className="rounded-full"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Crit-Fumble
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* User menu */}
            {session ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col text-right text-sm">
                  <span className="text-gray-900 dark:text-white font-medium">
                    {session.name || session.username}
                  </span>
                  {session.admin && (
                    <span className="text-xs text-red-600 dark:text-red-400">
                      Admin
                    </span>
                  )}
                </div>
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  {session.avatar ? (
                    <Image
                      src={`https://cdn.discordapp.com/avatars/${session.userId}/${session.avatar}.png`}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">
                      {(session.name || session.username).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <a
                  href="/api/auth/logout"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign Out
                </a>
              </div>
            ) : (
              <a
                href="/api/discord/oauth/authorize"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </a>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}