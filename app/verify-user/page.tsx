import { NextRequest, NextResponse } from 'next/server';

/**
 * Discord Linked Roles Verification Page
 * This page is used by Discord's Linked Roles system to verify users
 * for server role requirements.
 */
export default function VerifyUserPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Discord Verification
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Verify your Crit-Fumble account for Discord roles
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Account Verification
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Connect your Discord account to your Crit-Fumble profile to unlock 
                special server roles and features.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900">
                  🎲 D&D Player Role
                </h3>
                <p className="text-sm text-gray-500">
                  Verify you have an active D&D character in our system
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900">
                  🎯 Campaign Member Role
                </h3>
                <p className="text-sm text-gray-500">
                  Verify you're part of an active campaign
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900">
                  👑 DM Role
                </h3>
                <p className="text-sm text-gray-500">
                  Verify you're running an active campaign
                </p>
              </div>
            </div>

            <div>
              <a
                href="/api/discord/oauth2/authorize?redirectTo=/verify-user"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Connect Discord Account
              </a>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                By connecting your account, you agree to our{' '}
                <a href="/terms-of-service" className="text-indigo-600 hover:text-indigo-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy-policy" className="text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}