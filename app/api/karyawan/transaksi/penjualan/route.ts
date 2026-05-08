import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const isHistory = searchParams.get('history') === 'true';

        const transactions = await prisma.transaksiPenjualanBarang.findMany({
            where: {
                status_penjualan: isHistory 
                    ? 'Selesai'
                    : { in: ['Menunggu Pengemasan', 'Siap Diambil'] }
            },
            include: {
                pembeli: true,
                pengiriman: true,
                detail: {
                    include: {
                        barang: true
                    }
                }
            },
            orderBy: {
                tanggal_penjualan: 'asc'
            }
        });

        // Split into deliveries and pickups
        const deliveries = transactions.filter(t => t.metode_pengantaran === 'Diantar ke Rumah')
            .map(t => ({
                id: t.no_transaksi,
                realId: t.id_transaksipenjualan,
                customer: t.pembeli.nama_pembeli,
                date: t.tanggal_penjualan.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                address: t.pengiriman[0]?.alamat_tujuan || "Alamat tidak tersedia",
                phone: t.pembeli.nomor_telepon_pembeli,
                status: t.status_penjualan,
                rawDetail: t.detail // Include for PDF generation
            }));

        const pickups = transactions.filter(t => t.metode_pengantaran !== 'Diantar ke Rumah')
            .map(t => ({
                id: t.no_transaksi,
                realId: t.id_transaksipenjualan,
                customer: t.pembeli.nama_pembeli,
                date: t.tanggal_penjualan.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                area: "Gudang Utama", // Mock area for now
                phone: t.pembeli.nomor_telepon_pembeli,
                status: t.status_penjualan,
                rawDetail: t.detail // Include for PDF generation
            }));

        return NextResponse.json({ success: true, deliveries, pickups });
    } catch (error) {
        console.error("Fetch Monitoring Error:", error);
        return NextResponse.json({ error: 'Gagal mengambil data monitoring' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { id, action, details } = await request.json();

        if (action === 'ASSIGN_DRIVER') {
            const { driverId, date, time } = details;
            
            // 1. Find the transaction
            const transaction = await prisma.transaksiPenjualanBarang.findUnique({
                where: { no_transaksi: id },
                include: { pengiriman: true, pembeli: true }
            });

            if (!transaction || transaction.pengiriman.length === 0) {
                return NextResponse.json({ error: 'Data pengiriman tidak ditemukan' }, { status: 404 });
            }

            // Fetch Driver
            const driver = await prisma.pegawai.findUnique({ where: { id_pegawai: parseInt(driverId) } });

            // 2. Combine date & time
            const departureDate = new Date(`${date}T${time}`);

            // 3. Update Pengiriman & Status
            await prisma.$transaction([
                prisma.pengiriman.update({
                    where: { id_pengiriman: transaction.pengiriman[0].id_pengiriman },
                    data: {
                        id_pegawai: parseInt(driverId),
                        tanggal_berangkat: departureDate,
                        status_pengiriman: 'Sedang Dikirim'
                    }
                }),
                prisma.transaksiPenjualanBarang.update({
                    where: { no_transaksi: id },
                    data: { status_penjualan: 'Sedang Dikirim' }
                })
            ]);

            // 4. Send Email
            const { calculateShippingEstimation } = await import('@/lib/delivery');
            const { sendEmail, EmailTemplates, InternalEmailTemplates } = await import('@/lib/mail');
            
            const est = calculateShippingEstimation(transaction.pengiriman[0].alamat_tujuan || "", departureDate);
            
            // Email to Customer
            await sendEmail(
                transaction.pembeli.email_pembeli,
                `Pesanan Sedang Dikirim - ${transaction.no_transaksi}`,
                EmailTemplates.orderShipped(
                    transaction.pembeli.nama_pembeli,
                    transaction.no_transaksi,
                    driver?.nama_pegawai || 'Kurir',
                    est.duration
                )
            );

            // Email to Driver
            if (driver?.email_pegawai) {
                await sendEmail(
                    driver.email_pegawai,
                    `Tugas Pengiriman Baru - ${transaction.no_transaksi}`,
                    InternalEmailTemplates.deliveryAssignedNotification(
                        transaction.no_transaksi,
                        transaction.pembeli.nama_pembeli,
                        transaction.pengiriman[0].alamat_tujuan || "Alamat tidak tersedia"
                    )
                );
            }

            return NextResponse.json({ success: true, message: 'Driver berhasil ditugaskan' });
        }

        if (action === 'CONFIRM_PICKUP') {
            const transaction = await prisma.transaksiPenjualanBarang.update({
                where: { no_transaksi: id },
                data: { status_penjualan: 'Selesai' },
                include: {
                    pembeli: true,
                    detail: { include: { barang: true } }
                }
            });

            // Send Email — Nota Transaksi Lengkap
            const { sendEmail, EmailTemplates } = await import('@/lib/mail');

            const receiptItems = transaction.detail.map(d => ({
                nama: d.barang.nama_barang,
                jumlah: d.jumlah_penjualan_barang,
                harga_satuan: d.barang.harga_barang,
                subtotal: d.total_harga
            }));

            const totalBarang = transaction.detail.reduce((sum, d) => sum + d.total_harga, 0);
            const totalBayar = totalBarang + (transaction.ongkos_kirim || 0);
            const tanggal = new Date(transaction.tanggal_penjualan).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });

            await sendEmail(
                transaction.pembeli.email_pembeli,
                `✅ Nota Pembelian - ${transaction.no_transaksi}`,
                EmailTemplates.transactionReceipt(
                    transaction.pembeli.nama_pembeli,
                    transaction.no_transaksi,
                    tanggal,
                    receiptItems,
                    transaction.ongkos_kirim || 0,
                    totalBayar,
                    transaction.metode_pengantaran
                )
            );

            return NextResponse.json({ success: true, message: 'Penyerahan berhasil dikonfirmasi' });
        }

        return NextResponse.json({ error: 'Aksi tidak valid' }, { status: 400 });
    } catch (error) {
        console.error("Update Monitoring Error:", error);
        return NextResponse.json({ error: 'Gagal memperbarui status' }, { status: 500 });
    }
}
