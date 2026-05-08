import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { hashPassword } from '@/app/utils/hash';

const prisma = new PrismaClient();
const SECRET = process.env.EMAIL_PASS || 'rahasia_toko_bangunan';

export function verifyResetToken(token: string) {
    try {
        const [base64Data, signature] = token.split('.');
        if (!base64Data || !signature) return null;
        
        const expectedSignature = crypto.createHmac('sha256', SECRET).update(base64Data).digest('base64url');
        if (signature !== expectedSignature) return null;
        
        const data = JSON.parse(Buffer.from(base64Data, 'base64url').toString('utf-8'));
        if (data.exp < Date.now()) return null; // Expired
        
        return data.email as string;
    } catch {
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();
        
        if (!token || !password) {
            return NextResponse.json({ error: 'Token dan password wajib diisi' }, { status: 400 });
        }

        const email = verifyResetToken(token);
        if (!email) {
            return NextResponse.json({ error: 'Token tidak valid atau sudah kadaluarsa.' }, { status: 400 });
        }

        const pembeli = await prisma.pembeli.findUnique({
            where: { email_pembeli: email }
        });

        if (!pembeli) {
            return NextResponse.json({ error: 'Pengguna tidak ditemukan.' }, { status: 404 });
        }

        // Simpan password baru
        await prisma.pembeli.update({
            where: { email_pembeli: email },
            data: { password_pembeli: hashPassword(password) }
        });

        const { sendEmail, EmailTemplates } = await import('@/lib/mail');
        
        await sendEmail(
            email,
            'Password Berhasil Diubah',
            EmailTemplates.passwordResetSuccess(pembeli.nama_pembeli)
        );

        return NextResponse.json({ success: true, message: 'Password berhasil diubah.' });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
    }
}
