'use client';
import React, { useState, useEffect } from 'react';
import {
    PackageSearch, AlertTriangle, CheckCircle2, Clock, Search, Filter,
    ArrowUpRight, ArrowDownRight, MoreVertical, Check, X,
    Layers, Inbox, History, Download, TrendingDown, ArrowRight, Save, Trash2, Package, Plus, LayoutGrid, Settings, Loader2, AlertCircle, RefreshCw, Eye
} from 'lucide-react';

interface Barang {
    id_barang: number;
    nama_barang: string;
    stok_barang: number;
    kategori: { nama_kategori: string };
    satuan: { satuan_barang: string };
    harga_barang: number;
}

interface StokOpname {
    id_opname: number;
    tanggal_opname: string;
    status_dokumen: string;
    catatan_pengiriman: string;
    pegawai: { nama_pegawai: string };
    detail_opname: {
        id_detail_opname: number;
        id_barang: number;
        stok_fisik: number;
        selisih: number;
        keterangan_temuan: string;
        barang: {
            nama_barang: string;
            stok_barang: number;
            satuan: { satuan_barang: string };
        };
    }[];
}

import { useToast } from '@/app/components/Toast';

export default function StokOwnerPage() {
    const { showToast } = useToast();
    const [stockItems, setStockItems] = useState<Barang[]>([]);
    const [pendingOpname, setPendingOpname] = useState<StokOpname[]>([]);
    const [historyOpname, setHistoryOpname] = useState<StokOpname[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingAudit, setIsLoadingAudit] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Semua');
    const [selectedOpname, setSelectedOpname] = useState<StokOpname | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Confirmation Modal states
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmType, setConfirmType] = useState<'Approved' | 'Rejected' | null>(null);
    const [targetOpname, setTargetOpname] = useState<StokOpname | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setIsLoadingAudit(true);
        try {
            const [barangRes, auditRes] = await Promise.all([
                fetch('/api/barang'),
                fetch('/api/stok-opname')
            ]);

            const bData = await barangRes.json();
            const aData = await auditRes.json();

            setStockItems(Array.isArray(bData) ? bData : []);
            if (Array.isArray(aData)) {
                setPendingOpname(aData.filter((a: any) => a.status_dokumen === "Pending Review"));
                setHistoryOpname(aData.filter((a: any) => a.status_dokumen !== "Pending Review"));
            } else {
                setPendingOpname([]);
                setHistoryOpname([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showToast('Gagal memuat data inventaris', 'error');
        } finally {
            setIsLoading(false);
            setIsLoadingAudit(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = async (id: number, status: 'Approved' | 'Rejected') => {
        setIsActionLoading(true);
        try {
            const res = await fetch(`/api/stok-opname/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                const message = status === 'Approved' 
                    ? 'Audit Stok berhasil disetujui! Stok telah diperbarui.' 
                    : 'Audit Stok telah ditolak.';
                showToast(message, 'success');
                setSelectedOpname(null);
                setShowConfirmModal(false);
                fetchData(); // Refresh everything
            } else {
                const err = await res.json();
                showToast(`Gagal: ${err.error}${err.details ? ` (${err.details})` : ''}`, 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan sistem saat memproses audit', 'error');
        } finally {
            setIsActionLoading(false);
        }
    };

    const getStatus = (stock: number) => {
        if (stock === 0) return 'Habis';
        if (stock < 20) return 'Menipis';
        return 'Aman';
    };

    const filteredItems = stockItems.filter(item => {
        const matchesSearch = item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase());
        const status = getStatus(item.stok_barang);
        const matchesFilter = filterStatus === 'Semua' || status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: stockItems.length,
        urgent: stockItems.filter(i => i.stok_barang > 0 && i.stok_barang < 20).length,
        empty: stockItems.filter(i => i.stok_barang === 0).length,
        accuracy: 98.4 // Mocked for now
    };

    return (
        <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto pb-20 text-left relative">
            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 rotate-12 group hover:rotate-0 transition-transform ${confirmType === 'Approved' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                            {confirmType === 'Approved' ? <CheckCircle2 className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                            {confirmType === 'Approved' ? 'Setujui Audit?' : 'Tolak Audit?'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            {confirmType === 'Approved' 
                                ? 'Menyetujui audit akan memperbarui stok database sesuai dengan stok fisik yang dilaporkan.' 
                                : 'Menolak audit akan membatalkan pengajuan ini tanpa mengubah data stok.'}
                        </p>
                        
                        <div className="flex flex-col w-full gap-3">
                            <button 
                                onClick={() => handleAction(targetOpname!.id_opname, confirmType!)}
                                disabled={isActionLoading}
                                className={`w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 ${confirmType === 'Approved' ? 'bg-green-600 shadow-green-600/20 hover:bg-green-700' : 'bg-red-600 shadow-red-600/20 hover:bg-red-700'}`}
                            >
                                {isActionLoading ? 'Memproses...' : confirmType === 'Approved' ? 'Ya, Setujui & Update' : 'Ya, Tolak Pengajuan'}
                            </button>
                            <button 
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setConfirmType(null);
                                    setTargetOpname(null);
                                }}
                                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Heading & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                            <PackageSearch className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Warehouse & Inventory</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                        <p className="text-gray-500 font-medium">Pantau volume persediaan dan setujui penyesuaian stok secara realtime.</p>
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Access: Owner Dashboard</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-500 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-gray-200/20 border border-gray-100 hover:bg-gray-50 transition-all active:scale-95 group">
                        <Download className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                        Export CSV
                    </button>
                    <button onClick={fetchData} className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-500 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-gray-200/20 border border-gray-100 hover:bg-gray-50 transition-all active:scale-95 group">
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading || isLoadingAudit ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        Refresh Data
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
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{stats.total} <span className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Products</span></h3>
                    <div className="w-10 h-1 bg-blue-600 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-yellow-600">Menipis</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{stats.urgent} <span className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1 text-yellow-600">Urgent</span></h3>
                    <div className="w-10 h-1 bg-yellow-500 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-red-600">Kosong</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{stats.empty} <span className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1 text-red-600">Empty</span></h3>
                    <div className="w-10 h-1 bg-red-500 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-emerald-600">Akurasi</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{stats.accuracy}<span className="text-base text-emerald-600">%</span></h3>
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

                {isLoadingAudit ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400 font-bold gap-3">
                        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                        Memeriksa pengajuan karyawan...
                    </div>
                ) : pendingOpname.length === 0 ? (
                    <div className="py-20 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 group">
                        <Inbox className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform opacity-20" />
                        <p className="font-black text-[10px] uppercase tracking-widest">Tidak ada pengajuan audit pending.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pendingOpname.map((opn) => (
                            <div key={opn.id_opname} className="bg-white rounded-[40px] border border-gray-100 shadow-xl hover:shadow-2xl hover:border-orange-100 transition-all duration-300 group p-10 relative overflow-hidden text-left flex flex-col justify-between">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/30 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="relative z-10 mb-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Clock className="w-7 h-7" />
                                        </div>
                                        <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 uppercase tracking-widest">
                                            {opn.status_dokumen}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 leading-none">ID #{opn.id_opname}</p>
                                    <h4 className="text-xl font-black text-gray-900 tracking-tight mb-4 group-hover:text-orange-600 transition-colors">Pengaju: {opn.pegawai?.nama_pegawai || 'Pegawai Tidak Terdaftar'}</h4>
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                        <span className="flex items-center gap-1.5 text-gray-600"><Layers className="w-3.5 h-3.5" /> {opn.detail_opname?.length || 0} Items</span>
                                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                        <span>{opn.tanggal_opname ? new Date(opn.tanggal_opname).toLocaleDateString() : '-'}</span>
                                    </div>
                                </div>

                                <div className="relative z-10 flex items-center gap-3 pt-8 border-t border-gray-50 mt-auto">
                                    <button
                                        onClick={() => {
                                            setConfirmType('Rejected');
                                            setTargetOpname(opn);
                                            setShowConfirmModal(true);
                                        }}
                                        title="Tolak"
                                        className="w-12 h-12 bg-white text-gray-400 hover:text-red-500 border border-gray-100 rounded-xl flex items-center justify-center transition-all active:scale-90 hover:border-red-100 hover:shadow-sm"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setSelectedOpname(opn)} title="Lihat Detail" className="flex-1 h-12 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-orange-50 hover:text-orange-600 border border-transparent rounded-xl flex items-center justify-center transition-all active:scale-[0.98]">
                                        Review Data &rarr;
                                    </button>
                                    <button
                                        onClick={() => {
                                            setConfirmType('Approved');
                                            setTargetOpname(opn);
                                            setShowConfirmModal(true);
                                        }}
                                        title="Setujui"
                                        className="w-12 h-12 bg-white text-green-500 border border-gray-100 rounded-xl flex items-center justify-center transition-all active:scale-90 hover:bg-green-500 hover:text-white hover:border-green-500 shadow-sm"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Riwayat Opname Section */}
            <div className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[.25em]">Riwayat Opname Selesai</h2>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </div>

                <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ID Audit</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Karyawan</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tanggal</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right pr-12">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoadingAudit ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-10 text-center text-gray-400 font-bold">
                                            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-orange-500" />
                                            Memuat riwayat...
                                        </td>
                                    </tr>
                                ) : historyOpname.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-12 text-center text-gray-400 font-bold italic">
                                            Belum ada riwayat audit yang selesai.
                                        </td>
                                    </tr>
                                ) : (
                                    historyOpname.map((history) => (
                                        <tr key={history.id_opname} className="hover:bg-gray-50/30 transition-all">
                                            <td className="px-10 py-6 font-black text-gray-900 text-sm italic">#OPN-{history.id_opname}</td>
                                            <td className="px-10 py-6 text-sm font-bold text-gray-600">{history.pegawai?.nama_pegawai || 'Data Pegawai Hilang'}</td>
                                            <td className="px-10 py-6 text-xs font-medium text-gray-500">{history.tanggal_opname ? new Date(history.tanggal_opname).toLocaleString('id-ID') : '-'}</td>
                                            <td className="px-10 py-6">
                                                <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${history.status_dokumen === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                                        history.status_dokumen === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                            'bg-gray-50 text-gray-700 border-gray-100'
                                                    }`}>
                                                    {history.status_dokumen}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-right pr-12">
                                                <button onClick={() => setSelectedOpname(history)} className="text-gray-400 hover:text-orange-600 transition-colors">
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
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
                                placeholder="Cari material..."
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
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right pr-12">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 border-t border-gray-50/50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center text-gray-400 font-bold">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-orange-500" /> Memuat data...
                                        </td>
                                    </tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-12 text-center text-gray-400">Tidak ada produk ditemukan.</td>
                                    </tr>
                                ) : filteredItems.map((item) => (
                                    <tr key={item.id_barang} className="hover:bg-orange-50/30 transition-all duration-300 group/row">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-[20px] bg-gray-50 text-gray-300 flex items-center justify-center shrink-0 border border-gray-100 group-hover/row:border-orange-200 group-hover/row:bg-white transition-all group-hover/row:scale-110">
                                                    <PackageSearch className="w-7 h-7 group-hover/row:text-orange-500 transition-colors" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-gray-900 text-lg tracking-tight leading-none group-hover/row:text-orange-600 transition-colors mb-2">{item.nama_barang}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">PRD-{String(item.id_barang).padStart(3, '0')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-500 border border-gray-100 group-hover/row:bg-orange-100 group-hover/row:text-orange-600 group-hover/row:border-orange-200 transition-all">
                                                <LayoutGrid className="w-3 h-3" /> {item.kategori.nama_kategori}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex flex-col items-end">
                                                <p className={`text-xl font-black tracking-tight leading-none tabular-nums ${getStatus(item.stok_barang) === 'Habis' ? 'text-red-600 underline decoration-2' :
                                                    getStatus(item.stok_barang) === 'Menipis' ? 'text-orange-600' : 'text-gray-900'
                                                    }`}>
                                                    {item.stok_barang.toLocaleString()}
                                                </p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5">{item.satuan.satuan_barang}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatus(item.stok_barang) === 'Aman' ? 'bg-green-50 text-green-700 border-green-100' :
                                                getStatus(item.stok_barang) === 'Menipis' ? 'bg-yellow-50 text-yellow-700 border-yellow-100 outline outline-4 outline-yellow-100/30' :
                                                    'bg-red-50 text-red-700 border-red-100 animate-pulse'
                                                }`}>
                                                <div className={`w-1 h-1 rounded-full ${getStatus(item.stok_barang) === 'Aman' ? 'bg-green-600' :
                                                    getStatus(item.stok_barang) === 'Menipis' ? 'bg-yellow-600' : 'bg-red-600'
                                                    }`}></div>
                                                {getStatus(item.stok_barang)}
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Review Data Opname */}
            {selectedOpname && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                        <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Review Opname #{selectedOpname.id_opname}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Diajukan oleh: {selectedOpname.pegawai.nama_pegawai}</p>
                            </div>
                            <button onClick={() => setSelectedOpname(null)} className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-10 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6 mb-10 text-left">
                                <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100">
                                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2">Tanggal Pengiriman</p>
                                    <p className="text-sm font-black text-gray-900">{new Date(selectedOpname.tanggal_opname).toLocaleDateString()}</p>
                                </div>
                                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Catatan Karyawan</p>
                                    <p className="text-sm font-bold text-gray-600 line-clamp-1">{selectedOpname.catatan_pengiriman || "Tidak ada catatan."}</p>
                                </div>
                            </div>

                            <h4 className="text-sm font-black text-gray-900 tracking-tight mb-4 text-left">Daftar Penyesuaian Audit</h4>
                            <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produk</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Database</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Fisik</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Selisih</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {selectedOpname.detail_opname.map((detail) => (
                                            <tr key={detail.id_detail_opname} className="hover:bg-gray-50/30">
                                                <td className="px-6 py-4">
                                                    <p className="text-xs font-black text-gray-900 mb-0.5">{detail.barang.nama_barang}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase">{detail.barang.satuan.satuan_barang}</p>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-bold text-gray-400 text-center">{detail.barang.stok_barang}</td>
                                                <td className="px-6 py-4 text-xs text-gray-900 font-black text-center">{detail.stok_fisik}</td>
                                                <td className="px-6 py-4 text-xs font-black text-right">
                                                    <span className={detail.selisih < 0 ? 'text-red-500' : detail.selisih > 0 ? 'text-green-500' : 'text-gray-300'}>
                                                        {detail.selisih > 0 ? `+${detail.selisih}` : detail.selisih}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4 rounded-b-[40px]">
                            <button
                                disabled={isActionLoading}
                                onClick={() => setSelectedOpname(null)}
                                className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all shadow-sm active:scale-95"
                            >
                                Tutup
                            </button>
                            <button
                                disabled={isActionLoading}
                                onClick={() => {
                                    setConfirmType('Approved');
                                    setTargetOpname(selectedOpname);
                                    setShowConfirmModal(true);
                                }}
                                className="px-8 py-3 bg-[#03AC0E] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#03990D] shadow-lg shadow-green-600/30 transition-all active:scale-95 flex items-center gap-2"
                            >
                                {isActionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                Setujui & Update Stok
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
