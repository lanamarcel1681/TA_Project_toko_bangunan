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
        const { orderId, reason, bankInfo } = await request.json();

        if (!orderId || !reason || !bankInfo) {
            return NextResponse.json({ error: 'Data tidak lengkap. Harap sertakan alasan pembatalan dan info rekening refund.' }, { status: 400 });
        }

        // Validasi format rekening: NamaBank – NomorRek – NamaPemilik
        const bankParts = bankInfo.split(' – ');
        if (bankParts.length !== 3) {
            return NextResponse.json({ error: 'Format info rekening tidak valid. Gunakan format: Nama Bank/E-Wallet – Nomor Rek – Nama Pemilik.' }, { status: 400 });
        }
        const [bankNama, bankNomor, bankPemilik] = bankParts;
        if (!bankNama.trim()) {
            return NextResponse.json({ error: 'Nama bank/e-wallet tidak boleh kosong.' }, { status: 400 });
        }
        if (!/^\d{6,20}$/.test(bankNomor.trim())) {
            return NextResponse.json({ error: 'Nomor rekening/e-wallet harus berupa angka (6-20 digit).' }, { status: 400 });
        }
        if (!bankPemilik.trim() || !/^[a-zA-Z\s]+$/.test(bankPemilik.trim())) {
            return NextResponse.json({ error: 'Nama pemilik rekening tidak valid. Hanya boleh berisi huruf dan spasi.' }, { status: 400 });
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
                    data_rekening: bankInfo,
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
