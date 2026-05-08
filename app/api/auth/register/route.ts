import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/app/utils/hash';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Validasi kelengkapan data
        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Nama, Email, dan Password wajib diisi' }, { status: 400 });
        }

        if (!email.toLowerCase().endsWith('@gmail.com')) {
            return NextResponse.json({ error: 'Gagal! Hanya email @gmail.com yang diizinkan.' }, { status: 400 });
        }

        // Cek apakah email sudah terdaftar di pembeli
        const existingPembeli = await prisma.pembeli.findUnique({
            where: { email_pembeli: email },
        });

        // Cek juga di tabel Pegawai agar email unik di semua role
        const existingPegawai = await prisma.pegawai.findUnique({
            where: { email_pegawai: email },
        });

        if (existingPembeli || existingPegawai) {
            return NextResponse.json({ error: 'Email sudah terdaftar. Gunakan email lain.' }, { status: 400 });
        }

        // Insert ke database untuk Pembeli
        const newPembeli = await prisma.pembeli.create({
            data: {
                nama_pembeli: name,
                email_pembeli: email,
                password_pembeli: hashPassword(password),
                nomor_telepon_pembeli: '-',
                tanggal_lahir_pembeli: '-',
            }
        });

        // Hilangkan auto-login, kembalikan response sukses sederhana 
        return NextResponse.json({ success: true, message: 'Registrasi berhasil' });

    } catch (error) {
        console.error("Register Error: ", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server saat pendaftaran' }, { status: 500 });
    }
}
