/**
 * User Management Table Component
 * 
 * Provides a table interface for managing users with search,
 * filtering, pagination, and CRUD operations.
 */

'use client';

import React, { useState, useEffect } from 'react';

export interface User {
  id: string;
  discord_id?: string | null;
  worldanvil_id?: string | null;
  name?: string | null;
  slug?: string | null;
  email?: string | null;
  admin?: boolean | null;
  createdAt: string;
  updatedAt: string;
  data?: any;
}

export interface UserFilter {
  search?: string;
  admin?: boolean;
  hasDiscord?: boolean;
  hasWorldAnvil?: boolean;
  limit?: number;
  offset?: number;
}

export interface UserListResult {
  users: User[];
  total: number;
  hasMore: boolean;
}

interface UserTableProps {
  onEditUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
  onCreateUser?: () => void;
}

export function UserManagementTable({
  onEditUser,
  onDeleteUser,
  onCreateUser
}: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [adminFilter, setAdminFilter] = useState<boolean | undefined>(undefined);
  const [discordFilter, setDiscordFilter] = useState<boolean | undefined>(undefined);
  const [worldanvilFilter, setWorldanvilFilter] = useState<boolean | undefined>(undefined);
  const [offset, setOffset] = useState(0);
  const limit = 25;

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (adminFilter !== undefined) params.set('admin', adminFilter.toString());
      if (discordFilter !== undefined) params.set('hasDiscord', discordFilter.toString());
      if (worldanvilFilter !== undefined) params.set('hasWorldAnvil', worldanvilFilter.toString());
      params.set('limit', limit.toString());
      params.set('offset', offset.toString());

      const response = await fetch(`/api/admin/users?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load users: ${response.statusText}`);
      }

      const result: UserListResult = await response.json();
      setUsers(result.users);
      setTotal(result.total);
      setHasMore(result.hasMore);

    } catch (error) {
      console.error('Error loading users:', error);
      setError(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Load users when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOffset(0); // Reset to first page when filters change
      loadUsers();
    }, search ? 500 : 0); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [search, adminFilter, discordFilter, worldanvilFilter]);

  // Load users when pagination changes
  useEffect(() => {
    loadUsers();
  }, [offset]);

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete user "${user.name || user.id}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }

      // Reload users
      await loadUsers();
      
      if (onDeleteUser) {
        onDeleteUser(user);
      }

    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && users.length === 0) {
    return <div className="p-4 text-center">Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>
        <button
          onClick={onCreateUser}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create User
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={adminFilter === undefined ? '' : adminFilter.toString()}
          onChange={(e) => setAdminFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Users</option>
          <option value="true">Admins Only</option>
          <option value="false">Non-Admins Only</option>
        </select>

        <select
          value={discordFilter === undefined ? '' : discordFilter.toString()}
          onChange={(e) => setDiscordFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Discord</option>
          <option value="true">Has Discord</option>
          <option value="false">No Discord</option>
        </select>

        <select
          value={worldanvilFilter === undefined ? '' : worldanvilFilter.toString()}
          onChange={(e) => setWorldanvilFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All WorldAnvil</option>
          <option value="true">Has WorldAnvil</option>
          <option value="false">No WorldAnvil</option>
        </select>

        <div className="text-sm text-gray-600 flex items-center">
          {total} total users
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Integrations
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.name || 'Unnamed'}
                    </div>
                    <div className="text-sm text-gray-500">ID: {user.id}</div>
                    {user.slug && (
                      <div className="text-sm text-gray-500">Slug: {user.slug}</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="text-sm text-gray-900">
                    {user.email || 'No email'}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    {user.discord_id && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Discord
                      </span>
                    )}
                    {user.worldanvil_id && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        WorldAnvil
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2">
                  {user.admin ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Admin
                    </span>
                  ) : (
                    <span className="text-gray-400">User</span>
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditUser?.(user)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} users
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={!hasMore}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center text-gray-500">Loading...</div>
      )}
    </div>
  );
}