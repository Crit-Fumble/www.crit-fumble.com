'use client';

import { useEffect, useState } from 'react';

interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
}

interface RolesResponse {
  roles: DiscordRole[];
  guildName?: string;
  guildId?: string;
}

export default function UserRolesDisplay() {
  const [roles, setRoles] = useState<DiscordRole[]>([]);
  const [guildName, setGuildName] = useState<string>('Discord Server');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/roles');
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Not authenticated');
          return;
        }
        if (response.status === 500) {
          setError('Discord not configured or roles not available');
          return;
        }
        throw new Error(`Failed to fetch roles: ${response.status}`);
      }

      const data: RolesResponse = await response.json();
      setRoles(data.roles);
      if (data.guildName) {
        setGuildName(data.guildName);
      }
    } catch (err) {
      console.error('Error fetching user roles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (color: number): string => {
    if (color === 0) return '#99aab5'; // Default Discord role color
    return `#${color.toString(16).padStart(6, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 dark:border-purple-400"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Loading Discord roles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center space-x-2">
          <span className="text-red-600 dark:text-red-400">⚠️</span>
          <span className="text-sm text-red-600 dark:text-red-400">Error loading roles: {error}</span>
        </div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 dark:text-gray-400">📝</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">No Discord roles found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
        <span className="mr-2">🎭</span>
        {guildName} Roles
      </h3>
      <div className="space-y-2">
        {roles.map((role) => (
          <div
            key={role.id}
            className="flex items-center justify-between px-3 py-2 rounded-md"
            style={{ 
              backgroundColor: `${getRoleColor(role.color)}15`,
              borderLeft: `3px solid ${getRoleColor(role.color)}`
            }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getRoleColor(role.color) }}
              />
              <span 
                className="text-sm font-medium"
                style={{ color: getRoleColor(role.color) }}
              >
                {role.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {role.managed && (
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                  Bot
                </span>
              )}
              {role.mentionable && (
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                  @
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        Roles are sorted by hierarchy (highest first)
      </div>
    </div>
  );
}