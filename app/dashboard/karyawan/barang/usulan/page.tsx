'use client';
import React from 'react';
import { Send, FileText } from 'lucide-react';

export default function PengusulanBarangKaryawanPage() {
    return (
        <div className="p-8 w-full max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Pengusulan Barang Baru</h1>
            <p className="text-gray-500 mb-8">Kirim usulan penambahan data barang baru agar dapat disetujui oleh Owner.</p>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Barang Usulan</label>
                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Masukkan nama barang lengkap" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                <option>Pilih Kategori</option>
                                <option>Material Dasar</option>
                                <option>Cat & Cairan</option>
                                <option>Perkakas</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Harga Beli Perkiraan (Rp)</label>
                            <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Harga Jual Perkiraan (Rp)</label>
                            <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Alasan Pengusulan / Deskripsi</label>
                        <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Ceritakan detail barang ini atau mengapa barang ini perlu dijual..."></textarea>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-blue-500/30 transition-all w-full md:w-auto">
                            <Send className="w-5 h-5" /> Kirim Usulan ke Owner
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="mt-8 flex items-center justify-between text-gray-500 px-2">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4"/> Usulan yang pernah diajukan: <strong>12 item</strong></span>
                <button className="text-blue-600 font-medium hover:underline text-sm">Lihat Riwayat &rarr;</button>
            </div>
        </div>
    );
}
