import { getServerSession } from "@/controllers/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return new Response('No Soup for You!', { status: 401 });
  }

  return new Response('API is Live!');
}
