import { apiHandler } from "@/controllers/dnd5e";
import { NextRequest } from "next/server";

export const GET = (req: NextRequest) => apiHandler(req?.nextUrl?.pathname);
export const POST = (req: NextRequest) => apiHandler(req?.nextUrl?.pathname);