import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session');
    const { pathname } = request.nextUrl;

    // Protect /dashboard routes
    if (pathname.startsWith('/dashboard')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const user = JSON.parse(session.value);
            // Protect owner-only routes
            if (pathname.startsWith('/dashboard/owner') && user.role !== 'owner') {
                return NextResponse.redirect(new URL(user.role === 'karyawan' ? '/dashboard/karyawan' : '/', request.url));
            }
            // Protect employee routes
            if (pathname.startsWith('/dashboard/karyawan') && user.role !== 'karyawan') {
                return NextResponse.redirect(new URL(user.role === 'owner' ? '/dashboard/owner' : '/', request.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Already logged in: redirect away from login page
    if (pathname === '/login' && session) {
        try {
            const user = JSON.parse(session.value);
            const dest = user.role === 'owner' ? '/dashboard/owner' : user.role === 'karyawan' ? '/dashboard/karyawan' : '/';
            return NextResponse.redirect(new URL(dest, request.url));
        } catch {
            // bad cookie, let through
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
