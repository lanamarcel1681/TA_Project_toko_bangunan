import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ invoice: string }> }
) {
    try {
        const { invoice } = await params;
        const sessionCookie = request.cookies.get('session');
        
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
        }

        const user = JSON.parse(decodeURIComponent(sessionCookie.value));

        const transaction = await prisma.transaksiPenjualanBarang.findUnique({
            where: { no_transaksi: invoice },
            include: {
                pembeli: true,
                pembayaran: true,
                pengiriman: true,
                detail: {
                    include: {
                        barang: true
                    }
                }
            }
        });

        if (!transaction) {
            return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
        }

        // Security check: ensure the transaction belongs to the user
        if (transaction.id_pembeli !== user.id) {
            return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
        }

        // Format data
        const totalAmount = transaction.detail.reduce((sum, d) => sum + d.total_harga, 0) + transaction.ongkos_kirim;
        const payment = transaction.pembayaran[0];

        // Fetch ulasan for these details
        const detailIds = transaction.detail.map(d => d.id_detailtransaksipenjualan);
        const ulasan = await prisma.ulasanBarang.findMany({
            where: {
                id_detailtransaksipenjualan: { in: detailIds }
            }
        });

        const formatted = {
            id: transaction.id_transaksipenjualan,
            inv: transaction.no_transaksi,
            date: transaction.tanggal_penjualan.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            time: transaction.tanggal_penjualan.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            status: transaction.status_penjualan,
            method: transaction.metode_pengantaran,
            ongkir: transaction.ongkos_kirim,
            total: totalAmount,
            payment: {
                status: payment?.status_pembayaran,
                proof: payment?.foto_bukti_pembayaran || null,
            },
            items: transaction.detail.map(d => {
                const itemUlasan = ulasan.find(u => u.id_detailtransaksipenjualan === d.id_detailtransaksipenjualan);
                return {
                    id: d.id_barang,
                    id_detail: d.id_detailtransaksipenjualan,
                    name: d.barang.nama_barang,
                    image: d.barang.foto_barang,
                    price: d.total_harga / d.jumlah_penjualan_barang,
                    qty: d.jumlah_penjualan_barang,
                    subtotal: d.total_harga,
                    id_ulasan: itemUlasan?.id_ulasan || null
                };
            })
        };

        return NextResponse.json({ success: true, data: formatted });
    } catch (error) {
        console.error("Fetch Transaction Detail Error:", error);
        return NextResponse.json({ error: 'Gagal mengambil detail transaksi' }, { status: 500 });
    }
}
