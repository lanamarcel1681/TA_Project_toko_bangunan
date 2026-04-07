"use client";

import { useState } from 'react';
import { Eye, Download, X, Printer, CreditCard, User, Calendar, Tag, Package, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

type Transaction = {
    id: string;
    date: string;
    type: string;
    client: string;
    description: string;
    total: string;
    status: string;
    statusColor: string;
};

export default function TransactionTableClient({ transactions }: { transactions: Transaction[] }) {
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

    return (
        <>
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden relative group/table">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/20 -mr-32 -mt-32 rounded-full blur-3xl opacity-0 group-hover/table:opacity-100 transition-opacity duration-1000"></div>

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th scope="col" className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Data Invoice</th>
                                <th scope="col" className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Otorisasi</th>
                                <th scope="col" className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] min-w-[250px]">Klien / Partner</th>
                                <th scope="col" className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nominal Akhir</th>
                                <th scope="col" className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Validasi</th>
                                <th scope="col" className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Integrasi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 border-t border-gray-50/50">
                            {transactions.map((tx, i) => (
                                <tr key={i} className="hover:bg-orange-50/30 transition-all duration-300 group/row">
                                    <td className="px-10 py-8">
                                        <div className="font-black text-orange-600 text-base mb-1 group-hover/row:scale-105 origin-left transition-transform tracking-tight">{tx.id}</div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <Calendar className="w-3 h-3" /> {tx.date}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors ${
                                            tx.type === 'Penjualan' 
                                            ? 'bg-green-50 text-green-700 border-green-100' 
                                            : 'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                            <div className={`w-1 h-1 rounded-full ${tx.type === 'Penjualan' ? 'bg-green-600' : 'bg-blue-600'}`}></div>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <p className="font-black text-gray-900 text-base mb-1 group-hover/row:text-orange-600 transition-colors tracking-tight">{tx.client}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate max-w-[200px]">
                                            {tx.description}
                                        </p>
                                    </td>
                                    <td className="px-10 py-8">
                                        <p className="font-black text-gray-900 text-lg tracking-tighter tabular-nums">{tx.total}</p>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                            tx.statusColor === 'green' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            tx.statusColor === 'yellow' ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse' :
                                            'bg-gray-50 text-gray-700 border-gray-100'
                                        }`}>
                                            {tx.statusColor === 'green' ? <ShieldCheck className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2 translate-x-4 opacity-0 group-hover/row:translate-x-0 group-hover/row:opacity-100 transition-all duration-300">
                                            <button 
                                                onClick={() => setSelectedTx(tx)}
                                                className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:border-orange-200 active:scale-90 transition-all" 
                                                title="Lihat Detail Auditor"
                                            >
                                                <Eye className="w-4.5 h-4.5" />
                                            </button>
                                            <button className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:border-orange-200 active:scale-90 transition-all" title="Unduh Arsip Digital">
                                                <Download className="w-4.5 h-4.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction Detail Modal */}
            {selectedTx && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" 
                        onClick={() => setSelectedTx(null)}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-white/20 animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="px-10 py-8 border-b border-gray-100 bg-gray-50/50 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Tag className="w-4 h-4 text-orange-600" />
                                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.25em]">Audit Ledger Entry</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">Detail Transaksi</h3>
                                    <p className="text-sm font-bold text-orange-600 uppercase tracking-widest">{selectedTx.id}</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedTx(null)}
                                    className="w-12 h-12 bg-white text-gray-400 hover:text-orange-600 hover:border-orange-100 border border-transparent rounded-2xl shadow-sm flex items-center justify-center transition-all active:scale-90"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Body */}
                        <div className="p-10 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Verifikasi</p>
                                    <div className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${
                                        selectedTx.statusColor === 'green' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-sm font-black uppercase tracking-widest">{selectedTx.status}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kanal Otorisasi</p>
                                    <div className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${
                                        selectedTx.type === 'Penjualan' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>
                                        <CreditCard className="w-4 h-4" />
                                        <span className="text-sm font-black uppercase tracking-widest">{selectedTx.type}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stempel Waktu</p>
                                    <div className="px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-bold text-gray-900">{selectedTx.date}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Relasi Entitas</p>
                                    <div className="px-5 py-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-bold text-gray-900 truncate">{selectedTx.client}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 mb-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <Package className="w-5 h-5 text-gray-400" />
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Itemized Project Breakdown</h4>
                                </div>
                                <ul className="space-y-4">
                                    {selectedTx.description.split(', ').map((item, idx) => {
                                        const match = item.match(/(.+?)\s*\((\d+.*)\)/);
                                        return (
                                            <li key={idx} className="flex justify-between items-center group/item p-3 hover:bg-white rounded-xl transition-all">
                                                <span className="text-gray-700 font-bold tracking-tight text-sm group-hover/item:text-orange-600 transition-colors">{match ? match[1] : item}</span>
                                                {match && (
                                                    <span className="text-[10px] font-black text-orange-600 px-3 py-1 bg-orange-50 rounded-lg border border-orange-100 uppercase tracking-tighter tabular-nums">
                                                        {match[2]}
                                                    </span>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            
                            <div className="flex flex-col items-end pt-4">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 leading-none">Grand Total Netto</span>
                                <span className="text-5xl font-black text-orange-600 tracking-tighter tabular-nums leading-none mb-1">{selectedTx.total}</span>
                                <div className="w-20 h-1.5 bg-orange-600 rounded-full mt-2"></div>
                            </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-end items-center gap-4 relative">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                            <button 
                                onClick={() => setSelectedTx(null)}
                                className="w-full sm:w-auto px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                            >
                                Tutup Panel Auditor
                            </button>
                            <button className="w-full sm:w-auto px-10 py-4 bg-orange-600 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/40 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3">
                                <Printer className="w-4 h-4" /> Cetak Salinan Invoice <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
