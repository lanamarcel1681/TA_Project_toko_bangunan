'use client';
import React, { useState } from 'react';
import {
    PackageSearch, AlertTriangle, CheckCircle2, Clock, Search, Filter,
    ArrowUpRight, ArrowDownRight, MoreVertical, Check, X, Eye,
    Layers, Inbox, History, Download, TrendingDown, ArrowRight, Save, Trash2, Package, Plus
} from 'lucide-react';

// Premium Dummy Data for Stock
const stockItems = [
    { id: 1, sku: 'SEM-TR-001', name: 'Semen Tiga Roda 40kg', category: 'Semen', stock: 450, unit: 'Sak', status: 'Aman', price: 65000 },
    { id: 2, sku: 'BES-10-002', name: 'Besi Beton 10mm SNI', category: 'Besi', stock: 1200, unit: 'Batang', status: 'Aman', price: 95000 },
    { id: 3, sku: 'CAT-DX-003', name: 'Cat Dulux WeatherShield 5L', category: 'Cat', stock: 15, unit: 'Pail', status: 'Menipis', price: 285000 },
    { id: 4, sku: 'BAT-MR-004', name: 'Bata Merah Press Jumbo', category: 'Bata', stock: 8000, unit: 'Pcs', status: 'Aman', price: 1200 },
    { id: 5, sku: 'GEN-KR-005', name: 'Genteng Keramik KIA', category: 'Genteng', stock: 45, unit: 'Pcs', status: 'Menipis', price: 12500 },
    { id: 6, sku: 'PAS-BT-006', name: 'Pasir Beton / m3', category: 'Pasir', stock: 0, unit: 'm3', status: 'Habis', price: 250000 },
    { id: 7, sku: 'TRP-12-007', name: 'Triplek 12mm Semi Meranti', category: 'Kayu', stock: 85, unit: 'Lembar', status: 'Aman', price: 165000 },
    { id: 8, sku: 'PKU-05-008', name: 'Paku Kayu 5cm (Box)', category: 'Logam', stock: 200, unit: 'Box', status: 'Aman', price: 45000 },
    { id: 9, sku: 'PIP-WV-009', name: 'Pipa Wavin 3" AW', category: 'Pipa', stock: 8, unit: 'Batang', status: 'Menipis', price: 185000 },
    { id: 10, sku: 'KAY-US-010', name: 'Kayu Usuk 4x6 4m', category: 'Kayu', stock: 0, unit: 'Batang', status: 'Habis', price: 35000 },
];

const pendingOpname = [
    { id: 'OPN-2026-001', date: '30 Mar 2026', requester: 'Budi Santoso', itemsCount: 15, type: 'Bulanan', status: 'Menunggu' },
    { id: 'OPN-2026-002', date: '28 Mar 2026', requester: 'Siti Aminah', itemsCount: 8, type: 'Koreksi', status: 'Menunggu' },
];

