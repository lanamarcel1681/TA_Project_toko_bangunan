import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/app/utils/session';

const prisma = new PrismaClient();

const isInsideDIY = (kab: string) => {
    if (!kab || kab === '-') return false;
    const k = kab.toLowerCase();
    return k.includes('sleman') || k.includes('bantul') || k.includes('gunungkidul') || k.includes('kulon progo') || k.includes('yogyakarta') || k.includes('kota');
};

export async function GET(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    try {
        const userSession = await decrypt(sessionCookie.value);
        if (!userSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (userSession.role !== 'customer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const addresses = await prisma.alamat.findMany({
            where: { id_pembeli: userSession.id },
            orderBy: { id_alamat: 'desc' } // Newest first
        });

        const formatted = addresses.map(addr => ({
            id: addr.id_alamat,
            label_alamat: addr.label_alamat,
            nama_jalan: addr.nama_jalan,
            kabupaten: addr.kabupaten,
            kecamatan: addr.kecamatan,
            kelurahan: addr.kelurahan,
            kode_pos: addr.kode_pos,
            deskripsi_alamat: addr.deskripsi_alamat,
            isMain: addr.status_default === 'true',
            name: userSession.name || 'Pengguna',
            phone: '-',
            fullAddress: `${addr.nama_jalan}, Kel. ${addr.kelurahan}, Kec. ${addr.kecamatan}, Kab/Kota. ${addr.kabupaten}, ${addr.kode_pos}`
        }));

        return NextResponse.json({ data: formatted });
    } catch (e) {
        console.error("GET Alamat Error:", e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    try {
        const userSession = await decrypt(sessionCookie.value);
        if (!userSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const body = await request.json();

        if (!isInsideDIY(body.kabupaten)) {
            return NextResponse.json({ error: 'Alamat harus berada di area Daerah Istimewa Yogyakarta (Sleman, Bantul, Gunungkidul, Kulon Progo, Kota Yogyakarta).' }, { status: 400 });
        }

        // Set all existing to false if this one is main
        if (body.status_default) {
            await prisma.alamat.updateMany({
                where: { id_pembeli: userSession.id },
                data: { status_default: 'false' }
            });
        }

        const newAlamat = await prisma.alamat.create({
            data: {
                id_pembeli: userSession.id,
                nama_jalan: body.nama_jalan || '-',
                kabupaten: body.kabupaten || '-',
                kecamatan: body.kecamatan || '-',
                kelurahan: body.kelurahan || '-',
                kode_pos: body.kode_pos || '-',
                deskripsi_alamat: body.deskripsi_alamat || '-',
                label_alamat: body.label_alamat || 'Rumah',
                status_default: body.status_default ? 'true' : 'false'
            }
        });

        return NextResponse.json({ success: true, data: newAlamat });
    } catch (e) {
        console.error("POST Alamat Error:", e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    try {
        const userSession = await decrypt(sessionCookie.value);
        if (!userSession) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const body = await request.json();

        if (body.action === 'setMain') {
            // Unset all first
            await prisma.alamat.updateMany({
                where: { id_pembeli: userSession.id },
                data: { status_default: 'false' }
            });
            // Target
            await prisma.alamat.update({
                where: { id_alamat: body.id },
                data: { status_default: 'true' }
            });
            return NextResponse.json({ success: true, message: 'Alamat utama diubah' });
        } else if (body.action === 'update') {
            if (!isInsideDIY(body.kabupaten)) {
                return NextResponse.json({ error: 'Alamat harus berada di area Daerah Istimewa Yogyakarta (Sleman, Bantul, Gunungkidul, Kulon Progo, Kota Yogyakarta).' }, { status: 400 });
            }

            if (body.status_default) {
                await prisma.alamat.updateMany({
                    where: { id_pembeli: userSession.id },
                    data: { status_default: 'false' }
                });
            }
            await prisma.alamat.update({
                where: { id_alamat: body.id },
                data: {
                    nama_jalan: body.nama_jalan,
                    kabupaten: body.kabupaten,
                    kecamatan: body.kecamatan,
                    kelurahan: body.kelurahan,
                    kode_pos: body.kode_pos,
                    deskripsi_alamat: body.deskripsi_alamat,
                    label_alamat: body.label_alamat,
                    status_default: body.status_default ? 'true' : 'false'
                }
            });
            return NextResponse.json({ success: true, message: 'Alamat diperbarui' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (e) {
        console.error("PUT Alamat Error:", e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    try {
        const body = await request.json();
        await prisma.alamat.delete({
            where: { id_alamat: body.id }
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("DELETE Alamat Error:", e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
