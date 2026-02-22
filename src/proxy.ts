import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

const publicUrls = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const { pathname } = request.nextUrl;

    if (!session && !publicUrls.includes(pathname)) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (session && publicUrls.includes(pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (session && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
