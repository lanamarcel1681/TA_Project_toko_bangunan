import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendOtpEmail } from '@/app/utils/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, name } = body;

        if (!email || !name) {
            return NextResponse.json({ error: 'Nama dan Email wajib diisi' }, { status: 400 });
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

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save or update OTP in database
        await prisma.otpVerification.upsert({
            where: { email },
            update: {
                otp,
                expiresAt,
                createdAt: new Date(),
            },
            create: {
                email,
                otp,
                expiresAt,
            },
        });

        // Send OTP via email
        const emailResult = await sendOtpEmail(email, otp);

        if (!emailResult.success) {
            return NextResponse.json({ error: emailResult.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'OTP berhasil dikirim ke email Anda' });

    } catch (error) {
        console.error("Send OTP Error: ", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server saat mengirim OTP' }, { status: 500 });
    }
}
