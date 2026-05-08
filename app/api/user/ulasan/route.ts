import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/app/utils/session';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get('session');
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
        }

        const user = await decrypt(sessionCookie.value);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (user.role !== 'customer') {
            return NextResponse.json({ error: 'Hanya pembeli yang dapat memberikan ulasan' }, { status: 403 });
        }

        const body = await request.json();
        const { id_detail, rating, komentar, foto_ulasan } = body;

        if (!id_detail) {
            return NextResponse.json({ error: 'Item tidak valid' }, { status: 400 });
        }

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating wajib diisi (1-5)' }, { status: 400 });
        }

        // Check if detail exists and belongs to the user
        const detail = await prisma.detailTransaksiPenjualanBarang.findUnique({
            where: { id_detailtransaksipenjualan: parseInt(id_detail) },
            include: { transaksi: true }
        });

        if (!detail) {
            return NextResponse.json({ error: 'Data transaksi tidak ditemukan' }, { status: 404 });
        }

        if (detail.transaksi.id_pembeli !== user.id) {
            return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
        }

        if (detail.transaksi.status_penjualan !== 'Selesai') {
            return NextResponse.json({ error: 'Hanya pesanan yang sudah selesai yang dapat diulas' }, { status: 400 });
        }

        // Check if already reviewed
        const existingReview = await prisma.ulasanBarang.findFirst({
            where: { id_detailtransaksipenjualan: parseInt(id_detail) }
        });

        if (existingReview) {
            return NextResponse.json({ error: 'Anda sudah memberikan ulasan untuk produk ini' }, { status: 400 });
        }

        // Create review
        const review = await prisma.ulasanBarang.create({
            data: {
                id_detailtransaksipenjualan: parseInt(id_detail),
                id_pembeli: user.id,
                id_barang: detail.id_barang,
                rating: parseInt(rating),
                komentar: komentar || '',
                foto_ulasan: foto_ulasan || null,
                tanggal_ulasan: new Date()
            }
        });

        return NextResponse.json({ success: true, data: review });

    } catch (error) {
        console.error("Submit Review Error:", error);
        return NextResponse.json({ error: 'Gagal mengirim ulasan' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id_detail = searchParams.get('id_detail');

        if (!id_detail) {
            return NextResponse.json({ error: 'ID Detail tidak disertakan' }, { status: 400 });
        }

        const detail = await prisma.detailTransaksiPenjualanBarang.findUnique({
            where: { id_detailtransaksipenjualan: parseInt(id_detail) },
            include: {
                barang: true,
                transaksi: {
                    select: {
                        tanggal_penjualan: true,
                        status_penjualan: true
                    }
                }
            }
        });

        if (!detail) {
            return NextResponse.json({ error: 'Item tidak ditemukan' }, { status: 404 });
        }

        const review = await prisma.ulasanBarang.findFirst({
            where: { id_detailtransaksipenjualan: parseInt(id_detail) }
        });

        return NextResponse.json({ 
            success: true, 
            data: {
                product: {
                    id: detail.id_barang,
                    name: detail.barang.nama_barang,
                    image: detail.barang.foto_barang,
                    category: detail.barang.id_kategori_barang // Or fetch category name
                },
                transaction: {
                    date: detail.transaksi.tanggal_penjualan,
                    status: detail.transaksi.status_penjualan
                },
                review: review || null
            } 
        });
    } catch (error) {
        console.error("Fetch Review Data Error:", error);
        return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
    }
}
