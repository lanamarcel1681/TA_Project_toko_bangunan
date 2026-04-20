import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookie = req.headers.get('cookie')?.split('; ').find(r => r.startsWith('session='));
        if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
        const role = session.role?.toLowerCase();

        if (role !== 'owner') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const id_izin = parseInt(id);
        const { status } = await req.json();

        if (!['Disetujui', 'Ditolak'].includes(status)) {
            return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
        }

        const updatedIzin = await prisma.pengajuanIzin.update({
            where: { id_izin: id_izin },
            data: { status_izin: status }
        });

        return NextResponse.json({ message: `Izin telah ${status}`, data: updatedIzin });
    } catch (error) {
        console.error('Izin PATCH Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
