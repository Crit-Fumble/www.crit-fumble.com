import { fiveEToolsDataApiHandler } from "@/controllers/dnd5e";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const response = await fiveEToolsDataApiHandler(req?.nextUrl?.pathname);

  return NextResponse.json(response);
};
export const POST = async (req: NextRequest) => {
  const response = await fiveEToolsDataApiHandler(req?.nextUrl?.pathname);

  return NextResponse.json(response);
};