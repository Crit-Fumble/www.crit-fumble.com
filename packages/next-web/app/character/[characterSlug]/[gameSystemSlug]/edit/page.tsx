"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "../../../../../../next/client/views/components/blocks/Card";
import { getSession } from "next-auth/react";
import { LinkButton } from "../../../../../../next/client/views/components/ui/Button";

interface CharacterSheetEditProps {
  params: {
    characterSlug: string;
    rpgSystemSlug: string;
  };
}

export default function CharacterSheetEditPage({ params }: CharacterSheetEditProps) {
  const { characterSlug, rpgSystemSlug } = params;
  const router = useRouter();
  const [character, setCharacter] = useState<any>(null);
  const [characterSheet, setCharacterSheet] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch character and character sheet data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Check if user is logged in
        const session = await getSession();
        if (!session) {
          router.push('/login');
          return;
        }
        
        // Fetch character data
        const characterRes = await fetch(`/api/character/${characterSlug}`);
        if (!characterRes.ok) {
          throw new Error('Failed to load character data');
        }
        
        const characterData = await characterRes.json();
        setCharacter(characterData);
        
        // Fetch character sheet data
        const sheetRes = await fetch(`/api/character/${characterSlug}/sheet/${rpgSystemSlug}`);
        if (sheetRes.ok) {
          const sheetData = await sheetRes.json();
          setCharacterSheet(sheetData);
        }
        // If sheet not found, it's not an error - we'll create one
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading data:', err);
        setError(err.message || 'Failed to load data');
        setLoading(false);
      }
    }
    
    fetchData();
  }, [characterSlug, rpgSystemSlug, router]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Get form data
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      // Convert sheet data to JSON
      // This is a simplified example - in a real application,
      // you'd process form data to match your sheet data structure
      const sheetData: any = {};
      formData.forEach((value, key) => {
        // Parse nested form fields like "stats.strength"
        if (key.includes('.')) {
          const parts = key.split('.');
          let current = sheetData;
          
          for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) {
              current[parts[i]] = {};
            }
            current = current[parts[i]];
          }
          
          current[parts[parts.length - 1]] = value;
        } else {
          sheetData[key] = value;
        }
      });
      
      // Send data to API
      const response = await fetch(`/api/character/${characterSlug}/sheet/${rpgSystemSlug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterSlug,
          characterId: character.id,
          sheetId: characterSheet?.id,
          sheetData,
          sheetName: formData.get('sheetName') || `${character.name}'s ${rpgSystemSlug.toUpperCase()} Sheet`,
          summary: formData.get('summary') as string || '',
          description: formData.get('description') as string || '',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save character sheet');
      }
      
      // Redirect back to character view
      router.push(`/character/${characterSlug}`);
    } catch (err: any) {
      console.error('Error saving sheet:', err);
      setError(err.message || 'Failed to save character sheet');
    } finally {
      setSaving(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading character sheet...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="flex flex-col items-center h-64">
            <p className="text-red-500 mb-4">{error}</p>
            <LinkButton href={`/character/${characterSlug}`} variant="primary">
              Return to Character
            </LinkButton>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render character sheet edit form based on game system
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {character.name} - {rpgSystemSlug.toUpperCase()} Sheet
            </h1>
            <LinkButton href={`/character/${characterSlug}`} variant="outline" size="sm">
              Cancel
            </LinkButton>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Sheet name and level */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="sheetName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sheet Name
                  </label>
                  <input
                    type="text"
                    name="sheetName"
                    id="sheetName"
                    defaultValue={characterSheet?.name || `${character.name}'s ${rpgSystemSlug.toUpperCase()} Sheet`}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Summary
                  </label>
                  <input
                    type="text"
                    name="summary"
                    id="summary"
                    placeholder="Level 5 Wizard, Rogue/Fighter, etc."
                    defaultValue={characterSheet?.summary || ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    placeholder="Brief description of character build, background, or notes"
                    defaultValue={characterSheet?.description || ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              
              {/* Game system specific fields - we'd render different fields based on rpgSystemSlug */}
              {rpgSystemSlug === 'dnd5e' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">D&D 5e Character Sheet</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    This is where the D&D 5e character sheet fields would be rendered.
                    In a complete implementation, we'd have components for abilities, skills, inventory, etc.
                  </p>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4">
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Placeholder for D&D 5e character sheet form fields
                    </p>
                  </div>
                </div>
              )}
              
              {/* Save button */}
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Character Sheet'}
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
