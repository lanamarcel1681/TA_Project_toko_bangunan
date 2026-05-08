import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/utils/session';

export async function GET(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
        return NextResponse.json(null);
    }

    const sessionData = await decrypt(sessionCookie.value);
    
    if (!sessionData) {
        return NextResponse.json(null);
    }

    return NextResponse.json(sessionData);
}
