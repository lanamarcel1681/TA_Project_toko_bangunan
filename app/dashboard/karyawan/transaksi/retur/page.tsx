'use client';
import React from 'react';
import { CornerDownLeft, Search, RefreshCcw, Image as ImageIcon, Camera, ExternalLink, ShieldCheck, CreditCard, ClipboardList } from 'lucide-react';

export default function ReturPembelianPage() {
    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Monitoring Retur & Refund</h1>
                <p className="text-gray-500 font-medium">Validasi fisik pengembalian barang dan proses pengembalian dana (Refund) kepada pelanggan.</p>
            </div>

            <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] text-center">Fisik Bukti</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Data Invoice</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Pelanggan & Rekening</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Alasan / Deskripsi</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Nominal Refund</th>
                                <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] text-right">Integrasi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { id: 'INV-2026-X1239', name: 'Agus Supriyanto', bank: 'BCA', acc: '1234567890', amount: 'Rp 450.000', reason: 'Barang rusak saat pengiriman (Cat tumpah)' }
                            ].map((item, idx) => (
                                <tr key={idx} className="hover:bg-blue-50/30 transition-all group">
                                    <td className="px-10 py-8">
                                        <div className="flex justify-center">
                                            <button 
                                                title="Lihat Foto Bukti dari Pembeli"
                                                className="w-14 h-14 bg-white text-gray-400 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border border-gray-100 shadow-sm group-hover:rotate-2 group-hover:scale-105 active:scale-95"
                                            >
                                                <ImageIcon className="w-6 h-6"/>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-1">ID TRANSAKSI</span>
                                        <span className="font-black text-gray-800 text-lg tracking-tight leading-none">{item.id}</span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <p className="font-black text-gray-900 text-base leading-none mb-2">{item.name}</p>
                                        <div className="flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-100/50 w-fit">
                                            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                                                {item.bank} &nbsp;·&nbsp; {item.acc}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="max-w-[220px]">
                                            <p className="text-gray-500 font-medium text-sm leading-relaxed">&ldquo;{item.reason}&rdquo;</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-xl font-black text-gray-900 tracking-tight leading-none">{item.amount}</span>
                                        <p className="text-[9px] font-black text-green-500 uppercase mt-1 tracking-widest leading-none">VALIDATED</p>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.15em] transition-all shadow-lg shadow-blue-600/20 active:scale-95 ml-auto group/btn">
                                            <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> Input Bukti TF &rarr;
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-10 bg-gray-50/50 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm items-center gap-8 relative overflow-hidden group/notice">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 -mr-16 -mt-16 rounded-full blur-2xl group-hover/notice:scale-110 transition-transform"></div>
                         <div className="w-16 h-16 bg-blue-600 rounded-2xl text-white flex items-center justify-center shadow-xl shadow-blue-600/20 shrink-0">
                             <ClipboardList className="w-8 h-8"/>
                         </div>
                         <div className="flex-1 text-left">
                             <h4 className="font-black text-gray-900 uppercase tracking-widest text-[11px] mb-3 flex items-center gap-2">
                                 <ShieldCheck className="w-4 h-4 text-blue-600" /> Protokol Operasional Karyawan
                             </h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="flex items-start gap-3">
                                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                     <p className="text-sm text-gray-500 font-medium leading-relaxed">Pastikan barang retur sudah diterima secara fisik di gudang & divalidasi kualitasnya sebelum proses TF.</p>
                                 </div>
                                 <div className="flex items-start gap-3">
                                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                     <p className="text-sm text-gray-500 font-medium leading-relaxed">Upload bukti transfer digital agar data keuangan sinkron dengan Dashboard Owner secara otomatis.</p>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

