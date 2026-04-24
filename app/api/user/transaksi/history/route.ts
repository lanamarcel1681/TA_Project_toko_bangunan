import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculateShippingEstimation } from '@/lib/delivery';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get('session');
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
        }

        const user = JSON.parse(decodeURIComponent(sessionCookie.value));
        if (user.role !== 'customer') {
            return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 403 });
        }

        const transactions = await prisma.transaksiPenjualanBarang.findMany({
            where: {
                id_pembeli: user.id
            },
            include: {
                pembayaran: true,
                detail: {
                    include: {
                        barang: true
                    }
                },
                pengiriman: true,
                pembatalan: true,
                retur: true
            },
            orderBy: {
                tanggal_penjualan: 'desc'
            }
        });

        // Format data for frontend
        const formatted = transactions.map(t => {
            const firstItem = t.detail[0];
            const otherItemsCount = t.detail.length - 1;
            const totalAmount = t.detail.reduce((sum, d) => sum + d.total_harga, 0) + t.ongkos_kirim;
            const payment = t.pembayaran[0];

            let estimasi = null;
            let eta = null;

            if (t.status_penjualan === 'Sedang Dikirim' && t.pengiriman.length > 0) {
                const est = calculateShippingEstimation(t.pengiriman[0].alamat_tujuan || "", t.pengiriman[0].tanggal_berangkat);
                estimasi = `± ${est.duration}`;
                eta = est.eta;
            }

            return {
                id: t.id_transaksipenjualan,
                inv: t.no_transaksi,
                date: t.tanggal_penjualan.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                status_penjualan: t.status_penjualan,
                status_pembayaran: payment?.status_pembayaran,
                main_product: firstItem?.barang.nama_barang || 'Produk Tidak Diketahui',
                main_product_image: firstItem?.barang.foto_barang || null,
                id_detail: firstItem?.id_detailtransaksipenjualan,
                qty: firstItem?.jumlah_penjualan_barang || 0,
                other_count: otherItemsCount,
                total: totalAmount,
                metode_pengantaran: t.metode_pengantaran,
                estimasi: estimasi,
                eta: eta,
                bukti_refund: t.pembatalan?.bukti_refund || t.retur?.bukti_refund || null
            };
        });

        return NextResponse.json({ success: true, data: formatted });
    } catch (error) {
        console.error("Fetch History Error:", error);
        return NextResponse.json({ error: 'Gagal mengambil riwayat transaksi' }, { status: 500 });
    }
}
