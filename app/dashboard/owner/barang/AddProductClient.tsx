"use client";

import { useState } from 'react';
import { Plus, X, Package, Tag, Layers, DollarSign, Archive, Save, ArrowRight } from 'lucide-react';

export default function AddProductClient() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                type="button" 
                className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/40 transition-all active:scale-95 group"
            >
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Tambah Produk &rarr;
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" 
                        onClick={() => setIsOpen(false)}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-white/20 animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100 bg-gray-50/50 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Package className="w-4 h-4 text-orange-600" />
                                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.25em]">Master Data Inventory</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Registrasi Produk Baru</h3>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="w-12 h-12 bg-white text-gray-400 hover:text-orange-600 hover:border-orange-100 border border-transparent rounded-2xl shadow-sm flex items-center justify-center transition-all active:scale-90 relative z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Body - Form */}
                        <div className="p-10 overflow-y-auto custom-scrollbar">
                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* SKU */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <Tag className="w-3 h-3" /> SKU Identity
                                        </label>
                                        <input type="text" placeholder="Contoh: SEM-002" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>
                                    
                                    {/* Kategori */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <Layers className="w-3 h-3" /> Klasifikasi Kategori
                                        </label>
                                        <select className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer">
                                            <option>Pilih Kategori</option>
                                            <option>Semen</option>
                                            <option>Besi</option>
                                            <option>Cat</option>
                                            <option>Bata</option>
                                            <option>Kayu</option>
                                            <option>Genteng</option>
                                            <option>Pipa</option>
                                            <option>Pasir</option>
                                        </select>
                                    </div>

                                    {/* Nama Produk */}
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <Package className="w-3 h-3" /> Nama Lengkap Produk Material
                                        </label>
                                        <input type="text" placeholder="Masukkan nama produk spesifik" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    {/* Harga */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <DollarSign className="w-3 h-3" /> Harga Jual Satuan (Rp)
                                        </label>
                                        <input type="number" placeholder="0" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    {/* Satuan */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <Archive className="w-3 h-3" /> Unit Pengukuran
                                        </label>
                                        <input type="text" placeholder="Contoh: /sak, /kg, /buah" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    {/* Stok Awal */}
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <Layers className="w-3 h-3" /> Inisialisasi Stok Gudang
                                        </label>
                                        <div className="relative group">
                                            <input type="number" placeholder="0" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">READY STOCK</div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        {/* Footer */}
                        <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-end items-center gap-4 relative">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                type="button" 
                                className="w-full sm:w-auto px-8 py-4 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                            >
                                Batalkan Entri
                            </button>
                            <button 
                                type="button" 
                                onClick={() => {
                                    alert("Menyimpan simulasi produk...");
                                    setIsOpen(false);
                                }}
                                className="w-full sm:w-auto px-10 py-4 bg-orange-600 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/40 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                <Save className="w-4 h-4" /> Simpan Data Produk <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
