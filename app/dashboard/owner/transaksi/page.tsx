import { cookies } from 'next/headers';
import TransactionTableClient from './TransactionTableClient';
import { ShoppingCart, Search, Filter, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, Activity } from 'lucide-react';

const summaryData = {
    totalPenjualan: "Rp 52.2 Jt",
    totalPembelian: "Rp 53.0 Jt",
    labaKotor: "Rp 15.8 Jt"
};

const transactions = [
    {
        id: "INV-2025-001",
        date: "22 Jan 2025",
        type: "Penjualan",
        client: "PT Karya Konstruksi",
        description: "Semen Portland (50 sak), Besi Beton (500 kg)",
        total: "Rp 38.750.000",
        status: "Lunas",
        statusColor: "green"
    },
    {
        id: "INV-2025-002",
        date: "22 Jan 2025",
        type: "Penjualan",
        client: "Toko TB. Lumbung Jaya",
        description: "Cat Tembok (20 kaleng), Kuas (10 pcs)",
        total: "Rp 3.700.000",
        status: "Pending",
        statusColor: "yellow"
    },
    {
        id: "PO-2025-001",
        date: "21 Jan 2025",
        type: "Pembelian",
        client: "PT Semen Indonesia",
        description: "Semen Portland (500 sak)",
        total: "Rp 30.000.000",
        status: "Lunas",
        statusColor: "green"
    },
    {
        id: "INV-2025-003",
        date: "21 Jan 2025",
        type: "Penjualan",
        client: "Bapak Ahmad",
        description: "Bata Merah (5000 buah), Pasir (2 m³)",
        total: "Rp 5.250.000",
        status: "Lunas",
        statusColor: "green"
    },
    {
        id: "PO-2025-002",
        date: "20 Jan 2025",
        type: "Pembelian",
        client: "PT Baja Indonesia",
        description: "Besi Beton 10mm (2000 kg)",
        total: "Rp 23.000.000",
        status: "Pending",
        statusColor: "yellow"
    },
    {
        id: "INV-2025-004",
        date: "20 Jan 2025",
        type: "Penjualan",
        client: "CV Bangun Sejahtera",
        description: "Genteng Keramik (500 buah), Paku (20 kg)",
        total: "Rp 4.500.000",
        status: "Lunas",
        statusColor: "green"
    }
];

export default async function TransaksiPage() {
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
                            <span className="text-[10px] font-black text-green-600 bg-green-100 px-3 py-1 rounded-lg uppercase tracking-widest">+12.5%</span>
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
                            <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-lg uppercase tracking-widest">-2.4%</span>
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
                            <span className="text-[10px] font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-lg uppercase tracking-widest">Target 90%</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">Laba Kotor Estimasi</p>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{summaryData.labaKotor}</h3>
                        <div className="w-10 h-1 bg-orange-600 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col lg:flex-row gap-6 mb-10 items-center justify-between">
                <div className="relative w-full lg:max-w-md group/search">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/search:text-orange-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari ID Invoice, Pelanggan, atau Produk..."
                        className="w-full pl-14 pr-6 py-5 rounded-full border border-gray-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none text-sm font-medium transition-all shadow-lg shadow-gray-200/40 bg-white"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-gray-100 shadow-md">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest text-gray-700 focus:ring-0 outline-none cursor-pointer">
                            <option>Semua Status</option>
                            <option>Lunas Terverifikasi</option>
                            <option>Pending Otorisasi</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-gray-100 shadow-md">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div className="flex items-center gap-2">
                            <input type="date" className="bg-transparent border-none text-[11px] font-black text-gray-700 focus:ring-0 outline-none" />
                            <span className="text-gray-300">/</span>
                            <input type="date" className="bg-transparent border-none text-[11px] font-black text-gray-700 focus:ring-0 outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            <TransactionTableClient transactions={transactions} />

        </div>
    );
}
