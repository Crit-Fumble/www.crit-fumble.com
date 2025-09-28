'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../../lib/components/ui/card';
import { useState, useEffect } from 'react';

interface RPGSystem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  worldanvil_system_id?: string;
  discord_role_id?: string;
  discord_chat_id?: string;
  discord_forum_id?: string;
  discord_voice_id?: string;
  discord_thread_id?: string;
  discord_post_id?: string;
  is_active: boolean;
  created_at: string;
  _count: {
    rpg_campaigns: number;
    rpg_sheets: number;
  };
}

interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
}

interface DiscordChannel {
  id: string;
  name: string;
  type: number;
  position: number;
  parent_id?: string;
}

export default function RPGSystemsAdmin() {
  const [systems, setSystems] = useState<RPGSystem[]>([]);
  const [roles, setRoles] = useState<DiscordRole[]>([]);
  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    worldanvil_system_id: '',
    discord_role_id: '',
    discord_chat_id: '',
    discord_forum_id: '',
    discord_voice_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [systemsRes, rolesRes, channelsRes] = await Promise.all([
        fetch('/api/admin/rpg-systems'),
        fetch('/api/admin/discord-roles'),
        fetch('/api/admin/discord-channels')
      ]);

      if (systemsRes.ok) {
        const systemsData = await systemsRes.json();
        setSystems(systemsData.systems || []);
      }

      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        setRoles(rolesData.roles || []);
      }

      if (channelsRes.ok) {
        const channelsData = await channelsRes.json();
        setChannels(channelsData.channels || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/rpg-systems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowAddForm(false);
        setFormData({
          title: '',
          description: '',
          worldanvil_system_id: '',
          discord_role_id: '',
          discord_chat_id: '',
          discord_forum_id: '',
          discord_voice_id: ''
        });
        loadData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating system:', error);
      alert('Failed to create system');
    }
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown Role';
  };

  const getChannelName = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    return channel ? `#${channel.name}` : 'Unknown Channel';
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">RPG Systems Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {showAddForm ? 'Cancel' : 'Add New System'}
        </button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New RPG System</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">World Anvil System ID</label>
                <input
                  type="text"
                  value={formData.worldanvil_system_id}
                  onChange={(e) => setFormData({...formData, worldanvil_system_id: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Discord Role (Optional)</label>
                <select
                  value={formData.discord_role_id}
                  onChange={(e) => setFormData({...formData, discord_role_id: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">No role selected</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Discord Chat Channel (Optional)</label>
                <select
                  value={formData.discord_chat_id}
                  onChange={(e) => setFormData({...formData, discord_chat_id: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">No channel selected</option>
                  {channels.filter(ch => ch.type === 0).map(channel => (
                    <option key={channel.id} value={channel.id}>#{channel.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Discord Forum Channel (Optional)</label>
                <select
                  value={formData.discord_forum_id}
                  onChange={(e) => setFormData({...formData, discord_forum_id: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">No forum selected</option>
                  {channels.filter(ch => ch.type === 15).map(channel => (
                    <option key={channel.id} value={channel.id}>#{channel.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Discord Voice Channel (Optional)</label>
                <select
                  value={formData.discord_voice_id}
                  onChange={(e) => setFormData({...formData, discord_voice_id: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">No voice channel selected</option>
                  {channels.filter(ch => ch.type === 2).map(channel => (
                    <option key={channel.id} value={channel.id}>🔊 {channel.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Create System
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        <h2 className="text-2xl font-semibold">Existing RPG Systems</h2>
        {systems.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No RPG systems configured yet. Add your first system above!
            </CardContent>
          </Card>
        ) : (
          systems.map((system) => (
            <Card key={system.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{system.title}</span>
                  <span className="text-sm text-gray-500">
                    {system._count.rpg_campaigns} campaigns • {system._count.rpg_sheets} sheets
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {system.description && (
                  <p className="text-gray-600 mb-4">{system.description}</p>
                )}
                
                <div className="space-y-2 text-sm">
                  {system.worldanvil_system_id && (
                    <div><strong>World Anvil ID:</strong> {system.worldanvil_system_id}</div>
                  )}
                  {system.discord_role_id && (
                    <div><strong>Discord Role:</strong> {getRoleName(system.discord_role_id)}</div>
                  )}
                  {system.discord_chat_id && (
                    <div><strong>Chat Channel:</strong> {getChannelName(system.discord_chat_id)}</div>
                  )}
                  {system.discord_forum_id && (
                    <div><strong>Forum Channel:</strong> {getChannelName(system.discord_forum_id)}</div>
                  )}
                  {system.discord_voice_id && (
                    <div><strong>Voice Channel:</strong> {getChannelName(system.discord_voice_id)}</div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                  Created: {new Date(system.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}