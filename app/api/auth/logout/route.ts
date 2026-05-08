import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true, message: 'Logout berhasil' });
    
    // Hapus cookie session dengan mengatur parameter yang sama seperti saat login
    response.cookies.set('session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // maxAge 0 akan kedaluwarsa seketika
        path: '/',
    });
    
    return response;
}
