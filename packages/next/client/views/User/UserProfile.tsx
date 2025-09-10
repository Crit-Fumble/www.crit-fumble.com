"use client";

import { Card, CardContent, CardHeader } from "../components/blocks/Card";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { updateUserInfo } from "../../controllers/UserController";
import { toast } from "react-hot-toast";

interface UserProfileProps {
  viewedUser: {
    id: string;
    name: string;
    email?: string;
    image?: string;
    roll20?: string | null;
    dd_beyond?: string | null;
    world_anvil?: string | null;
  };
  characters: any[];
  campaigns?: any[];
}

const UserProfileInner = ({ viewedUser, characters, campaigns }: UserProfileProps) => {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    roll20: viewedUser.roll20 || '',
    dd_beyond: viewedUser.dd_beyond || '',
    world_anvil: viewedUser.world_anvil || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty strings
    const dataToUpdate = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value.trim() !== '')
    );

    if (Object.keys(dataToUpdate).length === 0) {
      toast.error('No changes to save');
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedUser = await updateUserInfo(dataToUpdate);
      
      // Update the form data with the response
      setFormData({
        roll20: updatedUser.roll20 || '',
        dd_beyond: updatedUser.dd_beyond || '',
        world_anvil: updatedUser.world_anvil || '',
      });
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* User Info Card */}
        <Card>
          <CardHeader className="text-2xl font-bold">User Profile</CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              {viewedUser.image && (
                <img 
                  src={viewedUser.image} 
                  alt={viewedUser.name || 'User'} 
                  className="w-20 h-20 rounded-full"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{viewedUser.name}</h2>
                {viewedUser.email && (
                  <p className="text-gray-600">{viewedUser.email}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Linked Accounts Form */}
        <Card>
          <div className="flex justify-between items-center">
            <CardHeader>Linked Accounts</CardHeader>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4 transition-colors duration-200"
              >
                Edit
              </button>
            ) : (
              <div className="space-x-2 mr-4">
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form on cancel
                    setFormData({
                      roll20: viewedUser.roll20 || '',
                      dd_beyond: viewedUser.dd_beyond || '',
                      world_anvil: viewedUser.world_anvil || '',
                    });
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2 disabled:opacity-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="roll20" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Roll20 ID
                </label>
                <input
                  type="text"
                  id="roll20"
                  name="roll20"
                  value={formData.roll20}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Not connected"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dd_beyond" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  D&D Beyond Username
                </label>
                <input
                  type="text"
                  id="dd_beyond"
                  name="dd_beyond"
                  value={formData.dd_beyond}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Not connected"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="world_anvil" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  World Anvil ID
                </label>
                <input
                  type="text"
                  id="world_anvil"
                  name="world_anvil"
                  value={formData.world_anvil}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Not connected"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Characters Section */}
        <Card>
          <CardHeader className="text-gray-700 dark:text-gray-200">Your Characters</CardHeader>
          <CardContent>
            {characters && characters.length > 0 ? (
              <div className="space-y-2">
                {characters.map((character) => (
                  <div key={character.id} className="p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 transition-colors duration-200">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{character.name}</h3>
                    {character.party && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Party: {character.party.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No characters found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Wrapper component to maintain compatibility with existing code
const UserProfile = ({ session, ...props }: any) => {
  return <UserProfileInner {...props} />;
};

export default UserProfile;
