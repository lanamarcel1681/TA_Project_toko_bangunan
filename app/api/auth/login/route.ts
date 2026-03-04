import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    const user = verifyCredentials(email, password);

    if (!user) {
        return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, role: user.role });

    response.cookies.set('session', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
    });

    return response;
}
