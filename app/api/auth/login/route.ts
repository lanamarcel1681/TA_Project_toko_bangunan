import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyPassword } from '@/app/utils/hash';
import { encrypt } from '@/app/utils/session';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email.toLowerCase().endsWith('@gmail.com')) {
            return NextResponse.json({ error: 'Gagal! Hanya email @gmail.com yang diizinkan.' }, { status: 400 });
        }
        const pegawai = await prisma.pegawai.findUnique({
            where: { email_pegawai: email },
            include: { jabatan: true }
        });

        if (pegawai) {
            if (pegawai.status_pegawai !== 'Aktif') {
                return NextResponse.json({ error: 'Akun Anda dinonaktifkan. Silakan hubungi Owner.' }, { status: 403 });
            }

            if (verifyPassword(password, pegawai.password_pegawai)) {
                let role = 'karyawan';
                if (pegawai.id_jabatan === 1 || pegawai.jabatan.nama_jabatan.toLowerCase().includes('pemilik')) {
                    role = 'owner';
                }

                const user = {
                    id: pegawai.id_pegawai,
                    name: pegawai.nama_pegawai,
                    email: pegawai.email_pegawai,
                    role: role,
                };

                const session = await encrypt(user);

                const response = NextResponse.json({ success: true, role: user.role });

                response.cookies.set('session', session, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 8,
                    path: '/',
                });

                return response;
            }
        }
        const pembeli = await prisma.pembeli.findUnique({
            where: { email_pembeli: email }
        });

        if (pembeli) {
            if (verifyPassword(password, pembeli.password_pembeli)) {
                const user = {
                    id: pembeli.id_pembeli,
                    name: pembeli.nama_pembeli,
                    email: pembeli.email_pembeli,
                    role: 'customer'
                };

                const session = await encrypt(user);

                const response = NextResponse.json({ success: true, role: user.role });

                response.cookies.set('session', session, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 8,
                    path: '/',
                });

                return response;
            }
        }
        return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });

    } catch (error) {
        console.error("Login Error: ", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
    }
}
