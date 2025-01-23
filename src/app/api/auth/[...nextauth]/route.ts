import NextAuth from "next-auth";
import { authHandler } from "@/controllers/UserController";

export { authHandler as GET, authHandler as POST }