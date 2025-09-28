'use client';

import { useState } from 'react';
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

  const handleInfoClick = (accountType: string) => {
    setSelectedAccount(accountType);
  };

  const closeModal = () => {
    setSelectedAccount(null);
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
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">World Anvil integration not yet connected.</p>
            <JsonDisplay data={{ status: 'not_connected', planned_features: ['Character import', 'World sync', 'Campaign integration'] }} title="Planned Integration" />
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
                    <div className="text-sm text-gray-600 dark:text-gray-400">Connect your World Anvil account</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Not Connected</span>
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