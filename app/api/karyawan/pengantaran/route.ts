import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculateShippingEstimation } from '@/lib/delivery';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pegawaiIdParam = searchParams.get('pegawaiId');
        const pegawaiId = pegawaiIdParam ? parseInt(pegawaiIdParam) : null;

        // Build where clause — jika pegawaiId dikirim, filter hanya pengiriman milik driver tersebut
        const whereClause: any = {
            status_penjualan: 'Sedang Dikirim',
            metode_pengantaran: 'Diantar ke Rumah',
        };

        if (pegawaiId) {
            whereClause.pengiriman = {
                some: { id_pegawai: pegawaiId }
            };
        }

        const activeDeliveries = await prisma.transaksiPenjualanBarang.findMany({
            where: whereClause,
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
                eta: est.eta,
                phone: t.pembeli.nomor_telepon_pembeli
            };
        });

        // Dynamic Proposals: Group missions by driver AND date and find those with 2+ orders
        // Hanya buat proposal untuk driver yang sedang login (jika ada pegawaiId)
        const proposals: any[] = [];
        const driverGroups: Record<string, any[]> = {};

        missions.forEach(m => {
            if (m.driverId) {
                let dateKey = 'unassigned-date';
                if (m.departureTime) {
                    const dateObj = new Date(m.departureTime);
                    dateKey = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
                }
                const groupKey = `${m.driverId}_${dateKey}`;
                if (!driverGroups[groupKey]) driverGroups[groupKey] = [];
                driverGroups[groupKey].push(m);
            }
        });

        Object.values(driverGroups).forEach((group, index) => {
            // Jika pegawaiId ada, hanya buat proposal untuk driver yang bersangkutan
            if (pegawaiId && group[0]?.driverId !== pegawaiId) return;
            if (group.length >= 2) {
                let dateStr = '';
                if (group[0].departureTime) {
                    const dateObj = new Date(group[0].departureTime);
                    dateStr = ` (${dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})`;
                }
                
                const uniqueId = group.map(m => m.id).join('-');
                proposals.push({
                    id: `PROP-${uniqueId}`,
                    title: `Penggabungan Rute ${group[0].driver}${dateStr}`,
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
        const body = await request.json();
        const { id, action, newDate, newTime } = body;

        if (action === 'RESCHEDULE_DELIVERY') {
            const ids = Array.isArray(id) ? id : [id];
            
            const transactions = await prisma.transaksiPenjualanBarang.findMany({
                where: { no_transaksi: { in: ids } },
                include: { pengiriman: true }
            });

            if (transactions.length === 0) {
                return NextResponse.json({ error: 'Data pengiriman tidak ditemukan' }, { status: 404 });
            }

            const isoDate = new Date(`${newDate}T${newTime}:00`);

            const operations = transactions.map(t => {
                if (t.pengiriman.length > 0) {
                    return prisma.pengiriman.update({
                        where: { id_pengiriman: t.pengiriman[0].id_pengiriman },
                        data: {
                            tanggal_berangkat: isoDate
                        }
                    });
                }
            }).filter(Boolean) as any[];

            await prisma.$transaction(operations);

            return NextResponse.json({ success: true, message: 'Berhasil menjadwalkan ulang pengiriman' });
        }

        if (action === 'COMPLETE_DELIVERY') {
            const now = new Date();
            const ids = Array.isArray(id) ? id : [id];
            
            // Collect all transaction IDs and verify existence — include detail barang untuk nota
            const transactions = await prisma.transaksiPenjualanBarang.findMany({
                where: { no_transaksi: { in: ids } },
                include: {
                    pengiriman: true,
                    pembeli: true,
                    detail: { include: { barang: true } }
                }
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

            // Send email nota lengkap ke setiap pembeli
            const { sendEmail, EmailTemplates } = await import('@/lib/mail');
            for (const t of transactions) {
                if (t.pembeli?.email_pembeli) {
                    const receiptItems = t.detail.map((d: any) => ({
                        nama: d.barang.nama_barang,
                        jumlah: d.jumlah_penjualan_barang,
                        harga_satuan: d.barang.harga_barang,
                        subtotal: d.total_harga
                    }));

                    const totalBarang = t.detail.reduce((sum: number, d: any) => sum + d.total_harga, 0);
                    const totalBayar = totalBarang + (t.ongkos_kirim || 0);
                    const tanggal = new Date(t.tanggal_penjualan).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    });

                    await sendEmail(
                        t.pembeli.email_pembeli,
                        `✅ Nota Pembelian - ${t.no_transaksi}`,
                        EmailTemplates.transactionReceipt(
                            t.pembeli.nama_pembeli,
                            t.no_transaksi,
                            tanggal,
                            receiptItems,
                            t.ongkos_kirim || 0,
                            totalBayar,
                            t.metode_pengantaran
                        )
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
