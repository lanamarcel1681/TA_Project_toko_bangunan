import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/app/utils/session';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const cookie = req.headers.get('cookie')?.split('; ').find(r => r.startsWith('session='));
        if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = await decrypt(cookie.split('=')[1]);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const role = session.role?.toLowerCase();

        if (role !== 'owner') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const allIzin = await prisma.pengajuanIzin.findMany({
            include: {
                pegawai: {
                    select: { nama_pegawai: true }
                }
            },
            orderBy: { tanggal_mulai: 'desc' }
        });

        return NextResponse.json(allIzin);
    } catch (error) {
        console.error('Izin GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const cookie = req.headers.get('cookie')?.split('; ').find(r => r.startsWith('session='));
        if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = await decrypt(cookie.split('=')[1]);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const id_pegawai = session.id;

        const body = await req.json();
        const { tanggal_mulai, tanggal_selesai, jenis_izin, keterangan } = body;

        if (!tanggal_mulai || !tanggal_selesai || !jenis_izin || !keterangan) {
            return NextResponse.json({ error: 'Semua field harus diisi!' }, { status: 400 });
        }

        const newIzin = await prisma.pengajuanIzin.create({
            data: {
                id_pegawai: id_pegawai,
                tanggal_mulai: new Date(tanggal_mulai),
                tanggal_selesai: new Date(tanggal_selesai),
                jenis_izin: jenis_izin,
                keterangan: keterangan,
                status_izin: 'Pending'
            }
        });

        return NextResponse.json({ message: 'Pengajuan izin berhasil dikirim', data: newIzin });
    } catch (error) {
        console.error('Izin POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
