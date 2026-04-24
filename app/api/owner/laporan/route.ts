import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        // 1. Keuangan (Sales & Purchase monthly) - Last 12 months
        const months = Array.from({ length: 12 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
            return {
                name: d.toLocaleString('id-ID', { month: 'short' }),
                month: d.getMonth() + 1,
                year: d.getFullYear()
            };
        });

        const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

        const [sales, purchases] = await Promise.all([
            prisma.transaksiPenjualanBarang.findMany({
                where: { tanggal_penjualan: { gte: startDate } },
                include: { detail: true }
            }),
            prisma.transaksiPembelianBarang.findMany({
                where: { tanggal_pembelian: { gte: startDate } }
            })
        ]);

        const salesData = months.map(m => {
            const monthSales = sales.filter(s => 
                s.tanggal_penjualan.getMonth() + 1 === m.month && 
                s.tanggal_penjualan.getFullYear() === m.year
            );
            const monthPurchases = purchases.filter(p => 
                p.tanggal_pembelian.getMonth() + 1 === m.month && 
                p.tanggal_pembelian.getFullYear() === m.year
            );

            const totalSales = monthSales.reduce((acc, s) => 
                acc + s.detail.reduce((sum, d) => sum + d.total_harga, 0), 0
            );
            const totalPurchases = monthPurchases.reduce((acc, p) => acc + p.total_biaya, 0);

            return {
                name: m.name,
                Penjualan: totalSales,
                Pembelian: totalPurchases
            };
        });

        // 2. Stok Barang
        const products = await prisma.barang.findMany({
            include: {
                kategori: true,
                satuan: true
            },
            orderBy: { stok_barang: 'asc' }
        });

        const stockData = products.map(p => ({
            sku: `BRG-${p.id_barang.toString().padStart(3, '0')}`,
            name: p.nama_barang,
            category: p.kategori.nama_kategori,
            stock: p.stok_barang,
            unit: p.satuan.satuan_barang,
            status: p.stok_barang === 0 ? 'Habis' : p.stok_barang <= p.minimum_barang ? 'Menipis' : 'Aman'
        }));

        // 3. Kategori (Sales distribution)
        const categoryStats = await prisma.detailTransaksiPenjualanBarang.groupBy({
            by: ['id_barang'],
            _sum: { total_harga: true },
            _count: { id_detailtransaksipenjualan: true }
        });

        // Map category stats to category names
        const categoryMap = new Map();
        for (const stat of categoryStats) {
            const product = products.find(p => p.id_barang === stat.id_barang);
            if (product) {
                const catName = product.kategori.nama_kategori;
                const current = categoryMap.get(catName) || { value: 0, revenue: 0 };
                categoryMap.set(catName, {
                    value: current.value + (stat._count.id_detailtransaksipenjualan || 0),
                    revenue: current.revenue + (stat._sum.total_harga || 0)
                });
            }
        }

        const categoryData = Array.from(categoryMap.entries()).map(([name, data]) => ({
            name,
            value: data.value,
            revenue: data.revenue
        })).sort((a, b) => b.value - a.value);

        // 4. Produk Terlaris (Top 10)
        const productStats = await prisma.detailTransaksiPenjualanBarang.groupBy({
            by: ['id_barang'],
            _sum: { total_harga: true, jumlah_penjualan_barang: true },
        });

        const productData = productStats.map(stat => {
            const product = products.find(p => p.id_barang === stat.id_barang);
            return {
                name: product?.nama_barang || 'Unknown',
                value: stat._sum.total_harga || 0,
                qty: stat._sum.jumlah_penjualan_barang || 0
            };
        }).sort((a, b) => b.value - a.value).slice(0, 10);

        // 5. Daily Data (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [dailySales, dailyPurchases] = await Promise.all([
            prisma.transaksiPenjualanBarang.findMany({
                where: { tanggal_penjualan: { gte: thirtyDaysAgo } },
                include: { detail: true }
            }),
            prisma.transaksiPembelianBarang.findMany({
                where: { tanggal_pembelian: { gte: thirtyDaysAgo } }
            })
        ]);

        const dailyData = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            date.setHours(0, 0, 0, 0);

            const daySales = dailySales.filter(s => {
                const sDate = new Date(s.tanggal_penjualan);
                sDate.setHours(0, 0, 0, 0);
                return sDate.getTime() === date.getTime();
            });

            const dayPurchases = dailyPurchases.filter(p => {
                const pDate = new Date(p.tanggal_pembelian);
                pDate.setHours(0, 0, 0, 0);
                return pDate.getTime() === date.getTime();
            });

            return {
                day: date.getDate(),
                revenue: daySales.reduce((acc, s) => acc + s.detail.reduce((sum, d) => sum + d.total_harga, 0), 0),
                purchases: dayPurchases.reduce((acc, p) => acc + p.total_biaya, 0)
            };
        });

        return NextResponse.json({
            salesData,
            stockData,
            categoryData,
            productData,
            dailyData
        });

    } catch (error) {
        console.error('Laporan Stats Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
