"use server";

import NextAuth, { getServerSession as _getServerSession, AuthOptions } from "next-auth";
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord";
import { discord } from "@/config/services";
import { getUserByDiscordId, getUserByDiscordName } from "./ProfileService";
import { getCharactersByPlayerId } from "./CharacterService";
import { getPartiesByPlayerId } from "./PartyService";
import { getCampaignsByPlayerId } from "./CampaignService";
import DatabaseService from "./DatabaseService";
// import { getUserByDiscordName } from "./UserService";

const config: AuthOptions = { 
  providers: [ 
      DiscordProvider({
        clientId: discord.authId,
        clientSecret: discord.authSecret,
      }),
  ],
  callbacks: {
    async session({ session, token, trigger } : any) {
      if (trigger === "update" && token?.provider === "discord") {
        const profileUpdate = {
          name: token?.providerUserName,
          displayName: token?.providerUserName,
          username: token?.discordProfile.username,
          avatar: token?.discordProfile.avatar,
          discriminator: token?.discordProfile.discriminator,
          // public_flags: token?.discordProfile.public_flags,
          // flags: token?.discordProfile.flags,
          banner: token?.discordProfile.banner,
          accent_color: token?.discordProfile.accent_color,
          global_name: token?.discordProfile.global_name,
          // avatar_decoration_data
          banner_color: token?.discordProfile.banner_color,
          mfa_enabled: token?.discordProfile.mfa_enabled,
          locale: token?.discordProfile.locale,
          // premium_type: token?.discordProfile.premium_type,
          email: token?.discordProfile.email,
          verified: token?.discordProfile.verified,
          image_url: token?.discordProfile.image_url,
        };

        await DatabaseService.userDiscord.upsert({
          where: {
            id: token?.providerAccountId
          },
          update: profileUpdate,
          create: {
            id: token?.providerAccountId,
            ...profileUpdate
          }
        });
      }

      // The return type will match the one returned in `useSession()`
      session.user = {
        ...session.user,
        id: token?.providerAccountId,
        provider: token?.provider,
        token: token?.providerToken,
      };

      if (session.user.name) {
        session.profile = await getUserByDiscordName(session.user.name);
      }

      if (!session?.profile?.id) {
        // console.log(`session 1`, session);
        
        return session;
      }

      [
        session.campaigns,
        session.characters,
        session.parties,
      ] = [
        await getCampaignsByPlayerId(session.profile.id),
        await getCharactersByPlayerId(session.profile.id),
        await getPartiesByPlayerId(session.profile.id),
      ];

      // console.log(`session 2`, session);
      return session;
    },
    jwt({ token, profile, account, trigger, session } : any) {
      if (session?.name) {
        token.providerUserName = session?.name
        token.providerImage = session?.image;
      }

      if (profile) {
        token.provider = account?.provider;
        token.providerToken = account?.access_token;
      }

      if (account?.provider === 'discord') {
        token.providerAccountId = profile?.id;
        
        // Create or update Account record for Discord login
        if (account && profile) {
          (async () => {
            try {
              // First check if user exists or needs to be created
              let user = await DatabaseService.user.findUnique({
                where: { id: profile.id }
              });
              
              // If user doesn't exist, create it
              if (!user) {
                user = await DatabaseService.user.create({
                  data: {
                    id: profile.id,
                    name: profile.global_name || profile.username,
                    email: profile.email || null,
                    image: profile.image_url || `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
                    discord: profile.id
                  }
                });
              }
              
              // Now create or update the Account record
              await DatabaseService.account.upsert({
                where: {
                  provider_providerAccountId: {
                    provider: account.provider,
                    providerAccountId: profile.id
                  }
                },
                update: {
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  refresh_token: account.refresh_token,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state
                },
                create: {
                  id: profile.id,
                  userId: profile.id,
                  type: "oauth",
                  provider: account.provider,
                  providerAccountId: profile.id,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  refresh_token: account.refresh_token,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state
                }
              });
            } catch (error) {
              console.error("Error creating/updating Account record:", error);
            }
          })();
        }
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