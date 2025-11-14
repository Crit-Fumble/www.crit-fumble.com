'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";

// Simple Card components - preserving original styling
const Card: React.FC<{ children?: any, className?: string, id?: string }> = ({ children, className = "", id }) => {
  return (
    <div id={id} className={`bg-white dark:bg-gray-800 shadow-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<{ children?: any, className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`bg-[#552e66] text-white p-4 ${className}`}>
      {children}
    </div>
  );
};

const CardContent: React.FC<{ children?: any, className?: string }> = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-4 text-gray-900 dark:text-gray-300 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// JSON Display Component
const JsonDisplay: React.FC<{ data: any; title: string }> = ({ data, title }) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

interface LinkedAccountsClientProps {
  userData: any;
}

export default function LinkedAccountsClient({ userData }: LinkedAccountsClientProps) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [worldAnvilStatus, setWorldAnvilStatus] = useState<any>(null);
  const [worldAnvilToken, setWorldAnvilToken] = useState('');
  const [isConnectingWA, setIsConnectingWA] = useState(false);
  const [waError, setWaError] = useState<string | null>(null);
  const [waSuccess, setWaSuccess] = useState<string | null>(null);

  // Load World Anvil connection status
  useEffect(() => {
    fetch('/api/account/worldanvil')
      .then(res => res.json())
      .then(data => setWorldAnvilStatus(data))
      .catch(err => console.error('Error loading World Anvil status:', err));
  }, []);

  const handleInfoClick = (accountType: string) => {
    setSelectedAccount(accountType);
  };

  const closeModal = () => {
    setSelectedAccount(null);
    setWaError(null);
    setWaSuccess(null);
  };

  const handleConnectWorldAnvil = async () => {
    if (!worldAnvilToken.trim()) {
      setWaError('Please enter your World Anvil API token');
      return;
    }

    setIsConnectingWA(true);
    setWaError(null);
    setWaSuccess(null);

    try {
      const response = await fetch('/api/account/worldanvil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: worldAnvilToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setWaSuccess(data.message);
        setWorldAnvilStatus({ connected: true, worldanvil: data.worldanvil });
        setWorldAnvilToken('');
        setTimeout(closeModal, 2000);
      } else {
        setWaError(data.error || 'Failed to connect World Anvil account');
      }
    } catch (error) {
      setWaError('Network error - please try again');
    } finally {
      setIsConnectingWA(false);
    }
  };

  const handleDisconnectWorldAnvil = async () => {
    if (!confirm('Are you sure you want to disconnect your World Anvil account?')) {
      return;
    }

    try {
      const response = await fetch('/api/account/worldanvil', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setWaSuccess(data.message);
        setWorldAnvilStatus({ connected: false, worldanvil: null });
        setTimeout(() => setWaSuccess(null), 3000);
      } else {
        setWaError(data.error || 'Failed to disconnect World Anvil account');
      }
    } catch (error) {
      setWaError('Network error - please try again');
    }
  };

  const renderAccountData = (accountType: string) => {
    switch (accountType) {
      case 'discord':
        return (
          <div className="space-y-4">
            <JsonDisplay data={userData} title="Full User Data" />
            {userData.discord && (
              <JsonDisplay data={userData.discord} title="Discord Specific Data" />
            )}
            {userData.roles && userData.roles.length > 0 && (
              <JsonDisplay data={userData.roles} title="Discord Roles" />
            )}
          </div>
        );
      
      case 'worldanvil':
        if (worldAnvilStatus?.connected) {
          return (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-4">
                <p className="text-green-800 dark:text-green-200">
                  Connected as <strong>{worldAnvilStatus.worldanvil.username}</strong>
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  World Anvil ID: {worldAnvilStatus.worldanvil.id}
                </p>
              </div>

              {waSuccess && (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded">
                  {waSuccess}
                </div>
              )}

              {waError && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded">
                  {waError}
                </div>
              )}

              <button
                onClick={handleDisconnectWorldAnvil}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Disconnect World Anvil
              </button>

              <div className="border-t dark:border-gray-700 pt-4">
                <JsonDisplay
                  data={{
                    connected: true,
                    username: worldAnvilStatus.worldanvil.username,
                    id: worldAnvilStatus.worldanvil.id,
                    features: ['Character sheet linking', 'World sync', 'Campaign integration']
                  }}
                  title="Connection Details"
                />
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                How to get your World Anvil API Token:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-300">
                <li>Log in to your World Anvil account</li>
                <li>Go to Settings → API</li>
                <li>Generate a new API token</li>
                <li>Copy and paste it below</li>
              </ol>
              <a
                href="https://www.worldanvil.com/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm block mt-2"
              >
                → Open World Anvil API Settings
              </a>
            </div>

            {waSuccess && (
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded">
                {waSuccess}
              </div>
            )}

            {waError && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded">
                {waError}
              </div>
            )}

            <div>
              <label htmlFor="wa-token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                World Anvil API Token
              </label>
              <input
                id="wa-token"
                type="password"
                value={worldAnvilToken}
                onChange={(e) => setWorldAnvilToken(e.target.value)}
                placeholder="Paste your World Anvil API token here"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleConnectWorldAnvil}
              disabled={isConnectingWA || !worldAnvilToken.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition-colors"
            >
              {isConnectingWA ? 'Connecting...' : 'Connect World Anvil Account'}
            </button>

            <div className="border-t dark:border-gray-700 pt-4">
              <JsonDisplay
                data={{
                  status: 'not_connected',
                  planned_features: ['Character sheet linking', 'World sync', 'Campaign integration']
                }}
                title="Integration Features"
              />
            </div>
          </div>
        );
      
      case 'openai':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">OpenAI integration not yet implemented.</p>
            <JsonDisplay data={{ status: 'not_connected', planned_features: ['AI character generation', 'Story assistance', 'Rules lookup'] }} title="Planned Integration" />
          </div>
        );
      
      default:
        return <p>No data available</p>;
    }
  };

  return (
    <div className={'flex flex-col justify-stretch items-center p-0 m-0'}>
      <div className="absolute h-[389px] p-0 m-0 w-full overflow-hidden"> 
        <Image fill sizes="100vw" style={{ objectFit: 'cover' }} className="w-full min-h-[389px]" alt="CFG Background" src='/img/dice-back.jpg'/>
      </div>
      <div className={'p-8 pt-[192px] flex flex-col items-center text-center'} >
        <div className={'p-4 flex justify-center'}>
          <Image className={'rounded-full'} alt="CFG Logo" src='/img/cfg-logo.jpg' height={'256'} width={'256'}/>
        </div>

        <Card>
          <CardHeader>
            <h1>Linked Accounts</h1>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Discord Account */}
              <div className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center gap-3">
                  <Image 
                    src="/img/discord.svg" 
                    alt="Discord" 
                    width={24} 
                    height={24}
                  />
                  <div className="text-left">
                    <div className="font-semibold">Discord</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Connected as {userData.username}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-sm">✓ Connected</span>
                  <button
                    onClick={() => handleInfoClick('discord')}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="View connection details"
                  >
                    ℹ️
                  </button>
                </div>
              </div>

              {/* WorldAnvil Account */}
              <div className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-400 rounded"></div>
                  <div className="text-left">
                    <div className="font-semibold">World Anvil</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {worldAnvilStatus?.connected
                        ? `Connected as ${worldAnvilStatus.worldanvil.username}`
                        : 'Connect your World Anvil account'
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {worldAnvilStatus?.connected ? (
                    <span className="text-green-600 text-sm">✓ Connected</span>
                  ) : (
                    <button
                      onClick={() => handleInfoClick('worldanvil')}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition-colors"
                    >
                      Connect
                    </button>
                  )}
                  <button
                    onClick={() => handleInfoClick('worldanvil')}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="View integration details"
                  >
                    ℹ️
                  </button>
                </div>
              </div>

              {/* OpenAI Account */}
              <div className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-400 rounded"></div>
                  <div className="text-left">
                    <div className="font-semibold">OpenAI</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Connect for AI features</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Not Connected</span>
                  <button
                    onClick={() => handleInfoClick('openai')}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="View integration details"
                  >
                    ℹ️
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal for displaying account data */}
      <Modal
        isOpen={selectedAccount !== null}
        onClose={closeModal}
        title={`${selectedAccount ? selectedAccount.charAt(0).toUpperCase() + selectedAccount.slice(1) : ''} Connection Details`}
      >
        {selectedAccount && renderAccountData(selectedAccount)}
      </Modal>
    </div>
  );
}