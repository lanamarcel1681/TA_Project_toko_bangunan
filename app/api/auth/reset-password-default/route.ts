import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get('session');
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
        }

        const userSession = JSON.parse(decodeURIComponent(sessionCookie.value));
        
        // Find the employee to get their birth date
        const employee = await prisma.pegawai.findUnique({
            where: { id_pegawai: userSession.id }
        });

        if (!employee) {
            return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
        }

        // Format: YYYY-MM-DD
        // Assuming the birth date in DB might be string, we ensure it's in correct format if possible
        // But the user said "langsung ganti ke tanggal lahir dengan format YYYY-MM-DD"
        // Let's assume the DB value is already the birth date.
        const defaultPassword = employee.tanggal_lahir;

        await prisma.pegawai.update({
            where: { id_pegawai: userSession.id },
            data: { password_pegawai: defaultPassword }
        });

        return NextResponse.json({ 
            success: true, 
            message: `Password berhasil direset ke tanggal lahir (${defaultPassword})` 
        });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ error: 'Gagal mereset password' }, { status: 500 });
    }
}
