import { srdApiHandler } from "@/controllers/Dnd5eController";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {
  const response = await srdApiHandler(req?.nextUrl?.pathname);

  NextResponse.json(response);
};
export const POST = async (req: NextRequest) => {
  const response = await srdApiHandler(req?.nextUrl?.pathname);

  NextResponse.json(response);
};