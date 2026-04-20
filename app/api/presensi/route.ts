import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Utility for Indonesia-specific today's date (YYYY-MM-DD)
function getTodayString() {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}

export async function GET(req: Request) {
    try {
        const cookie = req.headers.get('cookie')?.split('; ').find(r => r.startsWith('session='));
        if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
        const id_pegawai = session.id;
        const role = session.role?.toLowerCase();

        const todayStr = getTodayString();
        const startOfDay = new Date(`${todayStr}T00:00:00.000Z`);
        const endOfDay = new Date(`${todayStr}T23:59:59.999Z`);

        if (role === 'owner') {
            const allPresensi = await prisma.presensiPegawai.findMany({
                where: { 
                    tanggal: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                },
                include: {
                    pegawai: {
                        select: { nama_pegawai: true }
                    }
                }
            });
            return NextResponse.json(allPresensi);
        }

        const presensi = await prisma.presensiPegawai.findFirst({
            where: {
                id_pegawai: id_pegawai,
                tanggal: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        // NEW: Check for approved leave
        const leave = await prisma.pengajuanIzin.findFirst({
            where: {
                id_pegawai: id_pegawai,
                status_izin: 'Disetujui',
                tanggal_mulai: { lte: endOfDay },
                tanggal_selesai: { gte: startOfDay }
            }
        });

        return NextResponse.json({
            ...presensi,
            onLeave: !!leave,
            leaveInfo: leave ? { jenis: leave.jenis_izin, ket: leave.keterangan } : null
        });
    } catch (error) {
        console.error('Presensi GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const cookie = req.headers.get('cookie')?.split('; ').find(r => r.startsWith('session='));
        if (!cookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const session = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
        const id_pegawai = session.id;

        const todayStr = getTodayString();
        const startOfDay = new Date(`${todayStr}T00:00:00.000Z`);
        const endOfDay = new Date(`${todayStr}T23:59:59.999Z`);
        const now = new Date();

        // NEW: Reject if on approved leave
        const leave = await prisma.pengajuanIzin.findFirst({
            where: {
                id_pegawai: id_pegawai,
                status_izin: 'Disetujui',
                tanggal_mulai: { lte: endOfDay },
                tanggal_selesai: { gte: startOfDay }
            }
        });

        if (leave) {
            return NextResponse.json({ error: 'Anda tidak dapat melakukan presensi karena sedang dalam masa izin/cuti yang telah disetujui.' }, { status: 403 });
        }

        console.log(`[ABSEN] Request from ID: ${id_pegawai} for Date: ${todayStr}`);

        const existing = await prisma.presensiPegawai.findFirst({
            where: {
                id_pegawai: id_pegawai,
                tanggal: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        if (!existing) {
            // Check-in
            const newRecord = await prisma.presensiPegawai.create({
                data: {
                    id_pegawai: id_pegawai,
                    tanggal: startOfDay,
                    waktu_masuk: now,
                }
            });
            return NextResponse.json({ message: 'Check-in Berhasil', data: newRecord });
        } else if (!existing.waktu_keluar) {
            // Check-out
            const updated = await prisma.presensiPegawai.update({
                where: { id_presensi: existing.id_presensi },
                data: { waktu_keluar: now }
            });
            return NextResponse.json({ message: 'Check-out Berhasil', data: updated });
        } else {
            return NextResponse.json({ error: 'Anda sudah menyelesaikan presensi untuk hari ini.' }, { status: 400 });
        }
    } catch (error) {
        console.error('Presensi POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
