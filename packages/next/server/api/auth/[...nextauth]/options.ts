import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import DiscordProvider from 'next-auth/providers/discord';
import { ConfigRegistry } from '@crit-fumble/core/server/config/registry';

// Initialize Prisma client
const prisma = new PrismaClient();

// Get configuration from registry
const registry = ConfigRegistry.getInstance();
const clientId = registry.get<string>('DISCORD_CLIENT_ID', '');
const clientSecret = registry.get<string>('DISCORD_CLIENT_SECRET', '');
const baseUrl = registry.get<string>('NEXTAUTH_URL', 'http://localhost:3000');

if (!clientId || !clientSecret) {
  console.warn('Discord OAuth credentials not configured properly');
}

/**
 * NextAuth configuration options
 */
export const authOptions: NextAuthOptions = {
  // Configure Prisma adapter for NextAuth
  adapter: PrismaAdapter(prisma),
  
  // Configure session handling
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Authentication providers
  providers: [
    DiscordProvider({
      clientId,
      clientSecret,
      authorization: {
        params: { 
          scope: 'identify email guilds' 
        }
      },
    }),
  ],
  
  // Customize JWT handling
  callbacks: {
    // Add user id to session
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    
    // Handle JWT creation and augmentation
    jwt: async ({ token, user, account, profile }) => {
      // Initial sign in
      if (account && user) {
        // Store relevant Discord info in the token
        if (account.provider === 'discord' && profile) {
          token.discordId = profile.id;
        }
      }
      
      return token;
    },
  },
  
  // Custom pages
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  
  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;
