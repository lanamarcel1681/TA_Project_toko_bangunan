'use client';
import React, { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, PackagePlus, User, Clock,
    ArrowRight, Check, X, Eye, FileSearch, Activity,
    Loader2, Package, Tag, DollarSign, Calendar, FileText
} from 'lucide-react';

interface UsulanBarang {
    id_usulan_barang: number;
    nama_barang_usulan: string;
    deskripsi_usulan: string;
    tanggal_usulan: string;
    status_usulan: string;
    harga_beli_perkiraan: number;
    harga_jual_perkiraan: number;
    kategori: { nama_kategori: string };
    pegawai: { nama_pegawai: string };
}

export default function PersetujuanBarangPage() {
    const [suggestions, setSuggestions] = useState<UsulanBarang[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedItem, setSelectedItem] = useState<UsulanBarang | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/usulan-barang');
            const data = await res.json();
            setSuggestions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (id: number, status: 'Approved' | 'Rejected') => {
        setIsRefreshing(true);
        try {
            const res = await fetch(`/api/usulan-barang/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status_usulan: status })
            });

            if (res.ok) {
                fetchData();
                setIsModalOpen(false);
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (error) {
            alert('Terjadi kesalahan jaringan');
        } finally {
            setIsRefreshing(false);
        }
    };

    const pendingItems = suggestions.filter(item => item.status_usulan === 'Pending');
    const historyItems = suggestions.filter(item => item.status_usulan !== 'Pending');

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            {/* Page Heading */}
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
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
                    ) : (
                        <span className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-orange-600/20">
                            {pendingItems.length} Menunggu Keputusan
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pendingItems.length === 0 && !isLoading ? (
                        <div className="col-span-full py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 text-center text-gray-400 font-bold">
                            Tidak ada antrian usulan barang saat ini.
                        </div>
                    ) : pendingItems.map(item => (
                        <div key={item.id_usulan_barang} className="bg-white rounded-[40px] border border-gray-100 shadow-xl hover:shadow-2xl hover:border-orange-100 transition-all duration-300 group p-10 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/30 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative z-10 mb-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <Clock className="w-7 h-7" />
                                    </div>
                                    <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 uppercase tracking-widest">
                                        Status: {item.status_usulan}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-orange-600 transition-colors">{item.nama_barang_usulan}</h3>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">SUP-{String(item.id_usulan_barang).padStart(3, '0')}</p>
                                </div>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="w-3.5 h-3.5 text-gray-400" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Diusulkan oleh: <span className="text-gray-900">{item.pegawai.nama_pegawai}</span></p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
                                    <p className="text-xs font-bold text-gray-500 italic leading-relaxed line-clamp-2">"{item.deskripsi_usulan || 'Tidak ada deskripsi'}"</p>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center gap-3 pt-6 border-t border-gray-50">
                                <button 
                                    onClick={() => handleStatusUpdate(item.id_usulan_barang, 'Rejected')}
                                    className="w-12 h-12 bg-white text-gray-400 hover:text-red-500 border border-gray-100 rounded-xl flex items-center justify-center transition-all active:scale-95 hover:border-red-100 hover:shadow-sm group/btn"
                                >
                                    <X className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
                                </button>
                                <button 
                                    onClick={() => {
                                        setSelectedItem(item);
                                        setIsModalOpen(true);
                                    }}
                                    className="flex-1 h-12 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-orange-50 hover:text-orange-600 border border-transparent rounded-xl flex items-center justify-center transition-all active:scale-[0.98]"
                                >
                                    Review Spek &rarr;
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(item.id_usulan_barang, 'Approved')}
                                    className="w-12 h-12 bg-white text-green-500 border border-gray-100 rounded-xl flex items-center justify-center transition-all active:scale-95 hover:bg-green-500 hover:text-white hover:border-green-500 shadow-sm group/btn"
                                >
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
                                {historyItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-10 text-center font-bold text-gray-400">Belum ada riwayat keputusan.</td>
                                    </tr>
                                ) : historyItems.map((row) => (
                                    <tr key={row.id_usulan_barang} className="hover:bg-orange-50/30 transition-all duration-300 group/row">
                                        <td className="px-10 py-6">
                                            <p className="font-black text-gray-900 text-sm tracking-tight mb-1">{row.nama_barang_usulan}</p>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">SUP-{String(row.id_usulan_barang).padStart(3, '0')}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <p className="text-xs font-bold text-gray-600">{row.pegawai.nama_pegawai}</p>
                                        </td>
                                        <td className="px-10 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                                            {new Date(row.tanggal_usulan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                row.status_usulan === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                                <div className={`w-1 h-1 rounded-full ${row.status_usulan === 'Approved' ? 'bg-emerald-600' : 'bg-red-600'}`}></div>
                                                {row.status_usulan}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right pr-12">
                                            <button 
                                                onClick={() => {
                                                    setSelectedItem(row);
                                                    setIsModalOpen(true);
                                                }}
                                                className="w-10 h-10 bg-white text-gray-400 hover:text-orange-600 border border-gray-100 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-90"
                                            >
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

            {/* Review Modal */}
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] text-left">
                        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-600 text-white rounded-2xl">
                                    <FileSearch className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">Review Detail Usulan</h3>
                                    <p className="text-xs font-black text-gray-400 tracking-widest uppercase mt-1">Spesifikasi teknis & Verifikasi Harga</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-xl">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Barang</p>
                                    <p className="font-black text-gray-900 text-lg">{selectedItem.nama_barang_usulan}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kategori</p>
                                    <p className="font-bold text-gray-600">{selectedItem.kategori.nama_kategori}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Harga Beli</p>
                                    <p className="font-black text-blue-600 text-xl">Rp {selectedItem.harga_beli_perkiraan.toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Harga Jual</p>
                                    <p className="font-black text-gray-900 text-xl text-orange-600">Rp {selectedItem.harga_jual_perkiraan.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Deskripsi & Justifikasi</p>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-gray-600 font-bold leading-relaxed italic">
                                    "{selectedItem.deskripsi_usulan || 'Tidak ada deskripsi tambahan.'}"
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                <User className="w-5 h-5 text-blue-500" />
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    Diusulkan oleh <span className="text-blue-600">{selectedItem.pegawai.nama_pegawai}</span> pada {new Date(selectedItem.tanggal_usulan).toLocaleDateString('id-ID')}
                                </div>
                            </div>
                        </div>

                        {selectedItem.status_usulan === 'Pending' && (
                            <div className="p-10 pt-0 flex gap-4">
                                <button 
                                    onClick={() => handleStatusUpdate(selectedItem.id_usulan_barang, 'Rejected')}
                                    disabled={isRefreshing}
                                    className="flex-1 py-4 bg-red-50 text-red-600 font-black text-[11px] uppercase tracking-widest rounded-full hover:bg-red-600 hover:text-white transition-all active:scale-[0.98] border border-red-100 flex items-center justify-center gap-3"
                                >
                                    Tolak Usulan <X className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(selectedItem.id_usulan_barang, 'Approved')}
                                    disabled={isRefreshing}
                                    className="flex-1 py-4 bg-green-600 text-white font-black text-[11px] uppercase tracking-widest rounded-full hover:bg-green-700 transition-all active:scale-[0.98] shadow-lg shadow-green-600/20 flex items-center justify-center gap-3"
                                >
                                    Setujui & Tambah <Check className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
