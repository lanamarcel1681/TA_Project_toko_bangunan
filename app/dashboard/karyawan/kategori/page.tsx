'use client';
import React, { useState } from 'react';
import { Tags, Plus, Search, Edit2, Trash2, X, ChevronRight } from 'lucide-react';

export default function KategoriBarangPage() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Manajemen Kategori</h1>
                    <p className="text-gray-500 font-medium whitespace-nowrap">Kelola kategori untuk mempermudah organisasi dan pencarian inventaris barang.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors"/>
                        <input 
                            type="text" 
                            placeholder="Cari kategori..." 
                            className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-full focus:border-blue-500 outline-none w-full md:w-64 font-bold text-sm text-gray-800 transition-all shadow-sm" 
                        />
                    </div>
                    <button 
                        onClick={() => setIsOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.1em] shadow-lg shadow-blue-600/20 active:scale-95 transition-all outline-none whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" /> Kategori Baru &rarr;
                    </button>
                </div>
            </div>
            
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest w-24">No</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-left">Nama Kategori</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-center">Status / Total Item</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-right">Manajemen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {['Material Dasar', 'Cat & Cairan', 'Perkakas Listrik', 'Alat Teknik/Manual', 'Semen & Pasir'].map((cat, i) => (
                                <tr key={cat} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-black text-gray-400 font-mono tracking-tighter">0{i + 1}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                <Tags className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800 text-sm leading-none mb-1">{cat}</p>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Main Category</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-green-100 inline-flex items-center gap-2">
                                            Aktif / {(50 - i * 7)} Barang
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all shadow-sm" title="Edit">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm" title="Hapus">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah Kategori */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" onClick={() => setIsOpen(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] text-left">
                        {/* Header */}
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-50 bg-gray-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
                                    <Tags className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">Buat Kategori Baru</h3>
                                    <p className="text-xs font-black text-gray-400 tracking-widest uppercase mt-1">Organisir Inventaris dengan Kategori</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Body - Form */}
                        <div className="p-10 overflow-y-auto">
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nama Kategori</label>
                                    <input type="text" placeholder="Contoh: Perkakas Listrik" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Deskripsi Singkat</label>
                                    <textarea rows={3} placeholder="Berikan deskripsi tentang kategori ini..." className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800 text-sm" />
                                </div>
                            </form>
                        </div>
                        
                        {/* Footer */}
                        <div className="px-10 py-8 border-t border-gray-50 bg-gray-50/30 flex justify-end gap-4">
                            <button onClick={() => setIsOpen(false)} type="button" className="px-8 py-3.5 text-gray-500 font-bold text-[11px] uppercase tracking-widest bg-gray-100 rounded-full hover:bg-gray-200 transition-all active:scale-[0.98]">
                                Batal
                            </button>
                            <button 
                                type="button" 
                                onClick={() => {
                                    alert("Kategori berhasil ditambahkan!");
                                    setIsOpen(false);
                                }}
                                className="px-10 py-3.5 bg-blue-600 text-white font-black text-[11px] uppercase tracking-widest rounded-full shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                Simpan Kategori <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
