import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const jabatans = await prisma.jabatan.findMany();
        return NextResponse.json(jabatans);
    } catch (error) {
        return NextResponse.json({ error: 'Gagal memanggil data jabatan' }, { status: 500 });
    }
}