export default function StokOwnerPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Semua');
    const [selectedOpname, setSelectedOpname] = useState<any>(null);

    const filteredItems = stockItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'Semua' || item.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-8 w-full max-w-[1600px] mx-auto pb-20 text-left">
            {/* Page Heading & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                            <PackageSearch className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Warehouse & Inventory</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Manajemen Stok</h1>
                    <p className="text-gray-500 font-medium mt-3">Pantau volume persediaan dan setujui penyesuaian stok secara realtime.</p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-500 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-gray-200/20 border border-gray-100 hover:bg-gray-50 transition-all active:scale-95 group">
                        <Download className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                        Export CSV
                    </button>
                    <button className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95 group">
                        <History className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                        Mutasi Stok &rarr;
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <Layers className="w-5 h-5 text-blue-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total SKU</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">124 <span className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Products</span></h3>
                    <div className="w-10 h-1 bg-blue-600 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-yellow-600">Menipis</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">12 <span className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1 text-yellow-600">Urgent</span></h3>
                    <div className="w-10 h-1 bg-yellow-500 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-red-600">Kosong</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">4 <span className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1 text-red-600">Empty</span></h3>
                    <div className="w-10 h-1 bg-red-500 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-emerald-600">Akurasi</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">98.4<span className="text-base text-emerald-600">%</span></h3>
                    <div className="w-10 h-1 bg-emerald-500 rounded-full"></div>
                </div>
            </div>

            {/* Persetujuan Opname Section */}
            <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[.25em]">Persetujuan Opname Terkini</h2>
                        <div className="h-px bg-gray-100 w-32 md:w-64"></div>
                    </div>
                    <span className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-orange-600/20">
                        {pendingOpname.length} Pending Approval
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pendingOpname.map((opn) => (
                        <div key={opn.id} className="bg-white rounded-[40px] border border-gray-100 shadow-xl hover:shadow-2xl hover:border-orange-100 transition-all duration-300 group p-10 relative overflow-hidden text-left flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/30 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="relative z-10 mb-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Clock className="w-7 h-7" />
                                    </div>
                                    <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 uppercase tracking-widest">
                                        {opn.type}
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 leading-none">{opn.id}</p>
                                <h4 className="text-xl font-black text-gray-900 tracking-tight mb-4 group-hover:text-orange-600 transition-colors">Pengajuan: {opn.requester}</h4>
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                    <span className="flex items-center gap-1.5 text-gray-600"><Layers className="w-3.5 h-3.5" /> {opn.itemsCount} Items</span>
                                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                    <span>Diajukan {opn.date}</span>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center gap-3 pt-8 border-t border-gray-50 mt-auto">
                                <button title="Tolak" className="w-12 h-12 bg-white text-gray-400 hover:text-red-500 border border-gray-100 rounded-xl flex items-center justify-center transition-all active:scale-90 hover:border-red-100 hover:shadow-sm">
                                    <X className="w-5 h-5" />
                                </button>
                                <button onClick={() => setSelectedOpname(opn)} title="Lihat Detail" className="flex-1 h-12 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-orange-50 hover:text-orange-600 border border-transparent rounded-xl flex items-center justify-center transition-all active:scale-[0.98]">
                                    Review Data &rarr;
                                </button>
                                <button title="Setujui" className="w-12 h-12 bg-white text-green-500 border border-gray-100 rounded-xl flex items-center justify-center transition-all active:scale-90 hover:bg-green-500 hover:text-white hover:border-green-500 shadow-sm">
                                    <Check className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inventory Navigation & Table */}
            <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[.25em]">Master Data Persediaan Real-time</h2>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </div>

                <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative group/table">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/20 -mr-32 -mt-32 rounded-full blur-3xl opacity-0 group-hover/table:opacity-100 transition-opacity duration-1000"></div>

                    <div className="p-10 border-b border-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-50/20 relative z-10">
                        <div className="relative w-full md:w-96 group/search">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/search:text-orange-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan Nama atau SKU material..."
                                className="w-full pl-14 pr-6 py-4 rounded-full border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none text-sm font-medium transition-all shadow-sm bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:block mr-2">Filter Status:</span>
                            <div className="flex gap-2 w-full md:w-auto">
                                {['Semua', 'Aman', 'Menipis', 'Habis'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${filterStatus === status
                                            ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-600/20'
                                            : 'bg-white text-gray-400 border-gray-100 hover:border-orange-200 hover:text-orange-600'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white">
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identitas Produk</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kategori</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Volume Persediaan</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Status Stok</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right pr-12">Integrasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 border-t border-gray-50/50">
                                {filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-orange-50/30 transition-all duration-300 group/row">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-[20px] bg-gray-50 text-gray-300 flex items-center justify-center shrink-0 border border-gray-100 group-hover/row:border-orange-200 group-hover/row:bg-white transition-all group-hover/row:scale-110">
                                                    <PackageSearch className="w-7 h-7 group-hover/row:text-orange-500 transition-colors" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-gray-900 text-lg tracking-tight leading-none group-hover/row:text-orange-600 transition-colors mb-2">{item.name}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">#{item.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-500 border border-gray-100 group-hover/row:bg-orange-100 group-hover/row:text-orange-600 group-hover/row:border-orange-200 transition-all">
                                                <LayoutGrid className="w-3 h-3" /> {item.category}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex flex-col items-end">
                                                <p className={`text-xl font-black tracking-tight leading-none tabular-nums ${item.status === 'Habis' ? 'text-red-600 underline decoration-2' :
                                                    item.status === 'Menipis' ? 'text-orange-600' : 'text-gray-900'
                                                    }`}>
                                                    {item.stock.toLocaleString()}
                                                </p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5">{item.unit}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border ${item.status === 'Aman' ? 'bg-green-50 text-green-700 border-green-100' :
                                                item.status === 'Menipis' ? 'bg-yellow-50 text-yellow-700 border-yellow-100 outline outline-4 outline-yellow-100/30' :
                                                    'bg-red-50 text-red-700 border-red-100 animate-pulse'
                                                }`}>
                                                <div className={`w-1 h-1 rounded-full ${item.status === 'Aman' ? 'bg-green-600' :
                                                    item.status === 'Menipis' ? 'bg-yellow-600' : 'bg-red-600'
                                                    }`}></div>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right pr-12">
                                            <div className="flex items-center justify-end gap-2 translate-x-4 opacity-0 group-hover/row:translate-x-0 group-hover/row:opacity-100 transition-all duration-300">
                                                <button className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:border-orange-200 active:scale-90 transition-all" title="Detail Stok">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 active:scale-90 transition-all" title="Ubah Parameter">
                                                    <Settings className="w-4 h-4" />
                                                </button>
                                                <button className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-200 active:scale-90 transition-all" title="Tambah Transaksi">
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-gray-50/50 p-8 border-t border-gray-100 flex items-center justify-between relative z-10">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Sinkronisasi Terakhir: Menit ke-{new Date().getMinutes()}</p>
                        <div className="flex items-center gap-8">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page 1 of 12</span>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-xl border border-gray-200 text-gray-400 hover:bg-white hover:text-orange-600 transition-all flex items-center justify-center active:scale-90 disabled:opacity-30" disabled>&larr;</button>
                                <button className="w-10 h-10 rounded-xl border border-orange-100 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center active:scale-90 shadow-sm">&rarr;</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Review Data Opname */}
            {selectedOpname && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Review Opname {selectedOpname.id}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Status: {selectedOpname.status}</p>
                            </div>
                            <button onClick={() => setSelectedOpname(null)} className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">Pengaju</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedOpname.requester}</p>
                                </div>
                                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Tanggal</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedOpname.date}</p>
                                </div>
                                <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                                    <p className="text-[9px] font-black text-green-400 uppercase tracking-widest mb-1">Jenis Mutasi</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedOpname.type}</p>
                                </div>
                                <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                                    <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1">Total Item</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedOpname.itemsCount} SKU</p>
                                </div>
                            </div>
                            
                            {/* Dummy table of changed items */}
                            <h4 className="text-sm font-black text-gray-900 tracking-tight mb-4">Daftar Penyesuaian</h4>
                            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produk</th>
                                            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Sistem</th>
                                            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Fisik</th>
                                            <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Selisih</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        <tr className="hover:bg-gray-50/50">
                                            <td className="px-4 py-3 text-xs font-bold text-gray-900">Semen Tiga Roda 40kg</td>
                                            <td className="px-4 py-3 text-xs text-gray-500 text-center">450</td>
                                            <td className="px-4 py-3 text-xs text-gray-900 font-bold text-center">448</td>
                                            <td className="px-4 py-3 text-xs font-bold text-red-500 text-right">-2</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50/50">
                                            <td className="px-4 py-3 text-xs font-bold text-gray-900">Cat Dulux 5L</td>
                                            <td className="px-4 py-3 text-xs text-gray-500 text-center">15</td>
                                            <td className="px-4 py-3 text-xs text-gray-900 font-bold text-center">15</td>
                                            <td className="px-4 py-3 text-xs font-bold text-green-500 text-right">0</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50/50">
                                            <td className="px-4 py-3 text-xs font-bold text-gray-900">Paku Kayu 5cm (Box)</td>
                                            <td className="px-4 py-3 text-xs text-gray-500 text-center">200</td>
                                            <td className="px-4 py-3 text-xs text-gray-900 font-bold text-center">205</td>
                                            <td className="px-4 py-3 text-xs font-bold text-green-500 text-right">+5</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-[32px]">
                            <button onClick={() => setSelectedOpname(null)} className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                                Tutup
                            </button>
                            <button onClick={() => { alert('Opname disetujui!'); setSelectedOpname(null); }} className="px-6 py-3 bg-[#03AC0E] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#03990D] shadow-lg shadow-green-600/30 transition-all active:scale-95">
                                Setujui Opname
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Sub-component stub for LayoutGrid and Settings which might be needed
import { LayoutGrid, Settings } from 'lucide-react';
