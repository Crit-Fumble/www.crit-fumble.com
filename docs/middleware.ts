import { getServerSession } from 'next-auth';
import { NextResponse, type NextRequest } from 'next/server';
import authConfig from "@/config/auth";
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // const session = await getServerSession(authConfig);
    // if (!session) {
    //     // return new Response('No Soup for You!', { status: 401 });
    //     return NextResponse.redirect(new URL('/', request.url))
    // }
    // TODO: the thing
}
 
// https://nextjs.org/docs/pages/building-your-application/routing/middleware#matching-paths
