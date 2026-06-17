import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // 1. Stat cards for Owner
        const [
            thisMonthSalesData,
            prevMonthSalesData,
            totalTransactions,
            totalProducts,
            totalCustomers,
            lowStockCount
        ] = await Promise.all([
            // Total Sales All Time
            prisma.detailTransaksiPenjualanBarang.aggregate({
                _sum: { total_harga: true }
            }),
            // Total Sales Last Month (for trend)
            prisma.detailTransaksiPenjualanBarang.aggregate({
                _sum: { total_harga: true },
                where: {
                    transaksi: {
                        tanggal_penjualan: {
                            gte: startOfLastMonth,
                            lte: endOfLastMonth
                        }
                    }
                }
            }),
            // Total Transactions All Time
            prisma.transaksiPenjualanBarang.count(),
            // Total Products
            prisma.barang.count(),
            // Total Customers
            prisma.pembeli.count(),
            // Low Stock Count (Karyawan)
            prisma.$queryRaw`SELECT COUNT(*) as count FROM Barang WHERE stok_barang <= minimum_barang` as Promise<any>
        ]);

        const totalSales = thisMonthSalesData._sum.total_harga || 0;
        // Kita bisa tetap mempertahankan perhitungan prevMonthSales jika dibutuhkan untuk trend bulanan
        // Namun karena sekarang menggunakan Total Keseluruhan, kita tidak perlu membandingkan trend keseluruhan dengan bulan lalu.
        const salesTrend = 0;

        // 2. Activities & Stock Items
        const [recentSales, recentPurchases, lowStockAlerts, stockItems] = await Promise.all([
            prisma.transaksiPenjualanBarang.findMany({
                take: 3,
                orderBy: { tanggal_penjualan: 'desc' },
                include: { pembeli: true, detail: { include: { barang: true } } }
            }),
            prisma.transaksiPembelianBarang.findMany({
                take: 2,
                orderBy: { tanggal_pembelian: 'desc' },
                include: { supplier: true }
            }),
            prisma.barang.findMany({
                where: { 
                    status_barang: 'Aktif'
                    // stok_barang <= minimum_barang handled by filter in JS to avoid complex raw query result mapping
                },
                include: { kategori: true, satuan: true },
            }),
            prisma.barang.findMany({
                take: 6,
                include: { kategori: true, satuan: true },
                orderBy: { stok_barang: 'asc' }
            })
        ]);

        // Filter low stock alerts in JS
        const refinedLowStockAlerts = lowStockAlerts
            .filter(b => b.stok_barang <= b.minimum_barang)
            .slice(0, 5);

        const activities = [
            ...recentSales.map(s => ({
                text: `Penjualan baru #${s.id_transaksipenjualan} - ${s.pembeli.nama_pembeli} (${s.detail.length} item)`,
                time: formatDateAgo(s.tanggal_penjualan),
                alert: false,
                category: 'SALES'
            })),
            ...recentPurchases.map(p => ({
                text: `Pembelian stok dari ${p.supplier.nama_perusahaan_supplier} senilai Rp ${p.total_biaya.toLocaleString('id-ID')}`,
                time: formatDateAgo(p.tanggal_pembelian),
                alert: false,
                category: 'STOCK'
            })),
            ...refinedLowStockAlerts.map(b => ({
                text: `Stok kritis - ${b.nama_barang} (Tersisa ${b.stok_barang} ${b.satuan.satuan_barang})`,
                time: 'Sekarang',
                alert: true,
                category: 'ALERT'
            }))
        ].sort((a,b) => (a.time === 'Sekarang' ? -1 : 1)).slice(0, 6);

        return NextResponse.json({
            owner: {
                stats: [
                    { label: 'Total Penjualan', value: formatRp(totalSales), sub: 'Keseluruhan', trend: '0' },
                    { label: 'Total Transaksi', value: totalTransactions.toLocaleString('id-ID'), sub: 'Keseluruhan', trend: '0' },
                    { label: 'Total Produk', value: totalProducts.toLocaleString('id-ID'), sub: 'Produk aktif', trend: '0' },
                    { label: 'Total Pelanggan', value: totalCustomers.toLocaleString('id-ID'), sub: 'Terdaftar', trend: '0' },
                ],
                activities
            },
            karyawan: {
                totalItems: totalProducts,
                lowStockCount: Number(lowStockCount[0]?.count || 0),
                stockItems: stockItems.map(b => ({
                    name: b.nama_barang,
                    category: b.kategori.nama_kategori,
                    stock: b.stok_barang,
                    unit: b.satuan.satuan_barang,
                    status: b.stok_barang <= b.minimum_barang ? 'low' : 'ok'
                })),
                todayActivity: activities.slice(0, 5).map(a => ({
                    type: a.category === 'STOCK' ? 'masuk' : 'keluar',
                    item: a.text.split(' - ')[1] || a.text,
                    qty: '-',
                    unit: '',
                    time: a.time
                }))
            }
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

function formatRp(val: number) {
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)} Jt`;
    return `Rp ${val.toLocaleString('id-ID')}`;
}

function formatDateAgo(date: Date) {
    const diff = new Date().getTime() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} Hari yang lalu`;
    if (hours > 0) return `${hours} Jam yang lalu`;
    if (mins > 0) return `${mins} Mnt yang lalu`;
    return 'Baru saja';
}
