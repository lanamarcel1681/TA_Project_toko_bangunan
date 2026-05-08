'use client';
import React, { useState, useEffect } from 'react';
import {
    ClipboardList, Send, Package, AlertCircle,
    Loader2, CheckCircle2, X, RefreshCw, Search
} from 'lucide-react';

interface Barang {
    id_barang: number;
    nama_barang: string;
    stok_barang: number;
    kategori: { nama_kategori: string };
    satuan: { satuan_barang: string };
}

interface AuditItem {
    id_barang: number;
    nama_barang: string;
    kategori: string;
    stok_sistem: number;
    stok_fisik: number;
    keterangan: string;
    satuan: string;
}

interface StokOpnameHistory {
    id_opname: number;
    tanggal_opname: string;
    status_dokumen: string;
    catatan_pengiriman: string;
    detail_opname: {
        id_detail_opname: number;
        stok_fisik: number;
        selisih: number;
        keterangan_temuan: string;
        barang: {
            nama_barang: string;
            satuan: { satuan_barang: string };
        };
    }[];
}

export default function StockOpnameKaryawanPage() {
    const [items, setItems] = useState<AuditItem[]>([]);
    const [historyItems, setHistoryItems] = useState<StokOpnameHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<StokOpnameHistory | null>(null);

    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const handleToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastMsg(msg);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
    };

    const fetchBarang = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/barang');
            const data: Barang[] = await res.json();

            const auditItems: AuditItem[] = data.map(b => ({
                id_barang: b.id_barang,
                nama_barang: b.nama_barang,
                kategori: b.kategori?.nama_kategori || 'Tanpa Kategori',
                stok_sistem: b.stok_barang,
                stok_fisik: 0,
                keterangan: '',
                satuan: b.satuan?.satuan_barang || 'Unit'
            }));

            setItems(auditItems);
        } catch (error) {
            console.error('Error fetching barang:', error);
            handleToast('Gagal memuat data barang', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const res = await fetch('/api/stok-opname');
            const data = await res.json();
            setHistoryItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchBarang();
        fetchHistory();
    }, []);

    const handlePhysicalStockChange = (id: number, val: string) => {
        const parsed = parseInt(val) || 0;
        const clamped = Math.max(0, parsed);
        setItems(prev => prev.map(item =>
            item.id_barang === id ? { ...item, stok_fisik: clamped } : item
        ));
    };

    const handleKeteranganChange = (id: number, val: string) => {
        setItems(prev => prev.map(item =>
            item.id_barang === id ? { ...item, keterangan: val } : item
        ));
    };

    const handleSubmit = async () => {
        if (items.length === 0) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/stok-opname', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(it => ({
                        id_barang: it.id_barang,
                        stok_fisik: it.stok_fisik,
                        keterangan_temuan: it.keterangan
                    }))
                })
            });

            if (res.ok) {
                handleToast('Laporan Stock Opname berhasil dikirim ke Owner!');
                setSubmitted(true);
                setItems([]);
                fetchHistory(); // Refresh history after submission
            } else {
                const err = await res.json();
                handleToast(`Error: ${err.error}`, 'error');
            }
        } catch (error) {
            handleToast('Gagal mengirim laporan audit', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredItems = items.filter(item =>
        item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20 text-left relative">
            {/* Premium Toast */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <div className={`backdrop-blur-xl border border-white/10 px-8 py-5 rounded-[28px] shadow-2xl flex items-center gap-5 text-white ${toastType === 'success' ? 'bg-gray-900/90' : 'bg-red-900/90'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${toastType === 'success' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                            {toastType === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">
                                {toastType === 'success' ? 'Berhasil' : 'Perhatian'}
                            </p>
                            <p className="text-sm font-bold">{toastMsg}</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="ml-6 p-2 rounded-2xl">
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Audit Stock Opname</h1>
                    <p className="text-gray-500 font-medium">Verifikasi kesesuaian fisik stok barang dengan database sistem secara berkala.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:flex-none">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari Barang..."
                            className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-full focus:border-blue-500 outline-none w-full md:w-64 font-bold text-sm text-gray-800 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={items.length === 0 || isSubmitting || submitted}
                        className={`px-8 py-3 rounded-full flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.1em] transition-all outline-none whitespace-nowrap shadow-lg ${items.length === 0 || isSubmitting || submitted
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-95'
                            }`}
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {submitted ? 'Audit Dikirim' : 'Kirim ke Owner '}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden mb-16">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest w-32">ID Produk</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-left">Informasi Barang</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-center">Stok Sistem</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-center">Stok Fisik</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest">Keterangan / Temuan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-left">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center font-bold text-gray-400">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-6 h-6 animate-spin text-blue-500" /> Memuat katalog barang...
                                        </div>
                                    </td>
                                </tr>
                            ) : submitted ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-gray-500 font-black">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-[32px] flex items-center justify-center shadow-lg shadow-green-600/10">
                                                <CheckCircle2 className="w-10 h-10" />
                                            </div>
                                            <div className="max-w-md">
                                                <h3 className="text-xl mb-2">Audit Berhasil Dikirim!</h3>
                                                <p className="text-sm text-gray-400 font-bold">Laporan sinkronisasi stok fisik telah diteruskan ke dashboard owner untuk verifikasi lebih lanjut.</p>
                                            </div>
                                            <button
                                                onClick={() => { setSubmitted(false); fetchBarang(); }}
                                                className="mt-4 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
                                            >
                                                <RefreshCw className="w-4 h-4" /> Audit Baru
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-bold">
                                        Tidak ada barang ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id_barang} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/40"></div>
                                                <span className="text-sm font-black text-gray-400 font-mono tracking-tighter">PRD-{String(item.id_barang).padStart(3, '0')}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-left">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                    <Package className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-800 text-sm leading-none mb-1 capitalize">{item.nama_barang}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.kategori}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl font-black text-gray-700 text-sm inline-flex items-center gap-1">
                                                {item.stok_sistem} <span className="text-[10px] text-gray-400 uppercase"></span>
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="relative inline-block">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.stok_fisik}
                                                    onChange={(e) => handlePhysicalStockChange(item.id_barang, e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                                                    className="w-24 text-center pl-4 pr-10 py-2.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none font-black text-gray-800 transition-all shadow-sm"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Catatan temuan..."
                                                    value={item.keterangan}
                                                    onChange={(e) => handleKeteranganChange(item.id_barang, e.target.value)}
                                                    className="w-full px-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:border-blue-500 outline-none font-medium text-gray-700 transition-all placeholder:text-gray-300 shadow-sm"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-8 bg-blue-50/50 border-t border-blue-100/50 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-center">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <p className="text-[11px] font-black text-blue-700 uppercase tracking-widest mb-0.5 leading-none">Peringatan Audit</p>
                            <p className="text-xs font-bold text-blue-900/60 leading-none">Pastikan data fisik telah diperiksa secara manual sebelum sinkronisasi data.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Riwayat Section */}
            <div>
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[.25em]">Riwayat Audit Terkirim</h2>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </div>

                <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sesi Audit</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Jumlah Item</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right pr-12">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoadingHistory ? (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-10 text-center font-bold text-gray-400">
                                            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                                            Memuat riwayat...
                                        </td>
                                    </tr>
                                ) : historyItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-10 text-center font-bold text-gray-400">Belum ada riwayat audit.</td>
                                    </tr>
                                ) : historyItems.map((history) => (
                                    <tr key={history.id_opname} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-10 py-6">
                                            <p className="font-black text-gray-900 text-sm tracking-tight mb-1">
                                                {new Date(history.tanggal_opname).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">ID #{history.id_opname}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-xs font-bold text-gray-600">{history.detail_opname.length} Item Audited</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                history.status_dokumen === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                                history.status_dokumen === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                'bg-orange-50 text-orange-700 border-orange-100 shadow-sm shadow-orange-500/10 animate-pulse'
                                            }`}>
                                                <div className={`w-1 h-1 rounded-full ${
                                                    history.status_dokumen === 'Approved' ? 'bg-green-600' :
                                                    history.status_dokumen === 'Rejected' ? 'bg-red-600' : 'bg-orange-600'
                                                }`}></div>
                                                {history.status_dokumen}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right pr-12">
                                            <button
                                                onClick={() => setSelectedHistory(history)}
                                                className="px-6 py-2 bg-gray-50 text-gray-400 hover:text-blue-600 border border-gray-100 rounded-full text-[9px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Lihat Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detail History Modal */}
            {selectedHistory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setSelectedHistory(null)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 leading-tight">Detail Laporan Audit</h3>
                                <p className="text-xs font-black text-gray-400 tracking-widest uppercase mt-1">
                                    {new Date(selectedHistory.tanggal_opname).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <button onClick={() => setSelectedHistory(null)} className="text-gray-400 hover:text-gray-600 transition-colors bg-white p-2 rounded-2xl border border-gray-100">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-10">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Informasi Barang</th>
                                        <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Fisik</th>
                                        <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Selisih</th>
                                        <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Temuan Lapangan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {selectedHistory.detail_opname.map((detail) => (
                                        <tr key={detail.id_detail_opname} className="group">
                                            <td className="py-6">
                                                <p className="font-black text-gray-900 text-sm">{detail.barang.nama_barang}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{detail.barang.satuan.satuan_barang}</p>
                                            </td>
                                            <td className="py-6 text-center">
                                                <span className="font-black text-gray-900">{detail.stok_fisik}</span>
                                            </td>
                                            <td className="py-6 text-center text-sm font-black">
                                                <span className={detail.selisih < 0 ? 'text-red-500' : detail.selisih > 0 ? 'text-green-500' : 'text-gray-400'}>
                                                    {detail.selisih > 0 ? `+${detail.selisih}` : detail.selisih}
                                                </span>
                                            </td>
                                            <td className="py-6 text-xs text-gray-500 font-bold italic">
                                                {detail.keterangan_temuan || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
