"use server";

import NextAuth, { getServerSession as _getServerSession } from "next-auth";
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord";
import { discord } from "@/services/config";
import { getUserByDiscordId } from "./ProfileService";
import { getCharactersByPlayerId } from "./CharacterService";
import { getPartiesByPlayerId } from "./PartyService";
import { getCampaignsByPlayerId } from "./CampaignService";
// import { getUserByDiscordName } from "./UserService";

const config = { 
  providers: [ 
      DiscordProvider({
        clientId: discord.authId,
        clientSecret: discord.authSecret,
      }),
  ],
  callbacks: {
    async session({ session, token } : any) {
      // The return type will match the one returned in `useSession()`
      // add profile data here
      session.user = {
        ...session.user,
        id: token?.providerAccountId,
        provider: token?.provider,
        token: token?.providerToken,
      };

      if (token?.provider === 'discord') {
        session.user.discordProfile = token?.discordProfile;
        session.profile = await getUserByDiscordId(token?.providerAccountId);
        console.log(`session 1`, session);

        if (!`${session?.profile?.id}`) {
          return Promise.resolve(session);
        }
      }

      if (session?.profile?.id) {
        session.characters = await getCharactersByPlayerId(session.profile?.id);
        session.parties = await getPartiesByPlayerId(session.profile?.id);
        session.campaigns = await getCampaignsByPlayerId(session.profile?.id);
        // session.campaigns = await getCampaignsByGmId(session?.profile?.id);
        // session.parties = await getPartiesByCampaignId('3');
        // session.parties = await getPartiesByCampaignId(token?.providerAccountId);
        console.log(`session 2`, session);
        return Promise.resolve(session);
      }

      // TODO: get Profile
      // session.profile = 

      return Promise.resolve(session);
    },
    jwt({ token, profile, account, trigger, session } : any) {
      if (trigger === "update" && session?.name) {
        token.providerUserName = session?.name
        token.providerImage = session?.image;
      }

      if (profile) {
        token.provider = account?.provider;
        token.providerToken = account?.access_token;
      }

      if (account?.provider === 'discord') {
        token.providerAccountId = profile?.id;
        token.discordProfile = (profile as DiscordProfile);
      }

      return Promise.resolve(token);
    },
  },
};

export const handler = NextAuth(config);
export const getServerSession: (typeof _getServerSession) = () => _getServerSession(config);