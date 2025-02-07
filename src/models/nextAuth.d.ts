import NextAuth from "next-auth"
import {Auth, User, Profile, Campaign, Character} from './cfg';
import { DiscordProfile } from "next-auth/providers/discord"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface Session {
    expires: ISODateString;
    darkMode?: boolean;
    profile?: Profile;
    user?: User;
    campaigns?: Campaigns[];
    characters?: Character[];
  }
}