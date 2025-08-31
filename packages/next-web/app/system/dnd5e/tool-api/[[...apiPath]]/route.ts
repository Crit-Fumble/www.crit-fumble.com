import { fiveEToolsDataApiHandler } from "@crit-fumble/next/controllers/GameSystem/Dnd5e/Dnd5eController";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const response = await fiveEToolsDataApiHandler(req?.nextUrl?.pathname);

  return NextResponse.json(response);
};
export const POST = async (req: NextRequest) => {
  const response = await fiveEToolsDataApiHandler(req?.nextUrl?.pathname);

  return NextResponse.json(response);
};