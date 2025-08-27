import NextAuth from "next-auth";
import { authHandler } from "@cfg/next/controllers/UserController";

export { authHandler as GET, authHandler as POST }