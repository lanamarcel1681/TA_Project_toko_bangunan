import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculateShippingEstimation } from '@/lib/delivery';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const activeDeliveries = await prisma.transaksiPenjualanBarang.findMany({
            where: {
                status_penjualan: 'Sedang Dikirim',
                metode_pengantaran: 'Diantar ke Rumah'
            },
            include: {
                pembeli: true,
                pengiriman: {
                    include: {
                        pegawai: true
                    }
                }
            },
            orderBy: {
                tanggal_penjualan: 'asc'
            }
        });

        // Format for frontend
        const missions = activeDeliveries.map(t => {
            const ship = t.pengiriman[0];
            const est = calculateShippingEstimation(ship?.alamat_tujuan || "", ship?.tanggal_berangkat || null);

            return {
                id: t.no_transaksi,
                realId: t.id_transaksipenjualan,
                customer: t.pembeli.nama_pembeli,
                address: ship?.alamat_tujuan || "Alamat tidak tersedia",
                driverId: ship?.id_pegawai,
                driver: ship?.pegawai?.nama_pegawai || "Belum ditentukan",
                departureTime: ship?.tanggal_berangkat,
                estimasi: `± ${est.duration}`,
                eta: est.eta
            };
        });

        // Dynamic Proposals: Group missions by driver and find those with 2+ orders
        const proposals: any[] = [];
        const driverGroups: Record<number, any[]> = {};

        missions.forEach(m => {
            if (m.driverId) {
                if (!driverGroups[m.driverId]) driverGroups[m.driverId] = [];
                driverGroups[m.driverId].push(m);
            }
        });

        Object.values(driverGroups).forEach((group, index) => {
            if (group.length >= 2) {
                proposals.push({
                    id: `PROP-${index + 1}`,
                    title: `Penggabungan Rute ${group[0].driver}`,
                    driver: group[0].driver,
                    orders: group.map(m => ({
                        id: m.id,
                        name: m.customer,
                        addr: m.address
                    }))
                });
            }
        });

        return NextResponse.json({ success: true, missions, proposals });
    } catch (error) {
        console.error("Fetch Active Deliveries Error:", error);
        return NextResponse.json({ error: 'Gagal mengambil data pengantaran' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { id, action } = await request.json();

        if (action === 'COMPLETE_DELIVERY') {
            const now = new Date();
            const ids = Array.isArray(id) ? id : [id];
            
            // Collect all transaction IDs and verify existence
            const transactions = await prisma.transaksiPenjualanBarang.findMany({
                where: { no_transaksi: { in: ids } },
                include: { pengiriman: true, pembeli: true }
            });

            if (transactions.length === 0) {
                return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
            }

            // Prepare all update operations
            const operations: any[] = [];
            
            transactions.forEach(t => {
                if (t.pengiriman.length > 0) {
                    operations.push(
                        prisma.pengiriman.update({
                            where: { id_pengiriman: t.pengiriman[0].id_pengiriman },
                            data: {
                                status_pengiriman: 'Selesai',
                                tanggal_sampai: now
                            }
                        })
                    );
                }
                operations.push(
                    prisma.transaksiPenjualanBarang.update({
                        where: { no_transaksi: t.no_transaksi },
                        data: { status_penjualan: 'Selesai' }
                    })
                );
            });

            await prisma.$transaction(operations);

            // Send emails
            const { sendEmail, EmailTemplates } = await import('@/lib/mail');
            for (const t of transactions) {
                if (t.pembeli?.email_pembeli) {
                    await sendEmail(
                        t.pembeli.email_pembeli,
                        `Pesanan Telah Sampai - ${t.no_transaksi}`,
                        EmailTemplates.orderArrived(t.pembeli.nama_pembeli, t.no_transaksi)
                    );
                }
            }

            return NextResponse.json({ success: true, message: `Berhasil menyelesaikan ${transactions.length} pengiriman` });
        }

        return NextResponse.json({ error: 'Aksi tidak valid' }, { status: 400 });
    } catch (error) {
        console.error("Complete Delivery Error:", error);
        return NextResponse.json({ error: 'Gagal menyelesaikan pengiriman' }, { status: 500 });
    }
}
