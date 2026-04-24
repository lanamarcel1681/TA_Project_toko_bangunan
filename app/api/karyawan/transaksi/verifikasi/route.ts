import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const allTransactions = await prisma.transaksiPenjualanBarang.findMany({
            where: {
                status_penjualan: {
                    in: ['Menunggu Verifikasi Pembayaran', 'Diverifikasi (Lunas)', 'Menunggu Pengemasan', 'Siap Diambil', 'Dibatalkan', 'Sedang Dikirim', 'Selesai']
                }
            },
            include: {
                pembeli: true,
                pembayaran: true,
                detail: true
            },
            orderBy: {
                tanggal_penjualan: 'desc'
            }
        });

        // Helper to format
        const formatData = (transactions: any[]) => transactions.map(t => {
            const totalAmount = t.detail.reduce((sum: number, d: any) => sum + d.total_harga, 0) + t.ongkos_kirim;
            const payment = t.pembayaran[0];

            return {
                id: t.id_transaksipenjualan,
                inv: t.no_transaksi,
                customer: t.pembeli.nama_pembeli,
                amount: totalAmount,
                method: payment?.status_pembayaran === 'Belum Bayar' ? 'CASH (Pickup)' : 'Transfer/QRIS',
                time: t.tanggal_penjualan.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
                date: t.tanggal_penjualan.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
                proof: payment?.foto_bukti_pembayaran || null,
                status_pembayaran: payment?.status_pembayaran,
                status_penjualan: t.status_penjualan,
                metode_pengantaran: t.metode_pengantaran
            };
        });

        const pending = allTransactions.filter(t => t.status_penjualan === 'Menunggu Verifikasi Pembayaran');
        const history = allTransactions.filter(t => t.status_penjualan !== 'Menunggu Verifikasi Pembayaran').slice(0, 10); // Last 10 verified

        return NextResponse.json({
            success: true,
            pending: formatData(pending),
            history: formatData(history)
        });
    } catch (error) {
        console.error("Fetch Verifikasi Error:", error);
        return NextResponse.json({ error: 'Gagal mengambil data verifikasi' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { id, action } = await request.json();

        if (!id || !action) {
            return NextResponse.json({ error: 'ID dan Action wajib diisi' }, { status: 400 });
        }

        let emailData: any = null;

        const result = await prisma.$transaction(async (tx) => {
            const transaction = await tx.transaksiPenjualanBarang.findUnique({
                where: { id_transaksipenjualan: id },
                include: { pembeli: true, detail: true }
            });

            if (!transaction) throw new Error("Transaksi tidak ditemukan");

            if (action === 'APPROVE') {
                // If Approved
                const nextStatus = transaction.metode_pengantaran === 'Diantar ke Rumah'
                    ? 'Menunggu Pengemasan'
                    : 'Siap Diambil';

                await tx.transaksiPenjualanBarang.update({
                    where: { id_transaksipenjualan: id },
                    data: { status_penjualan: nextStatus }
                });

                await tx.pembayaran.updateMany({
                    where: { id_transaksipenjualan: id },
                    data: { status_pembayaran: 'Diverifikasi (Lunas)' }
                });

                const totalAmount = transaction.detail.reduce((sum: number, d: any) => sum + d.total_harga, 0) + transaction.ongkos_kirim;
                emailData = {
                    email: transaction.pembeli.email_pembeli,
                    name: transaction.pembeli.nama_pembeli,
                    inv: transaction.no_transaksi,
                    amount: totalAmount.toLocaleString('id-ID'),
                    isPickup: transaction.metode_pengantaran !== 'Diantar ke Rumah'
                };
            } else if (action === 'REJECT') {
                // If Rejected
                await tx.transaksiPenjualanBarang.update({
                    where: { id_transaksipenjualan: id },
                    data: { status_penjualan: 'Dibatalkan' }
                });

                await tx.pembayaran.updateMany({
                    where: { id_transaksipenjualan: id },
                    data: { status_pembayaran: 'Ditolak' }
                });

                // RESTORE STOCK? (Optional but good practice)
                const details = await tx.detailTransaksiPenjualanBarang.findMany({
                    where: { id_transaksipenjualan: id }
                });

                for (const d of details) {
                    await tx.barang.update({
                        where: { id_barang: d.id_barang },
                        data: { stok_barang: { increment: d.jumlah_penjualan_barang } }
                    });
                }
            }

            return { success: true };
        });

        if (emailData) {
            const { sendEmail, EmailTemplates } = await import('@/lib/mail');
            await sendEmail(
                emailData.email,
                `Pembayaran Terverifikasi - ${emailData.inv}`,
                EmailTemplates.paymentVerified(emailData.name, emailData.inv, emailData.amount, emailData.isPickup)
            );
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Update Verifikasi Error:", error);
        return NextResponse.json({ error: error.message || 'Gagal memperbarui status' }, { status: 500 });
    }
}
