'use client';
import React, { useState } from 'react';
import { ClipboardList, Send, Package, AlertCircle } from 'lucide-react';

const stockItems = [
    { id: 'SEM-TR-001', name: 'Semen Tiga Roda 40kg', category: 'Material Konstruksi', systemStock: 450, unit: 'Sak' },
    { id: 'BES-10-002', name: 'Besi Beton 10mm SNI', category: 'Logam & Baja', systemStock: 1200, unit: 'Batang' },
    { id: 'CAT-DX-003', name: 'Cat Dulux WeatherShield 5L', category: 'Cat & Pelapis', systemStock: 15, unit: 'Pail' },
    { id: 'BAT-MR-004', name: 'Bata Merah Press Jumbo', category: 'Material Dasar', systemStock: 8000, unit: 'Pcs' },
];

export default function StockOpnameKaryawanPage() {
    const [items, setItems] = useState(stockItems);

    const handleSubmit = () => {
        if (items.length === 0) return;
        alert('Laporan Stock Opname berhasil dikirim ke Owner untuk di-review!');
        setItems([]);
    };

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                 <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Audit Stock Opname</h1>
                    <p className="text-gray-500 font-medium">Verifikasi kesesuaian fisik stok barang dengan database sistem secara berkala.</p>
                </div>
                <button 
                    onClick={handleSubmit}
                    className={`px-8 py-3 rounded-full flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.1em] transition-all outline-none whitespace-nowrap ${items.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 active:scale-95'}`}
                >
                    <Send className="w-4 h-4" /> Kirim ke Owner &rarr;
                </button>
            </div>
            
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
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
                        <tbody className="divide-y divide-gray-50">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-bold">
                                        Data audit telah berhasil dikirim! Silakan menunggu review dari Owner.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item, i) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <span className="text-sm font-black text-gray-400 font-mono tracking-tighter">{item.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-left">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                    <Package className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-800 text-sm leading-none mb-1">{item.name}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl font-black text-gray-700 text-sm">
                                                {item.systemStock} <span className="text-[10px] text-gray-400 uppercase ml-1">{item.unit}</span>
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <input 
                                                type="number" 
                                                defaultValue={item.systemStock} 
                                                className="w-24 text-center px-4 py-2.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none font-black text-gray-800 transition-all" 
                                            />
                                        </td>
                                        <td className="px-8 py-6">
                                            <input 
                                                type="text" 
                                                placeholder="Catatan temuan lapangan..." 
                                                className="w-full px-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:border-blue-500 outline-none font-medium text-gray-700 transition-all placeholder:text-gray-300" 
                                            />
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
                            <ClipboardList className="w-6 h-6"/>
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-blue-700 uppercase tracking-widest mb-0.5 leading-none">Peringatan Audit</p>
                            <p className="text-xs font-bold text-blue-900/60 leading-none">Pastikan data fisik telah diperiksa secara manual sebelum sinkronisasi data.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

