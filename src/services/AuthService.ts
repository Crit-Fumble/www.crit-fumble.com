"use server";

import NextAuth, { getServerSession as _getServerSession, AuthOptions } from "next-auth";
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord";
import { discord } from "@/config/services";
import { getUserByDiscordId, getUserByDiscordName } from "./ProfileService";
import { getCharactersByPlayerId } from "./CharacterService";
import { getPartiesByPlayerId } from "./PartyService";
import { getCampaignsByPlayerId } from "./CampaignService";
import prisma from "./DatabaseService";
import { randomUUID } from "node:crypto";

const config: AuthOptions = { 
  providers: [ 
      DiscordProvider({
        clientId: discord.authId,
        clientSecret: discord.authSecret,
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
          discordUser = await prisma.userDiscord.findUnique({
            where: { id: token.providerAccountId }
          });
          
          if (discordUser) {
            console.log(`Found Discord user record for ID: ${token.providerAccountId}`);
            
            // Set avatar if available
            if (discordUser.avatar) {
              session.user.image = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`;
            }
            
            // Find the User record that links to this Discord profile
            const userRecord = await prisma.user.findFirst({
              where: { discord: discordUser.id }
            });
            
            if (userRecord) {
              console.log(`Found main User record linked to Discord ID: ${discordUser.id}`);
              // Update session with additional user info from our database
              session.user = {
                ...session.user,
                dbId: userRecord.id, // Keep the database ID separate from the Discord ID
                name: userRecord.name || session.user.name,
                slug: userRecord.slug,
                admin: userRecord.admin || false
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
        
        // Store Discord profile information
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
            
            await prisma.userDiscord.upsert({
              where: { id: profile.id },
              update: profileData,
              create: {
                id: profile.id,
                ...profileData
              }
            });
          } catch (error) {
            console.error("Error updating Discord profile:", error);
          }
        })();
      }

      return token;
    },
  },
};

export const handler = NextAuth(config);

// Export the getServerSession function for use in other places
export async function getServerSession() {
  return _getServerSession(config);
}