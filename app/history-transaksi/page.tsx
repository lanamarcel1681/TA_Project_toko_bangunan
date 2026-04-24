'use client';
import React, { useState, useEffect } from 'react';
import { Mail, MapPin, ShoppingBag, ChevronRight, Package, Clock, PackageOpen, FileImage, ArrowLeft, MessageSquare, ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function HistoryTransaksiPage() {
    const [purchaseStatus, setPurchaseStatus] = useState('Semua');
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Cancel & Return States
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [returnReason, setReturnReason] = useState('');
    const [returnPhoto, setReturnPhoto] = useState('');
    const [bankInfo, setBankInfo] = useState('');
    const [processing, setProcessing] = useState(false);

    const purchaseTabs = ['Semua', 'Verifikasi Pembayaran', 'Disiapkan', 'Dikirim', 'Selesai', 'Batal/Retur'];

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/user/transaksi/history');
            const data = await res.json();
            if (data.success) {
                setTransactions(data.data);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const getFilteredTransactions = () => {
        if (purchaseStatus === 'Semua') return transactions;
        if (purchaseStatus === 'Verifikasi Pembayaran') return transactions.filter(t => t.status_penjualan === 'Menunggu Verifikasi Pembayaran');
        if (purchaseStatus === 'Disiapkan') return transactions.filter(t =>
            ['Diverifikasi (Lunas)', 'Menunggu Pengemasan', 'Siap Diambil'].includes(t.status_penjualan)
        );
        if (purchaseStatus === 'Dikirim') return transactions.filter(t => t.status_penjualan === 'Sedang Dikirim');
        if (purchaseStatus === 'Selesai') return transactions.filter(t => t.status_penjualan === 'Selesai');
        if (purchaseStatus === 'Batal/Retur') return transactions.filter(t => 
            t.status_penjualan.includes('Retur') || 
            t.status_penjualan.includes('Dibatalkan') || 
            t.status_penjualan.includes('Refund')
        );
        return transactions;
    };

    const getStatusUI = (status: string) => {
        switch (status) {
            case 'Menunggu Verifikasi Pembayaran':
                return { label: 'Menunggu Verifikasi', color: 'bg-yellow-100 text-yellow-700' };
            case 'Diverifikasi (Lunas)':
                return { label: 'Sudah Diverifikasi', color: 'bg-blue-100 text-blue-700' };
            case 'Menunggu Pengemasan':
                return { label: 'Barang Sedang Dikemas', color: 'bg-blue-100 text-blue-700' };
            case 'Siap Diambil':
                return { label: 'Siap Diambil di Toko', color: 'bg-green-100 text-green-700' };
            case 'Sedang Dikirim':
                return { label: 'Dalam Pengiriman', color: 'bg-orange-100 text-orange-700' };
            case 'Selesai':
                return { label: 'Pesanan Selesai', color: 'bg-green-100 text-green-700' };
            case 'Dibatalkan':
                return { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' };
            case 'Dibatalkan (Refund Selesai)':
                return { label: 'Batal (Refund Selesai)', color: 'bg-teal-100 text-teal-700' };
            case 'Retur Diajukan':
                return { label: 'Retur Diajukan', color: 'bg-indigo-100 text-indigo-700' };
            case 'Retur Disetujui':
                return { label: 'Retur Disetujui', color: 'bg-green-100 text-green-700' };
            case 'Retur Ditolak':
                return { label: 'Retur Ditolak', color: 'bg-red-100 text-red-700' };
            case 'Retur Selesai':
                return { label: 'Refund Selesai', color: 'bg-teal-100 text-teal-700' };
            default:
                return { label: status, color: 'bg-gray-100 text-gray-700' };
        }
    };

    const handleCancel = async () => {
        if (!cancelReason) return alert("Harap isi alasan pembatalan");
        setProcessing(true);
        try {
            const res = await fetch('/api/user/transaksi/batal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: selectedOrderId, reason: cancelReason })
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
                setShowCancelModal(false);
                fetchHistory();
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert("Gagal memproses pembatalan");
        } finally {
            setProcessing(false);
        }
    };

    const handleReturn = async () => {
        if (!returnReason || !returnPhoto || !bankInfo) return alert("Harap lengkapi semua data retur");
        setProcessing(true);
        try {
            const res = await fetch('/api/user/transaksi/retur', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: selectedOrderId,
                    reason: returnReason,
                    photo: returnPhoto,
                    bankInfo: bankInfo
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
                setShowReturnModal(false);
                fetchHistory();
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert("Gagal memproses pengajuan retur");
        } finally {
            setProcessing(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setReturnPhoto(data.url);
            }
        } catch (error) {
            alert("Gagal mengunggah foto");
        }
    };

    const filteredTransactions = getFilteredTransactions();

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Beranda
                    </Link>
                </div>
                <div className="flex flex-col md:flex-row gap-6">

                    {/* Left Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                            <Link href="/profil" className="p-6 flex items-center gap-4 cursor-pointer transition-colors hover:bg-gray-50">
                                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold">
                                    P
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-sm font-bold text-gray-800">Pengguna</h2>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">Ubah Profil</p>
                                </div>
                            </Link>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <nav className="flex flex-col py-2">
                                <Link href="/profil" className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors text-left text-gray-600 hover:bg-gray-50 hover:text-orange-600 border-l-4 border-transparent">
                                    <Mail className="w-5 h-5" />
                                    Kotak Masuk
                                </Link>
                                <Link
                                    href="/profil/alamat"
                                    className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors text-left text-gray-600 hover:bg-gray-50 hover:text-orange-600 border-l-4 border-transparent"
                                >
                                    <MapPin className="w-5 h-5" />
                                    Daftar Alamat
                                </Link>
                                <Link href="/history-transaksi" className="flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors text-left text-orange-600 border-l-4 border-orange-600 bg-orange-50/30">
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag className="w-5 h-5" />
                                        Pembelian
                                    </div>
                                    <ChevronRight className="w-4 h-4 transition-transform rotate-90" />
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px] overflow-hidden flex flex-col">

                        {/* Tabs Header */}
                        <div className="flex overflow-x-auto hide-scrollbar custom-scrollbar border-b border-gray-100 px-2 lg:px-6">
                            {purchaseTabs.map(tab => (
                                <button
                                    key={tab}
                                    className={`whitespace-nowrap px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${purchaseStatus === tab ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-orange-600'}`}
                                    onClick={() => setPurchaseStatus(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* List Pembelian */}
                        <div className="p-6 flex-1 bg-gray-50/30 flex flex-col gap-4 overflow-y-auto max-h-[600px]">

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Memuat Riwayat...</p>
                                </div>
                            ) : filteredTransactions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <Package className="w-16 h-16 text-gray-200 mb-4" />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Belum Ada Transaksi {purchaseStatus !== 'Semua' ? `di Tab ${purchaseStatus}` : ''}</p>
                                </div>
                            ) : (
                                filteredTransactions.map((item) => {
                                    const statusInfo = getStatusUI(item.status_penjualan);
                                    return (
                                        <div key={item.id} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:border-orange-200 transition-all flex flex-col shrink-0">
                                            <div className="flex justify-between items-center px-4 md:px-6 py-3 border-b border-gray-50 bg-gray-50/50">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-mono text-[10px] md:text-xs text-gray-500 font-bold">{item.inv}</span>
                                                    <span className="text-[10px] md:text-xs font-bold text-gray-400">{item.date}</span>
                                                </div>
                                                <span className={`px-3 py-1 font-black text-[9px] uppercase tracking-tighter rounded-full ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6 items-start">
                                                <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0 border border-gray-100 overflow-hidden">
                                                    {item.main_product_image ? (
                                                        <img src={item.main_product_image} alt={item.main_product} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-8 h-8 opacity-20" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1 gap-2">
                                                        <h3 className="font-black text-gray-900 text-base md:text-lg tracking-tight leading-tight truncate">{item.main_product}</h3>
                                                        <span className="text-xs font-bold text-gray-400 italic shrink-0">x{item.qty}</span>
                                                    </div>
                                                    {item.other_count > 0 && (
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">+ {item.other_count} Produk Lainnya</p>
                                                    )}
                                                    <p className="font-black text-orange-600 text-lg tracking-tighter mb-4">Rp {item.total.toLocaleString('id-ID')}</p>

                                                    {item.status_penjualan === 'Sedang Dikirim' && item.estimasi && (
                                                        <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                                                    <Clock className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest leading-none">Durasi</p>
                                                                    <p className="text-xs font-bold text-gray-700">{item.estimasi}</p>
                                                                </div>
                                                            </div>
                                                            <div className="hidden sm:block w-px h-6 bg-blue-200"></div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                                                                    <PackageOpen className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[8px] font-black text-green-400 uppercase tracking-widest leading-none">Estimasi Tiba</p>
                                                                    <p className="text-xs font-bold text-gray-700">{item.eta}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2 min-w-[180px] w-full md:w-auto">
                                                    {item.status_penjualan === 'Selesai' ? (
                                                        <>
                                                            <Link
                                                                href={item.other_count > 0 ? `/history-transaksi/${item.inv}` : `/history-transaksi/ulasan?id_detail=${item.id_detail}`}
                                                                className="w-full bg-orange-600 text-white px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                                                            >
                                                                <MessageSquare className="w-3.5 h-3.5" /> Beri Ulasan
                                                            </Link>
                                                            <button
                                                                onClick={() => { setSelectedOrderId(item.id); setShowReturnModal(true); }}
                                                                className="w-full bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
                                                            >
                                                                Ajukan Retur
                                                            </button>
                                                        </>
                                                    ) : item.status_penjualan === 'Menunggu Verifikasi Pembayaran' ? (
                                                        <>
                                                            <Link href={`/pembayaran/berhasil?invoice=${item.inv}`} className="w-full bg-orange-50 text-orange-600 border border-orange-200 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-100 text-center transition-all active:scale-95 flex items-center justify-center gap-2">
                                                                <Clock className="w-3.5 h-3.5" /> Cek Status Bayar
                                                            </Link>
                                                            <button
                                                                onClick={() => { setSelectedOrderId(item.id); setShowCancelModal(true); }}
                                                                className="w-full bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95 mt-1"
                                                            >
                                                                Batalkan Pesanan
                                                            </button>
                                                        </>
                                                    ) : ['Diverifikasi (Lunas)', 'Menunggu Pengemasan'].includes(item.status_penjualan) ? (
                                                        <>
                                                            <Link href={`/history-transaksi/${item.inv}`} className="w-full bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-2">
                                                                Lihat Detail <ChevronRight className="w-3 h-3" />
                                                            </Link>
                                                            <button 
                                                                onClick={() => { setSelectedOrderId(item.id); setShowCancelModal(true); }}
                                                                className="w-full bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95 mt-1"
                                                            >
                                                                Batalkan Pesanan
                                                            </button>
                                                        </>
                                                    ) : item.status_penjualan === 'Dibatalkan' || item.status_penjualan.includes('Retur') || item.status_penjualan.includes('Refund') ? (
                                                        <div className="flex flex-col gap-2">
                                                            <div className="w-full bg-gray-50 border border-gray-100 text-gray-400 px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-center cursor-default">
                                                                {statusInfo.label}
                                                            </div>
                                                            {item.bukti_refund && (
                                                                <a
                                                                    href={item.bukti_refund}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="w-full bg-teal-50 text-teal-600 border border-teal-200 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-teal-100 transition-all text-center flex items-center justify-center gap-2"
                                                                >
                                                                    <ImageIcon className="w-3.5 h-3.5" /> Lihat Bukti Refund
                                                                </a>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <Link href={`/history-transaksi/${item.inv}`} className="w-full bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-2">
                                                            Lihat Detail <ChevronRight className="w-3 h-3" />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                        </div>
                    </div>

                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Batalkan Pesanan?</h2>
                            <p className="text-gray-500 mb-8 font-medium">Beritahu kami alasan Anda membatalkan pesanan ini agar kami bisa melayani lebih baik.</p>

                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Alasan Pembatalan</label>
                            <textarea
                                className="w-full h-32 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-black font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                placeholder="Contoh: Saya berubah pikiran, salah masukkan alamat, dll..."
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                            />

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                                >
                                    Tutup
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={processing}
                                    className="flex-1 px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-100 transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? 'Memproses...' : 'Konfirmasi Batal'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Return Modal */}
            {showReturnModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Ajukan Retur</h2>
                            <p className="text-gray-500 mb-6 font-medium text-sm">Hubungi admin jika terjadi kerusakan pada barang yang Anda terima.</p>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Alasan Retur / Kerusakan</label>
                                    <textarea
                                        className="w-full h-24 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-black font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        placeholder="Jelaskan kondisi barang yang Anda terima..."
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Foto Bukti Kerusakan</label>
                                    <div className="flex gap-4 items-center">
                                        <label className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all text-gray-400 overflow-hidden shrink-0">
                                            {returnPhoto ? (
                                                <img src={returnPhoto} className="w-full h-full object-cover" />
                                            ) : (
                                                <FileImage className="w-6 h-6" />
                                            )}
                                            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                        </label>
                                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                                            *Mohon lampirkan foto fisik barang yang rusak dengan jelas.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Rekening / E-Wallet Refund</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-black font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        placeholder="Contoh: BCA - 123456789 (A/N Agus)"
                                        value={bankInfo}
                                        onChange={(e) => setBankInfo(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setShowReturnModal(false)}
                                    className="flex-1 px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                                >
                                    Tutup
                                </button>
                                <button
                                    onClick={handleReturn}
                                    disabled={processing}
                                    className="flex-1 px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-orange-600 text-white hover:bg-orange-700 shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
