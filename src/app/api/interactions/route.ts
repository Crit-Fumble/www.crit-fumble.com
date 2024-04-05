// import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
// import authConfig from "@/config/auth"

export async function GET(request: NextRequest) {
    // const session = await getServerSession(request, new Response('Nope'), authConfig);

    return new Response('API is Live!');
  }
  
// TODO: Put Discord Interactions here, then configure it in the Discord Developer Portal
// https://www.crit-fumble.com/api/interactions
// https://discord.com/developers/applications/1223681019178123274/information