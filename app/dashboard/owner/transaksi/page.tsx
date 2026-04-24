import { cookies } from 'next/headers';
import TransactionTableClient from './TransactionTableClient';
import { ShoppingCart, Search, Filter, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, Activity } from 'lucide-react';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const formatCompactCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
        return `Rp ${(value / 1000000).toFixed(1)} Jt`;
    }
    return formatCurrency(value);
};

import TransactionFilter from './TransactionFilter';

export default async function TransaksiPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams;
    const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;
    const start = typeof resolvedParams.start === 'string' ? resolvedParams.start : undefined;
    const end = typeof resolvedParams.end === 'string' ? resolvedParams.end : undefined;
    const statusFilter = typeof resolvedParams.status === 'string' ? resolvedParams.status : undefined;

    // Construct Date Filter
    const dateFilter = {
        gte: start ? new Date(`${start}T00:00:00`) : undefined,
        lte: end ? new Date(`${end}T23:59:59`) : undefined,
    };

    // 1. Fetch Sales (Penjualan)
    const sales = await prisma.transaksiPenjualanBarang.findMany({
        where: {
            tanggal_penjualan: (start || end) ? dateFilter : undefined,
            status_penjualan: statusFilter || undefined,
            OR: q ? [
                { no_transaksi: { contains: q } },
                { pembeli: { nama_pembeli: { contains: q } } },
                { detail: { some: { barang: { nama_barang: { contains: q } } } } }
            ] : undefined
        },
        include: {
            pembeli: true,
            detail: {
                include: { barang: true }
            },
            pembayaran: true
        },
        orderBy: { tanggal_penjualan: 'desc' }
    });

    // 2. Fetch Purchases (Pembelian)
    const purchases = await prisma.transaksiPembelianBarang.findMany({
        where: {
            tanggal_pembelian: (start || end) ? dateFilter : undefined,
            // Purchases don't have status yet, so we only filter by search query
            OR: q ? [
                { supplier: { nama_supplier: { contains: q } } },
                { detail: { some: { barang: { nama_barang: { contains: q } } } } }
            ] : undefined
        },
        include: {
            supplier: true,
            detail: {
                include: { barang: true }
            }
        },
        orderBy: { tanggal_pembelian: 'desc' }
    });

    // 3. Map to Transaction format
    const transactions = [
        ...sales.map(s => {
            const total = s.detail.reduce((sum, d) => sum + d.total_harga, 0);
            const status = s.status_penjualan;
            
            let displayStatus = 'Pending';
            let color = 'yellow';

            if (status === 'Selesai') {
                displayStatus = 'Lunas';
                color = 'green';
            } else if (status === 'Dibatalkan (Refund Selesai)') {
                displayStatus = 'Refund';
                color = 'red';
            } else if (status === 'Retur Selesai') {
                displayStatus = 'Retur';
                color = 'orange';
            }

            return {
                id: s.no_transaksi,
                date: new Date(s.tanggal_penjualan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
                type: "Penjualan",
                client: s.pembeli.nama_pembeli,
                description: s.detail.map(d => `${d.barang.nama_barang} (${d.jumlah_penjualan_barang} qty)`).join(", "),
                total: formatCurrency(total),
                numericTotal: total,
                status: displayStatus,
                statusColor: color,
                timestamp: new Date(s.tanggal_penjualan).getTime()
            };
        }),
        ...purchases.map(p => {
            return {
                id: `PO-${p.id_transaksipembelian.toString().padStart(3, '0')}`,
                date: new Date(p.tanggal_pembelian).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
                type: "Pembelian",
                client: p.supplier.nama_supplier,
                description: p.detail.map(d => `${d.barang.nama_barang} (${d.jumlah_pembelian_barang} qty)`).join(", "),
                total: formatCurrency(p.total_biaya),
                numericTotal: p.total_biaya,
                status: "Lunas",
                statusColor: "green",
                timestamp: new Date(p.tanggal_pembelian).getTime()
            };
        })
    ].sort((a, b) => b.timestamp - a.timestamp);

    // 4. Calculate Summaries
    const totalPenjualanVal = sales.reduce((acc, s) => acc + s.detail.reduce((sum, d) => sum + d.total_harga, 0), 0);
    const totalPembelianVal = purchases.reduce((acc, p) => acc + p.total_biaya, 0);
    const labaKotorVal = totalPenjualanVal - totalPembelianVal;

    const summaryData = {
        totalPenjualan: formatCompactCurrency(totalPenjualanVal),
        totalPembelian: formatCompactCurrency(totalPembelianVal),
        labaKotor: formatCompactCurrency(labaKotorVal)
    };

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">

            {/* Page Heading & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Transaction Ledger</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Arus Kas & Transaksi</h1>
                    <p className="text-gray-500 font-medium mt-3">Konsolidasi seluruh aktivitas penjualan dan pembelian material bangunan secara periodik.</p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-500 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-gray-200/20 border border-gray-100 hover:bg-gray-50 transition-all active:scale-95 group">
                        <TrendingUp className="w-4 h-4 mr-2 group-hover:translate-y-[-2px] transition-transform" />
                        Analisis Margin
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Total Penjualan */}
                <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                                <ArrowUpRight className="w-7 h-7" />
                            </div>
                            <span className="text-[10px] font-black text-green-600 bg-green-100 px-3 py-1 rounded-lg uppercase tracking-widest">+ Live</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">Total Penjualan</p>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{summaryData.totalPenjualan}</h3>
                        <div className="w-10 h-1 bg-green-500 rounded-full"></div>
                    </div>
                </div>

                {/* Total Pembelian */}
                <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <ArrowDownRight className="w-7 h-7" />
                            </div>
                            <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-lg uppercase tracking-widest">Database</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">Total Pembelian</p>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{summaryData.totalPembelian}</h3>
                        <div className="w-10 h-1 bg-blue-500 rounded-full"></div>
                    </div>
                </div>

                {/* Laba Kotor */}
                <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                                <Activity className="w-7 h-7" />
                            </div>
                            <span className="text-[10px] font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-lg uppercase tracking-widest">Kalkulasi</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">Laba Kotor Estimasi</p>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{summaryData.labaKotor}</h3>
                        <div className="w-10 h-1 bg-orange-600 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <TransactionFilter />

            <TransactionTableClient transactions={transactions} />

        </div>
    );
}
