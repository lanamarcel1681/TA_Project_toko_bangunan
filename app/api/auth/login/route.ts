import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // 1. Cek di tabel Pegawai (Untuk Owner / Karyawan)
        const pegawai = await prisma.pegawai.findUnique({
            where: { email_pegawai: email },
            include: { jabatan: true }
        });

        if (pegawai) {
            if (pegawai.password_pegawai === password) {
                // Tentukan role berdasarkan id_jabatan, nama jabatan, atau konvensi (1=Owner, 2=Karyawan)
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

                const response = NextResponse.json({ success: true, role: user.role });

                response.cookies.set('session', JSON.stringify(user), {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 8, // 8 jam
                    path: '/',
                });

                return response;
            }
        }

        // 2. Cek di tabel Pembeli (Untuk Pelanggan biasa)
        const pembeli = await prisma.pembeli.findUnique({
            where: { email_pembeli: email }
        });

        if (pembeli) {
            if (pembeli.password_pembeli === password) {
                const user = {
                    id: pembeli.id_pembeli,
                    name: pembeli.nama_pembeli,
                    email: pembeli.email_pembeli,
                    role: 'customer'
                };

                const response = NextResponse.json({ success: true, role: user.role });

                response.cookies.set('session', JSON.stringify(user), {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 8,
                    path: '/',
                });

                return response;
            }
        }

        // 3. Jika tidak ketemu di keduanya atau password salah
        return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });

    } catch (error) {
        console.error("Login Error: ", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
    }
}
