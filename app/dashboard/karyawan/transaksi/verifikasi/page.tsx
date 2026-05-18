'use client';
import React, { useState, useEffect } from 'react';
import { Search, FileImage, CheckCircle, XCircle, Clock, User, DollarSign, History, ShieldCheck, ChevronRight, AlertTriangle, Loader2, MessageCircle } from 'lucide-react';
import { useToast } from '@/app/components/Toast';

export default function VerifikasiPembayaranPage() {
    const { showToast } = useToast();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Confirmation Modal states
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'APPROVE' | 'REJECT' | null>(null);
    const [confirmTarget, setConfirmTarget] = useState<any>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/karyawan/transaksi/verifikasi');
            const data = await res.json();
            if (data.success) {
                setTransactions(data.pending || []);
                setHistory(data.history || []);
            }
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleApprove = (item: any) => {
        setConfirmAction('APPROVE');
        setConfirmTarget(item);
        setShowConfirmModal(true);
    };

    const handleReject = (item: any) => {
        setConfirmAction('REJECT');
        setConfirmTarget(item);
        setShowConfirmModal(true);
    };

    const executeAction = async () => {
        if (!confirmAction || !confirmTarget) return;
        setIsActionLoading(true);

        try {
            const res = await fetch('/api/karyawan/transaksi/verifikasi', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: confirmTarget.id, action: confirmAction })
            });
            const data = await res.json();
            if (data.success) {
                showToast(
                    confirmAction === 'APPROVE' 
                        ? `Pembayaran ${confirmTarget.inv} berhasil disetujui!` 
                        : `Pembayaran ${confirmTarget.inv} telah ditolak.`, 
                    'success'
                );
                fetchTransactions();
                setShowConfirmModal(false);
            } else {
                showToast(data.error || 'Gagal memproses verifikasi', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan sistem perbankan', 'error');
        } finally {
            setIsActionLoading(false);
        }
    };
    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Verifikasi Transaksi</h1>
                <p className="text-gray-500 font-medium">Validasi bukti transfer yang diunggah pelanggan untuk sinkronisasi pesanan.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {!transactions || transactions.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-[40px] bg-white">
                        <ShieldCheck className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                        <p className="uppercase tracking-[0.2em] text-[10px]">Semua transaksi telah diverifikasi!</p>
                    </div>
                ) : (
                    transactions.map((item) => (
                        <div key={item.id} className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl relative overflow-hidden flex flex-col group transition-all hover:border-orange-200">
                            <div className="absolute top-0 right-0 px-6 py-2 bg-yellow-50 text-yellow-600 rounded-bl-[20px] text-[10px] font-black uppercase tracking-widest border-l border-b border-yellow-100/50 shadow-sm flex items-center gap-2">
                                <Clock className="w-3 h-3" /> PENDING
                            </div>
                            
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <button 
                                        onClick={() => item.proof ? window.open(item.proof, '_blank') : alert('Tidak ada bukti (Bayar di Toko)')}
                                        className="w-11 h-11 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-all border border-transparent hover:border-orange-100 shadow-sm" 
                                        title="Pratinjau Bukti Transfer"
                                    >
                                        <FileImage className="w-5 h-5"/>
                                    </button>
                                </div>
                                <h3 className="font-black text-xl text-gray-900 tracking-tight leading-none mb-1">{item.inv}</h3>
                                <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.15em]">Rp {(item.amount).toLocaleString('id-ID')} &nbsp;·&nbsp; {item.method}</p>
                            </div>

                            <div className="w-full space-y-4 mb-10 text-left">
                                <div className="flex items-center gap-3 px-5 py-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                    <User className="w-4 h-4 text-gray-400"/>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Customer</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-black text-gray-800 leading-none">{item.customer}</p>
                                            <a 
                                                href={`https://wa.me/${item.phone?.replace(/^0/, '62').replace(/^\+/, '')}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center p-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                                                title="Hubungi via WhatsApp"
                                            >
                                                <MessageCircle className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-5 py-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                    <Clock className="w-4 h-4 text-gray-400"/>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Uploaded At</p>
                                         <p className="text-sm font-black text-gray-800 leading-none">{item.date}, {item.time}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <button onClick={() => handleApprove(item)} className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-full flex justify-center items-center gap-3 font-black text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-orange-600/20 active:scale-95 transition-all">
                                    <CheckCircle className="w-4 h-4" /> Approve &rarr;
                                </button>
                                <button onClick={() => handleReject(item)} className="flex-1 bg-white hover:bg-red-50 text-red-500 border border-red-100 py-4 rounded-full flex justify-center items-center gap-2 font-black text-[10px] uppercase tracking-[0.15em] active:scale-95 transition-all">
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <div className="mt-16 bg-white rounded-[40px] p-12 border border-gray-100 shadow-xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-50/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-[20px] flex items-center justify-center border border-orange-100 shadow-sm shrink-0">
                            <History className="w-8 h-8" />
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2">Riwayat Verifikasi</h2>
                            <p className="text-gray-400 font-medium text-sm">Log aktivitas audit transaksi yang telah diselesaikan hari ini.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 px-8 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-right">
                        <ShieldCheck className="w-5 h-5 text-orange-600" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status: Menunggu Antrean Baru</span>
                    </div>
                </div>

                <div className="mt-10 overflow-hidden">
                    {history.length === 0 ? (
                        <div className="p-12 border-2 border-dashed border-gray-100 rounded-[30px] flex flex-col items-center justify-center text-center group-hover:bg-gray-50/30 transition-colors">
                            <History className="w-12 h-12 text-gray-200 mb-4" />
                            <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Belum Ada Data Verifikasi Tersedia Untuk Sesi Ini</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {history.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group/item">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.status_pembayaran === 'Ditolak' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                            {item.status_pembayaran === 'Ditolak' ? <XCircle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-black text-gray-900 tracking-tight leading-none">{item.inv}</h4>
                                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${item.status_pembayaran === 'Ditolak' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {item.status_pembayaran === 'Ditolak' ? 'REJECTED' : 'VERIFIED'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.customer} • Rp {item.amount.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <p className="text-[10px] font-black text-gray-900 mb-1">{item.date}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {item.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 text-center">
                    <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 rotate-12 group hover:rotate-0 transition-transform ${confirmAction === 'APPROVE' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-500'}`}>
                            {confirmAction === 'APPROVE' ? <CheckCircle className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                            {confirmAction === 'APPROVE' ? 'Setujui Pembayaran?' : 'Tolak Pembayaran?'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            {confirmAction === 'APPROVE' 
                                ? `Konfirmasi validasi pembayaran untuk ${confirmTarget?.inv}. Pastikan nominal dan bukti transfer sesuai.` 
                                : `Menolak pembayaran ${confirmTarget?.inv} akan mengembalikan stok barang ke database.`}
                        </p>
                        
                        <div className="flex flex-col w-full gap-3">
                            <button 
                                onClick={executeAction}
                                disabled={isActionLoading}
                                className={`w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 ${confirmAction === 'APPROVE' ? 'bg-orange-600 shadow-orange-600/20 hover:bg-orange-700' : 'bg-red-600 shadow-red-600/20 hover:bg-red-700'}`}
                            >
                                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (confirmAction === 'APPROVE' ? 'Ya, Setujui' : 'Ya, Tolak Pembayaran')}
                            </button>
                            <button 
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setConfirmAction(null);
                                    setConfirmTarget(null);
                                }}
                                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

