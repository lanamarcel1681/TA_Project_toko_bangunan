'use client';
import React from 'react';
import {
    CheckCircle, XCircle, PackagePlus, User, Clock,
    ArrowRight, Check, X, Eye, FileSearch, Activity
} from 'lucide-react';

export default function PersetujuanBarangPage() {
    const pendingItems = [1, 2, 3];

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            {/* Page Heading & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                            <PackagePlus className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Product Verification Gateway</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Persetujuan Usulan Barang</h1>
                    <p className="text-gray-500 font-medium mt-3">Validasi dan setujui katalog barang baru yang diajukan oleh tim operasional gudang.</p>
                </div>
            </div>

            {/* Pending Approvals Section */}
            <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[.25em]">Antrian Verifikasi Aktif</h2>
                        <div className="h-px bg-gray-100 w-32 md:w-64"></div>
                    </div>
                    <span className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-orange-600/20">
                        {pendingItems.length} Menunggu Keputusan
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pendingItems.map(item => (
                        <div key={item} className="bg-white rounded-[40px] border border-gray-100 shadow-xl hover:shadow-2xl hover:border-orange-100 transition-all duration-300 group p-10 relative overflow-hidden flex flex-col justify-between">
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/30 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative z-10 mb-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <Clock className="w-7 h-7" />
                                    </div>
                                    <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 uppercase tracking-widest">
                                        Status: Pending
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2 group-hover:text-orange-600 transition-colors">Semen Putih {item}0kg</h3>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="w-3.5 h-3.5 text-gray-400" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Diusulkan oleh: <span className="text-gray-900">Budi (Gudang)</span></p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
                                    <p className="text-xs font-bold text-gray-500 italic leading-relaxed">"Penambahan stok untuk kebutuhan proyek renovasi retail bulan depan."</p>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center gap-3 pt-6 border-t border-gray-50">
                                <button className="w-12 h-12 bg-white text-gray-400 hover:text-red-500 border border-gray-100 rounded-xl flex items-center justify-center transition-all active:scale-95 hover:border-red-100 hover:shadow-sm group/btn">
                                    <X className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
                                </button>
                                <button className="flex-1 h-12 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-orange-50 hover:text-orange-600 border border-transparent rounded-xl flex items-center justify-center transition-all active:scale-[0.98]">
                                    Review Spek &rarr;
                                </button>
                                <button className="w-12 h-12 bg-white text-green-500 border border-gray-100 rounded-xl flex items-center justify-center transition-all active:scale-95 hover:bg-green-500 hover:text-white hover:border-green-500 shadow-sm group/btn">
                                    <Check className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Riwayat Persetujuan */}
            <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[.25em]">Riwayat Keputusan Katalog</h2>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </div>

                <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden relative group/history">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/20 -mr-32 -mt-32 rounded-full blur-3xl opacity-0 group-hover/history:opacity-100 transition-opacity duration-1000"></div>

                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Produk & ID Request</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pemohon Operasional</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tanggal</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Keputusan Akhir</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right pr-12">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[
                                    { id: 'REQ-088', name: 'Besi Beton 12mm SNI', requester: 'Siti (Gudang)', date: '30 Mar 2026', status: 'Approved' },
                                    { id: 'REQ-087', name: 'Cat Dulux Gloss 5L', requester: 'Budi (Sales)', date: '29 Mar 2026', status: 'Rejected' },
                                    { id: 'REQ-086', name: 'Paku Kayu 3 Inch', requester: 'Andi (Gudang)', date: '28 Mar 2026', status: 'Approved' },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-orange-50/30 transition-all duration-300 group/row">
                                        <td className="px-10 py-6">
                                            <p className="font-black text-gray-900 text-sm tracking-tight mb-1">{row.name}</p>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">#{row.id}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <p className="text-xs font-bold text-gray-600">{row.requester}</p>
                                        </td>
                                        <td className="px-10 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                                            {row.date}
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${row.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                                                }`}>
                                                <div className={`w-1 h-1 rounded-full ${row.status === 'Approved' ? 'bg-emerald-600' : 'bg-red-600'}`}></div>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right pr-12">
                                            <button className="w-10 h-10 bg-white text-gray-400 hover:text-orange-600 border border-gray-100 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-90">
                                                <Eye className="w-4.5 h-4.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
