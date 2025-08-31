import NextAuth, { DefaultSession } from "next-auth"

// Extend the built-in session types
declare module "next-auth" {
  /**
   * Extend the built-in session user type
   */
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      admin?: boolean
    } & DefaultSession["user"]
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    admin?: boolean
  }
}

// Extend the built-in JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name?: string | null
    email?: string | null
    picture?: string | null
    sub?: string
    admin?: boolean
  }
}
