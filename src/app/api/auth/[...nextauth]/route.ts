import NextAuth from "next-auth";
import { authHandler } from "@lib/next/controllers/UserController";

export { authHandler as GET, authHandler as POST }