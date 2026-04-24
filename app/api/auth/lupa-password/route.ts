import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();
const SECRET = process.env.EMAIL_PASS || 'rahasia_toko_bangunan';

export function generateResetToken(email: string) {
    const data = { email, exp: Date.now() + 15 * 60 * 1000 }; // 15 menit
    const base64Data = Buffer.from(JSON.stringify(data)).toString('base64url');
    const signature = crypto.createHmac('sha256', SECRET).update(base64Data).digest('base64url');
    return `${base64Data}.${signature}`;
}

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        if (!email) {
            return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 });
        }

        const pembeli = await prisma.pembeli.findUnique({
            where: { email_pembeli: email }
        });

        if (!pembeli) {
            // Untuk alasan keamanan, sebaiknya kita tetap bilang berhasil, atau bisa juga kasih tau error
            return NextResponse.json({ error: 'Email tidak ditemukan di sistem kami.' }, { status: 404 });
        }

        const token = generateResetToken(email);
        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const resetLink = `${baseUrl}/reset-password?token=${token}`;

        const { sendEmail, EmailTemplates } = await import('@/lib/mail');
        
        const emailSent = await sendEmail(
            email,
            'Permintaan Reset Password',
            EmailTemplates.passwordResetRequest(pembeli.nama_pembeli, resetLink)
        );

        if (!emailSent) {
            return NextResponse.json({ error: 'Gagal mengirim email reset password.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Link reset password telah dikirim ke email.' });
    } catch (error) {
        console.error("Lupa Password Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
    }
}
