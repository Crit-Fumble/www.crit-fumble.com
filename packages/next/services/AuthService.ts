import NextAuth, { getServerSession as _getServerSession, AuthOptions } from "next-auth";
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord";
import prisma from "./DatabaseService";
import { randomUUID } from "node:crypto";

/**
 * Interface for Discord authentication configuration
 */
export interface DiscordAuthConfig {
  clientId: string;
  clientSecret: string;
}

/**
 * Creates an AuthOptions configuration object with provided Discord credentials
 */
export function createAuthConfig(discordConfig: DiscordAuthConfig): AuthOptions {
  // Check if required environment variables are set
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.warn('WARNING: NEXTAUTH_SECRET is not set. This is required for JWT encryption.');
  }
  
  return {
    // Add proper JWT configuration
    jwt: {
      secret: secret,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    
    // Add cookie configuration
    cookies: {
      sessionToken: {
        name: 'next-auth.session-token',
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        },
      },
    },
    
    providers: [
      DiscordProvider({
        clientId: discordConfig.clientId,
        clientSecret: discordConfig.clientSecret,
      }),
    ],
    callbacks: {
    async session({ session, token, trigger } : any) {
      if (!session?.user) {
        return session;
      }

      // Basic session user data
      // Ensure we properly handle 0 as a valid ID
      const providerAccountId = token?.providerAccountId;
      if (providerAccountId !== undefined && providerAccountId !== null) {
        session.user.id = providerAccountId;
      }
      session.user.provider = token?.provider || 'discord';
      
      try {
        // Check for existing Discord user record
        let discordUser = null;
        
        if (token?.providerAccountId) {
          console.log(`Looking up Discord user with ID: ${token.providerAccountId}`);
          
          // Use a single JOIN query to get both Discord user and User record
          const results = await prisma.$queryRaw<any[]>`
            SELECT d.*, u.id as user_id, u.name as user_name, u.slug, u.admin
            FROM "UserDiscord" d
            LEFT JOIN "User" u ON d.id = u.discord
            WHERE d.id = ${token.providerAccountId}
            LIMIT 1
          `;
          
          if (results && results.length > 0) {
            discordUser = results[0];
            console.log(`Found Discord user record for ID: ${token.providerAccountId}`);
            
            // Set avatar if available
            if (discordUser.avatar) {
              session.user.image = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`;
            }
            
            // Check if we also got a User record in the same query
            if (discordUser.user_id) {
              console.log(`Found main User record linked to Discord ID: ${discordUser.id}`);
              // Update session with additional user info from our database
              session.user = {
                ...session.user,
                dbId: discordUser.user_id, // Keep the database ID separate from the Discord ID
                name: discordUser.user_name || session.user.name,
                slug: discordUser.slug,
                admin: discordUser.admin || false
              };
            } else {
              console.log(`No User record found that links to Discord ID: ${discordUser.id}`);
            }
          } else {
            console.log(`No Discord user record found for ID: ${token.providerAccountId}`);
          }
        }
      } catch (error) {
        console.error("Error retrieving user data for session:", error);
      }
      
      console.log("Session after augmentation:", { 
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
        dbId: session.user.dbId
      });
      
      return session;
    },
    jwt({ token, profile, account, trigger, session } : any) {
      // Basic token management
      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }

      // Discord-specific handling
      if (account?.provider === 'discord' && profile) {
        const discordProfile = profile as DiscordProfile;
        token.providerAccountId = profile.id;
        
        // Store Discord profile information and ensure User record exists
        (async () => {
          try {
            // Update Discord user data
            const profileData = {
              name: profile.global_name || profile.username,
              username: profile.username,
              avatar: profile.avatar,
              email: profile.email,
              image_url: profile.image_url || `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            };
            
            // Use a transaction to handle both UserDiscord and User records in one database connection
            await prisma.$transaction(async (tx: any) => {
              // First upsert the Discord user
              const discordUser = await tx.userDiscord.upsert({
                where: { id: profile.id },
                update: profileData,
                create: {
                  id: profile.id,
                  ...profileData
                }
              });
              
              // Check if we need to create a User record
              const existingUser = await tx.user.findFirst({
                where: { discord: profile.id }
              });
              
              if (!existingUser) {
                // Generate a slug based on username with random suffix for uniqueness
                const baseSlug = (profileData.name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '-');
                const slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;
                
                // Create a new User record linked to this Discord account
                await tx.user.create({
                  data: {
                    id: randomUUID(), // Generate a UUID for the new user
                    name: profileData.name,
                    slug: slug,
                    email: profileData.email,
                    image: profileData.image_url,
                    discord: profile.id
                  }
                });
                
                console.log(`Created new User record for Discord user: ${profile.id}`);
              }
            });
          } catch (error) {
            console.error("Error updating user profiles:", error);
          }
        })();
      }

      return token;
    },
    },
  };
}

/**
 * Creates a NextAuth handler with the provided configuration
 */
export function createAuthHandler(authConfig: AuthOptions) {
  return NextAuth(authConfig);
}

/**
 * Creates a getServerSession function with the provided configuration
 */
export function createServerSessionGetter(authConfig: AuthOptions) {
  return async () => _getServerSession(authConfig);
}

// Default implementations using environment variables for backward compatibility
const defaultConfig = createAuthConfig({
  clientId: process.env.AUTH_DISCORD_ID ?? '',
  clientSecret: process.env.AUTH_DISCORD_SECRET ?? '',
});

export const handler = createAuthHandler(defaultConfig);

export async function getServerSession() {
  return _getServerSession(defaultConfig);
}