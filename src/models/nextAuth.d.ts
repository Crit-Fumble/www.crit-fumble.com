import NextAuth from "next-auth"
import {Auth, User as _User, Profile, Campaign, Character} from './cfg';
import { DiscordProfile } from "next-auth/providers/discord"

export interface User extends _User {
  id: string,
  name: string,
  email?: string,
  image?: string,
  token?: string,
  discord?: DiscordProfile,
};

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  
  interface Session {
    expires: ISODateString;
    user?: User;
    darkMode?: boolean;
    profile?: Profile;
    campaigns?: Campaigns[];
    characters?: Character[];
  }
}