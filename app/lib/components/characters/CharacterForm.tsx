'use client';

/**
 * Character Form Component
 * 
 * Handles character creation and editing with World Anvil integration
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CharacterFormProps {
  mode: 'create' | 'edit';
  userId: string;
  initialData?: any;
}

interface WorldAnvilWorld {
  id: string;
  title: string;
  slug: string;
}

export default function CharacterForm({ mode, userId, initialData }: CharacterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [worldAnvilWorlds, setWorldAnvilWorlds] = useState<WorldAnvilWorld[]>([]);
  const [loadingWorlds, setLoadingWorlds] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    portrait_url: initialData?.portrait_url || '',
    worldanvil_world_id: initialData?.worldanvil_world_id || '',
    sync_with_worldanvil: initialData?.worldanvil_character_id ? true : false
  });

  // Load World Anvil worlds on component mount
  useEffect(() => {
    if (formData.sync_with_worldanvil) {
      loadWorldAnvilWorlds();
    }
  }, [formData.sync_with_worldanvil]);

  const loadWorldAnvilWorlds = async () => {
    setLoadingWorlds(true);
    try {
      const response = await fetch('/api/worldanvil/worlds');
      if (response.ok) {
        const data = await response.json();
        setWorldAnvilWorlds(data.worlds || []);
      } else {
        console.error('Failed to load World Anvil worlds');
      }
    } catch (error) {
      console.error('Error loading World Anvil worlds:', error);
    } finally {
      setLoadingWorlds(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = mode === 'create' 
        ? '/api/characters'
        : `/api/characters/${initialData.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id: userId
        })
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/character/${data.character.slug}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while saving the character');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Character Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Character Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Enter character name"
        />
      </div>

      {/* Character Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title or Class
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="e.g., Ranger, Wizard, Paladin"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe your character's appearance, personality, backstory..."
        />
      </div>

      {/* Portrait URL */}
      <div>
        <label htmlFor="portrait_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Portrait Image URL
        </label>
        <input
          type="url"
          id="portrait_url"
          name="portrait_url"
          value={formData.portrait_url}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="https://example.com/portrait.jpg"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Optional: Provide a URL to your character's portrait image
        </p>
      </div>

      {/* World Anvil Integration */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">World Anvil Integration</h3>
        
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="sync_with_worldanvil"
            name="sync_with_worldanvil"
            checked={formData.sync_with_worldanvil}
            onChange={handleInputChange}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor="sync_with_worldanvil" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Create/sync character block in World Anvil
          </label>
        </div>

        {formData.sync_with_worldanvil && (
          <div>
            <label htmlFor="worldanvil_world_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              World Anvil World
            </label>
            <select
              id="worldanvil_world_id"
              name="worldanvil_world_id"
              value={formData.worldanvil_world_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              required={formData.sync_with_worldanvil}
            >
              <option value="">Select a World Anvil world...</option>
              {worldAnvilWorlds.map(world => (
                <option key={world.id} value={world.id}>
                  {world.title}
                </option>
              ))}
            </select>
            {loadingWorlds && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Loading worlds...</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Character will be created as a block in the selected World Anvil world
            </p>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {isLoading 
            ? (mode === 'create' ? 'Creating...' : 'Updating...') 
            : (mode === 'create' ? 'Create Character' : 'Update Character')
          }
        </button>
        
        <Link
          href={mode === 'create' ? '/dashboard/characters' : `/character/${initialData?.slug}`}
          className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}