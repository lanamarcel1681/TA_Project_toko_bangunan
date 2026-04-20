import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const userSession = JSON.parse(sessionCookie.value);

        if (userSession.role === 'customer') {
            const userData = await prisma.pembeli.findUnique({
                where: { id_pembeli: userSession.id }
            });
            if (userData) {
                return NextResponse.json({
                    name: userData.nama_pembeli,
                    email: userData.email_pembeli,
                    phone: userData.nomor_telepon_pembeli,
                    birthdate: userData.tanggal_lahir_pembeli,
                    avatar: userData.foto_profil,
                });
            }
        } else {
            const userData = await prisma.pegawai.findUnique({
                where: { id_pegawai: userSession.id },
                include: { jabatan: true }
            });
            if (userData) {
                return NextResponse.json({
                    name: userData.nama_pegawai,
                    email: userData.email_pegawai,
                    phone: userData.nomor_telepon,
                    birthdate: userData.tanggal_lahir,
                    avatar: userData.foto_profil,
                    jabatan: userData.jabatan?.nama_jabatan || 'Pegawai',
                });
            }
        }

        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    } catch (e) {
        console.error('Profile API Error:', e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const userSession = JSON.parse(sessionCookie.value);
        const body = await request.json();
        
        const phone = body.phone || '-';
        const birthdate = body.birthdate || '-';
        const name = body.name;
        const avatar = body.avatar || undefined;

        if (!name) return NextResponse.json({ error: 'Nama tidak boleh kosong' }, { status: 400 });

        if (userSession.role === 'customer') {
            await prisma.pembeli.update({
                where: { id_pembeli: userSession.id },
                data: {
                    nama_pembeli: name,
                    nomor_telepon_pembeli: phone,
                    tanggal_lahir_pembeli: birthdate,
                    ...(avatar !== undefined && { foto_profil: avatar })
                }
            });
        } else {
            await prisma.pegawai.update({
                where: { id_pegawai: userSession.id },
                data: {
                    nama_pegawai: name,
                    nomor_telepon: phone,
                    tanggal_lahir: birthdate,
                    ...(avatar !== undefined && { foto_profil: avatar })
                }
            });
        }

        const updatedSession = { ...userSession, name: name };
        const response = NextResponse.json({ success: true, message: 'Updated' });
        response.cookies.set('session', JSON.stringify(updatedSession), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 8,
            path: '/',
        });

        return response;
    } catch (e) {
        console.error('Profile Update Error:', e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
