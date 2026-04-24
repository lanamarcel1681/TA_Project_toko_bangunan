import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const returList = await prisma.returTransaksi.findMany({
            include: {
                transaksi: {
                    include: {
                        pembeli: true,
                    }
                }
            },
            orderBy: { tanggal_pengajuan: 'desc' }
        });

        const batalList = await prisma.pembatalanTransaksi.findMany({
            include: {
                transaksi: {
                    include: {
                        pembeli: true,
                    }
                }
            },
            orderBy: { tanggal_pembatalan: 'desc' }
        });

        // Combine and unify for the UI
        const combined = [
            ...returList.map(r => ({
                id: r.id_retur,
                type: 'RETUR',
                orderId: r.transaksi.id_transaksipenjualan,
                inv: r.transaksi.no_transaksi,
                customer: r.transaksi.pembeli.nama_pembeli,
                date: r.tanggal_pengajuan,
                reason: r.alasan_retur,
                photo: r.foto_barang_retur,
                bankInfo: r.data_rekening,
                amount: r.nominal_refund,
                status: r.status_retur, // Diajukan, Disetujui, Ditolak, Selesai
                refundStatus: r.nominal_refund ? (r.bukti_refund ? 'Selesai' : 'Pending') : 'N/A',
                proof: r.bukti_refund
            })),
            ...batalList.map(b => ({
                id: b.id_pembatalan,
                type: 'BATAL',
                orderId: b.transaksi.id_transaksipenjualan,
                inv: b.transaksi.no_transaksi,
                customer: b.transaksi.pembeli.nama_pembeli,
                date: b.tanggal_pembatalan,
                reason: b.alasan_pembatalan,
                photo: null,
                bankInfo: 'Refund Otomatis / Manual',
                amount: b.nominal_refund,
                status: 'Dibatalkan',
                refundStatus: b.status_refund,
                proof: b.bukti_refund
            }))
        ];

        return NextResponse.json({ success: true, data: combined });
    } catch (error) {
        console.error("Fetch Retur/Batal Error:", error);
        return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { type, id, action, proof, amount } = await request.json();

        if (type === 'RETUR') {
            if (action === 'APPROVE') {
                await prisma.returTransaksi.update({
                    where: { id_retur: id },
                    data: { status_retur: 'Disetujui' }
                });
                // Update main transaction status
                const retur = await prisma.returTransaksi.findUnique({ 
                    where: { id_retur: id },
                    include: { transaksi: { include: { pembeli: true } } } 
                });
                if (retur?.transaksi) {
                    await prisma.transaksiPenjualanBarang.update({
                        where: { id_transaksipenjualan: retur.id_transaksipenjualan },
                        data: { status_penjualan: 'Retur Disetujui' }
                    });
                }
            } else if (action === 'REFUND') {
                await prisma.returTransaksi.update({
                    where: { id_retur: id },
                    data: { 
                        status_retur: 'Selesai',
                        bukti_refund: proof,
                        nominal_refund: amount
                    }
                });
                const retur = await prisma.returTransaksi.findUnique({ 
                    where: { id_retur: id },
                    include: { transaksi: { include: { pembeli: true } } }
                });
                
                if (retur?.transaksi) {
                    await prisma.transaksiPenjualanBarang.update({
                        where: { id_transaksipenjualan: retur.id_transaksipenjualan },
                        data: { status_penjualan: 'Retur Selesai' }
                    });

                    // Attach image from local disk
                    const path = await import('path');
                    const absoluteProofPath = path.join(process.cwd(), 'public', proof);
                    const attachments = [{
                        filename: 'bukti_transfer.jpg',
                        path: absoluteProofPath,
                        cid: 'bukti-transfer'
                    }];

                    // Send Email
                    const { sendEmail, EmailTemplates } = await import('@/lib/mail');
                    await sendEmail(
                        retur.transaksi.pembeli.email_pembeli,
                        `Pengembalian Dana Selesai - ${retur.transaksi.no_transaksi}`,
                        EmailTemplates.refundCompleted(retur.transaksi.pembeli.nama_pembeli, retur.transaksi.no_transaksi, amount.toLocaleString('id-ID'), 'cid:bukti-transfer'),
                        attachments
                    );
                }
            }
        } else if (type === 'BATAL') {
            if (action === 'REFUND') {
                await prisma.pembatalanTransaksi.update({
                    where: { id_pembatalan: id },
                    data: { 
                        status_refund: 'Selesai',
                        bukti_refund: proof
                    }
                });
                // Update main transaction status to something reflected in UI as fully settled
                const batal = await prisma.pembatalanTransaksi.findUnique({ 
                    where: { id_pembatalan: id },
                    include: { transaksi: { include: { pembeli: true } } }
                });

                if (batal?.transaksi) {
                    await prisma.transaksiPenjualanBarang.update({
                        where: { id_transaksipenjualan: batal.id_transaksipenjualan },
                        data: { status_penjualan: 'Dibatalkan (Refund Selesai)' }
                    });

                    // Attach image from local disk
                    const path = await import('path');
                    const absoluteProofPath = path.join(process.cwd(), 'public', proof);
                    const attachments = [{
                        filename: 'bukti_transfer.jpg',
                        path: absoluteProofPath,
                        cid: 'bukti-transfer'
                    }];

                    // Send Email
                    const { sendEmail, EmailTemplates } = await import('@/lib/mail');
                    await sendEmail(
                        batal.transaksi.pembeli.email_pembeli,
                        `Pengembalian Dana Selesai - ${batal.transaksi.no_transaksi}`,
                        EmailTemplates.refundCompleted(batal.transaksi.pembeli.nama_pembeli, batal.transaksi.no_transaksi, batal.nominal_refund.toLocaleString('id-ID'), 'cid:bukti-transfer'),
                        attachments
                    );
                }
            }
        }

        return NextResponse.json({ success: true, message: 'Status berhasil diperbarui' });
    } catch (error) {
        console.error("Update Retur/Batal Error:", error);
        return NextResponse.json({ error: 'Gagal memperbarui status' }, { status: 500 });
    }
}
