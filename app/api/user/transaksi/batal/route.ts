import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get('session');
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
        }

        const user = JSON.parse(decodeURIComponent(sessionCookie.value));
        const { orderId, reason } = await request.json();

        if (!orderId || !reason) {
            return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
        }

        const transaction = await prisma.transaksiPenjualanBarang.findUnique({
            where: { id_transaksipenjualan: orderId },
            include: { detail: true }
        });

        if (!transaction || transaction.id_pembeli !== user.id) {
            return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
        }

        // Only allow cancellation for specific statuses
        const allowedStatuses = ['Menunggu Verifikasi Pembayaran', 'Diverifikasi (Lunas)', 'Menunggu Pengemasan'];
        if (!allowedStatuses.includes(transaction.status_penjualan)) {
            return NextResponse.json({ error: `Pesanan dengan status ${transaction.status_penjualan} tidak dapat dibatalkan` }, { status: 400 });
        }

        // Calculate total refund amount
        const totalRefund = transaction.detail.reduce((sum, d) => sum + d.total_harga, 0) + transaction.ongkos_kirim;

        await prisma.$transaction([
            prisma.pembatalanTransaksi.create({
                data: {
                    id_transaksipenjualan: orderId,
                    alasan_pembatalan: reason,
                    nominal_refund: totalRefund,
                    status_refund: 'Pending'
                }
            }),
            prisma.transaksiPenjualanBarang.update({
                where: { id_transaksipenjualan: orderId },
                data: { status_penjualan: 'Dibatalkan' }
            }),
            // Auto-Restock items
            ...transaction.detail.map(item => 
                prisma.barang.update({
                    where: { id_barang: item.id_barang },
                    data: { stok_barang: { increment: item.jumlah_penjualan_barang } }
                })
            )
        ]);

        const { sendEmail, getAdminEmails, InternalEmailTemplates } = await import('@/lib/mail');
        const karyawanEmails = await getAdminEmails('karyawan');
        for (const email of karyawanEmails) {
            await sendEmail(
                email,
                `Pengajuan Batal Baru - ${transaction.no_transaksi}`,
                InternalEmailTemplates.newReturnRefundNotification(transaction.no_transaksi, 'Batal', reason)
            );
        }

        return NextResponse.json({ success: true, message: 'Pesanan berhasil dibatalkan. Menunggu pengembalian dana.' });
    } catch (error) {
        console.error("Cancel Order Error:", error);
        return NextResponse.json({ error: 'Gagal memproses pembatalan' }, { status: 500 });
    }
}
