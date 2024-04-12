import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import authConfig from "@/config/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return new Response('No Soup for You!', { status: 401 });
  }

  return new Response('API is Live!');
}
