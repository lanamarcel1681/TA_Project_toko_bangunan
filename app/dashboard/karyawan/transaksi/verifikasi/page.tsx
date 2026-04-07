'use client';
import React, { useState } from 'react';
import { Search, FileImage, CheckCircle, XCircle, Clock, User, DollarSign, History, ShieldCheck, ChevronRight } from 'lucide-react';

const initialTransactions = [
    { id: 1, inv: 'INV-2026-1001', customer: 'Budi Santoso', amount: 1250000, method: 'VA BCA', time: '14:30 WIB' },
    { id: 2, inv: 'INV-2026-2002', customer: 'Siti Aminah', amount: 850000, method: 'QRIS Gopay', time: '15:10 WIB' },
    { id: 3, inv: 'INV-2026-3003', customer: 'Andi Wijaya', amount: 3200000, method: 'Transfer Mandiri', time: '16:45 WIB' }
];

export default function VerifikasiPembayaranPage() {
    const [transactions, setTransactions] = useState(initialTransactions);

    const handleApprove = (id: number, inv: string) => {
        alert(`Verifikasi disetujui untuk ${inv}!`);
        setTransactions(transactions.filter(t => t.id !== id));
    };

    const handleReject = (id: number) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };
    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Verifikasi Transaksi</h1>
                <p className="text-gray-500 font-medium">Validasi bukti transfer yang diunggah pelanggan untuk sinkronisasi pesanan.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {transactions.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400 font-bold">
                        Semua transaksi telah diverifikasi!
                    </div>
                ) : (
                    transactions.map((item) => (
                        <div key={item.id} className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl relative overflow-hidden flex flex-col group transition-all hover:border-blue-200">
                            <div className="absolute top-0 right-0 px-6 py-2 bg-yellow-50 text-yellow-600 rounded-bl-[20px] text-[10px] font-black uppercase tracking-widest border-l border-b border-yellow-100/50 shadow-sm flex items-center gap-2">
                                <Clock className="w-3 h-3" /> PENDING
                            </div>
                            
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <button className="w-11 h-11 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100 shadow-sm" title="Pratinjau Bukti Transfer">
                                        <FileImage className="w-5 h-5"/>
                                    </button>
                                </div>
                                <h3 className="font-black text-xl text-gray-900 tracking-tight leading-none mb-1">{item.inv}</h3>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.15em]">Rp {(item.amount).toLocaleString('id-ID')} &nbsp;·&nbsp; {item.method}</p>
                            </div>

                            <div className="w-full space-y-4 mb-10 text-left">
                                <div className="flex items-center gap-3 px-5 py-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                    <User className="w-4 h-4 text-gray-400"/>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Customer</p>
                                        <p className="text-sm font-black text-gray-800 leading-none">{item.customer}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-5 py-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                    <Clock className="w-4 h-4 text-gray-400"/>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Uploaded At</p>
                                        <p className="text-sm font-black text-gray-800 leading-none">Hari Ini, {item.time}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <button onClick={() => handleApprove(item.id, item.inv)} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full flex justify-center items-center gap-3 font-black text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                                    <CheckCircle className="w-4 h-4" /> Approve &rarr;
                                </button>
                                <button onClick={() => handleReject(item.id)} className="flex-1 bg-white hover:bg-red-50 text-red-500 border border-red-100 py-4 rounded-full flex justify-center items-center gap-2 font-black text-[10px] uppercase tracking-[0.15em] active:scale-95 transition-all">
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <div className="mt-16 bg-white rounded-[40px] p-12 border border-gray-100 shadow-xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[20px] flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                            <History className="w-8 h-8" />
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2">Riwayat Verifikasi</h2>
                            <p className="text-gray-400 font-medium text-sm">Log aktivitas audit transaksi yang telah diselesaikan hari ini.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 px-8 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-right">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status: Menunggu Antrean Baru</span>
                    </div>
                </div>

                <div className="mt-10 p-12 border-2 border-dashed border-gray-100 rounded-[30px] flex flex-col items-center justify-center text-center group-hover:bg-gray-50/30 transition-colors">
                    <History className="w-12 h-12 text-gray-200 mb-4" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Belum Ada Data Verifikasi Tersedia Untuk Sesi Ini</p>
                </div>
            </div>
        </div>
    );
}

