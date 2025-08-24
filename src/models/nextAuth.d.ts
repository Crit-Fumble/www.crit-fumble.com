import NextAuth from "next-auth"
import { User } from './cfg'
import { DiscordProfile } from "next-auth/providers/discord"

// NextAuth specific user type extending our base User type
interface NextAuthUser extends User {
  token?: string;
  discord?: DiscordProfile;
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  
  interface Session {
    expires: ISODateString;
    user?: NextAuthUser;
    darkMode?: boolean;
  }
}