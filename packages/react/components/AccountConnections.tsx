'use client';

import { useState } from 'react';
import { Button } from './Button';

interface AccountConnectionsProps {
  /** Custom class name for action links */
  linkClassName?: string;
  /** Custom API endpoints */
  apiEndpoints?: {
    worldanvil?: string;
    openai?: string;
  };
  /** Quick action links */
  quickActions?: Array<{
    href: string;
    icon: string;
    label: string;
  }>;
}

export function AccountConnections({ 
  linkClassName = "border-2 p-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors inline-block",
  apiEndpoints = {
    worldanvil: '/api/account/worldanvil',
    openai: '/api/account/openai'
  },
  quickActions = [
    { href: '/chat', icon: '💬', label: 'Chat with FumbleBot' },
    { href: '/roll', icon: '🎲', label: 'Roll Dice' },
    { href: '/data', icon: '📊', label: 'View My Data' }
  ]
}: AccountConnectionsProps) {
  const [worldAnvilConnected, setWorldAnvilConnected] = useState(false);
  const [openAIConnected, setOpenAIConnected] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const connectWorldAnvil = async () => {
    const tokenInput = document.getElementById('worldanvil-token') as HTMLInputElement;
    const token = tokenInput?.value;

    if (!token) {
      alert('Please enter your WorldAnvil token');
      return;
    }

    setIsLoading('worldanvil');
    try {
      const response = await fetch(apiEndpoints.worldanvil!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      if (result.success) {
        setWorldAnvilConnected(true);
        tokenInput.value = '';
        alert('WorldAnvil connected successfully!');
      } else {
        alert(result.error || 'Failed to connect WorldAnvil');
      }
    } catch (error) {
      alert('Error connecting to WorldAnvil');
    } finally {
      setIsLoading(null);
    }
  };

  const disconnectWorldAnvil = async () => {
    setIsLoading('worldanvil');
    try {
      const response = await fetch(apiEndpoints.worldanvil!, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        setWorldAnvilConnected(false);
        alert('WorldAnvil disconnected successfully!');
      } else {
        alert(result.error || 'Failed to disconnect WorldAnvil');
      }
    } catch (error) {
      alert('Error disconnecting WorldAnvil');
    } finally {
      setIsLoading(null);
    }
  };

  const connectOpenAI = async () => {
    const apiKeyInput = document.getElementById('openai-api-key') as HTMLInputElement;
    const orgIdInput = document.getElementById('openai-org-id') as HTMLInputElement;
    
    const apiKey = apiKeyInput?.value;
    const organizationId = orgIdInput?.value;

    if (!apiKey) {
      alert('Please enter your OpenAI API key');
      return;
    }

    setIsLoading('openai');
    try {
      const response = await fetch(apiEndpoints.openai!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, organizationId }),
      });

      const result = await response.json();
      if (result.success) {
        setOpenAIConnected(true);
        apiKeyInput.value = '';
        orgIdInput.value = '';
        alert('OpenAI connected successfully!');
      } else {
        alert(result.error || 'Failed to connect OpenAI');
      }
    } catch (error) {
      alert('Error connecting to OpenAI');
    } finally {
      setIsLoading(null);
    }
  };

  const disconnectOpenAI = async () => {
    setIsLoading('openai');
    try {
      const response = await fetch(apiEndpoints.openai!, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        setOpenAIConnected(false);
        alert('OpenAI disconnected successfully!');
      } else {
        alert(result.error || 'Failed to disconnect OpenAI');
      }
    } catch (error) {
      alert('Error disconnecting OpenAI');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg">Connect your accounts to unlock RPG tools and data</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WorldAnvil Connection */}
        <div className="border-2 border-purple-400 rounded-lg p-6 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-xl">🗺️</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">World Anvil</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {worldAnvilConnected ? 'Connected' : 'Connect your worlds and campaigns'}
              </p>
            </div>
          </div>
          
          {!worldAnvilConnected && (
            <div className="mb-4">
              <p className="text-sm mb-2">
                Generate your token at{' '}
                <a 
                  href="https://www.worldanvil.com/api/auth/key" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 underline"
                >
                  worldanvil.com/api/auth/key
                </a>
              </p>
              <input 
                type="password" 
                placeholder="Paste your WorldAnvil token here"
                className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500"
                id="worldanvil-token"
              />
            </div>
          )}
          
          <div className="flex gap-2">
            {!worldAnvilConnected ? (
              <Button 
                variant="primary"
                onClick={connectWorldAnvil}
                disabled={isLoading === 'worldanvil'}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading === 'worldanvil' ? 'Connecting...' : 'Connect'}
              </Button>
            ) : (
              <Button 
                variant="secondary"
                onClick={disconnectWorldAnvil}
                disabled={isLoading === 'worldanvil'}
              >
                {isLoading === 'worldanvil' ? 'Disconnecting...' : 'Disconnect'}
              </Button>
            )}
          </div>
        </div>

        {/* OpenAI Connection */}
        <div className="border-2 border-green-400 rounded-lg p-6 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">OpenAI</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {openAIConnected ? 'Connected' : 'Enable AI-powered features'}
              </p>
            </div>
          </div>
          
          {!openAIConnected && (
            <div className="mb-4">
              <p className="text-sm mb-2">
                Get your API key from{' '}
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 underline"
                >
                  OpenAI Platform
                </a>
              </p>
              <input 
                type="password" 
                placeholder="sk-..."
                className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 mb-2"
                id="openai-api-key"
              />
              <input 
                type="text" 
                placeholder="Organization ID (optional)"
                className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500"
                id="openai-org-id"
              />
            </div>
          )}
          
          <div className="flex gap-2">
            {!openAIConnected ? (
              <Button 
                variant="primary"
                onClick={connectOpenAI}
                disabled={isLoading === 'openai'}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading === 'openai' ? 'Connecting...' : 'Connect'}
              </Button>
            ) : (
              <Button 
                variant="secondary"
                onClick={disconnectOpenAI}
                disabled={isLoading === 'openai'}
              >
                {isLoading === 'openai' ? 'Disconnecting...' : 'Disconnect'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {quickActions.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-bold text-lg mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <div key={index} className="text-center">
                <span className="text-2xl block mb-2">{action.icon}</span>
                <a href={action.href} className={linkClassName}>{action.label}</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}