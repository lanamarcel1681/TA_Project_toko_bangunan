import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/app/utils/hash';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, otp } = body;

        if (!name || !email || !password || !otp) {
            return NextResponse.json({ error: 'Nama, Email, Password, dan OTP wajib diisi' }, { status: 400 });
        }

        if (!email.toLowerCase().endsWith('@gmail.com')) {
            return NextResponse.json({ error: 'Gagal! Hanya email @gmail.com yang diizinkan.' }, { status: 400 });
        }

        const existingPembeli = await prisma.pembeli.findUnique({
            where: { email_pembeli: email },
        });

        const existingPegawai = await prisma.pegawai.findUnique({
            where: { email_pegawai: email },
        });

        if (existingPembeli || existingPegawai) {
            return NextResponse.json({ error: 'Email sudah terdaftar. Gunakan email lain.' }, { status: 400 });
        }

        const otpRecord = await prisma.otpVerification.findUnique({
            where: { email },
        });

        if (!otpRecord || otpRecord.otp !== otp) {
            return NextResponse.json({ error: 'Kode OTP tidak valid' }, { status: 400 });
        }

        if (otpRecord.expiresAt < new Date()) {
            return NextResponse.json({ error: 'Kode OTP sudah kedaluwarsa' }, { status: 400 });
        }


        const newPembeli = await prisma.pembeli.create({
            data: {
                nama_pembeli: name,
                email_pembeli: email,
                password_pembeli: hashPassword(password),
                nomor_telepon_pembeli: '-',
                tanggal_lahir_pembeli: '-',
            }
        });

        await prisma.otpVerification.delete({
            where: { email },
        });

        return NextResponse.json({ success: true, message: 'Registrasi berhasil' });

    } catch (error) {
        console.error("Register Error: ", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server saat pendaftaran' }, { status: 500 });
    }
}
