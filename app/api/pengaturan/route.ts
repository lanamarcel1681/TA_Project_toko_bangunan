import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
    try {
        let pengaturan = await prisma.pengaturanToko.findFirst();

        // Jika belum ada data pengaturan, buat default
        if (!pengaturan) {
            pengaturan = await prisma.pengaturanToko.create({
                data: {
                    batas_waktu_pengantaran: '16:00',
                },
            });
        }

        return NextResponse.json({ success: true, data: pengaturan });
    } catch (error) {
        console.error('Error fetching pengaturan:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        
        let pengaturan = await prisma.pengaturanToko.findFirst();

        const updateData: any = {};
        
        if (body.batas_waktu_pengantaran !== undefined) updateData.batas_waktu_pengantaran = body.batas_waktu_pengantaran;
        if (body.metode_cash !== undefined) updateData.metode_cash = body.metode_cash;
        if (body.metode_transfer !== undefined) updateData.metode_transfer = body.metode_transfer;
        if (body.metode_qris !== undefined) updateData.metode_qris = body.metode_qris;
        if (body.foto_qris !== undefined) updateData.foto_qris = body.foto_qris;
        if (body.rekening_bank !== undefined) updateData.rekening_bank = body.rekening_bank;
        if (body.faq !== undefined) updateData.faq = body.faq;

        if (pengaturan) {
            pengaturan = await prisma.pengaturanToko.update({
                where: { id: pengaturan.id },
                data: updateData,
            });
        } else {
            pengaturan = await prisma.pengaturanToko.create({
                data: {
                    batas_waktu_pengantaran: updateData.batas_waktu_pengantaran || '16:00',
                    ...updateData
                },
            });
        }

        return NextResponse.json({ success: true, data: pengaturan });
    } catch (error) {
        console.error('Error updating pengaturan:', error);
        return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
    }
}

