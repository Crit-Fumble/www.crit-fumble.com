"use server";

import NextAuth, { getServerSession as _getServerSession } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { discord } from "@/services/config";
import { handler as _handler } from '@/services/auth';

const config = { 
    providers: [ 
        DiscordProvider({
          clientId: discord.authId,
          clientSecret: discord.authSecret,
        }),
    ],
  callbacks: {
    session({ session, token, user } : any) {
      return Promise.resolve(session); // The return type will match the one returned in `useSession()`
    },
    jwt({ token, trigger, session } : any) {
      if (trigger === "update" && session?.name) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.name = session.name
      }
      return Promise.resolve(token);
    },
  },
};

export const handler = NextAuth(config);
export const getServerSession = () => _getServerSession(config);