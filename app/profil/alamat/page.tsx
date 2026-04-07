'use client';
import React, { useState } from 'react';
import { Mail, MapPin, ShoppingBag, Plus, Star, Edit, Trash2, ChevronRight, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';

export default function AlamatPembeliPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
                                    className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors text-left text-orange-600 border-l-4 border-orange-600 bg-orange-50/30"
                                >
                                    <MapPin className="w-5 h-5" />
                                    Daftar Alamat
                                </Link>
                                <Link href="/history-transaksi" className="flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors text-left text-gray-600 hover:bg-gray-50 hover:text-orange-600 border-l-4 border-transparent">
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag className="w-5 h-5" />
                                        Pembelian
                                    </div>
                                    <ChevronRight className="w-4 h-4 transition-transform" />
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px] overflow-hidden p-8">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Buku Alamat</h2>
                            <button onClick={() => setIsAddModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-orange-500/30 transition-all text-sm">
                                <Plus className="w-5 h-5" /> Tambah Alamat
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {/* Alamat Utama */}
                            <div className="bg-white rounded-xl p-6 border-2 border-orange-500 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 px-4 py-1.5 bg-orange-500 text-white rounded-bl-xl text-xs font-bold flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" /> Utama
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-1 mt-2">Rumah <span className="text-gray-400 font-normal text-sm">| John Doe</span></h3>
                                <p className="text-gray-500 font-mono text-sm mb-2">081234567890</p>
                                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                                    Jl. Mawar Merah No.15, RT.01/RW.02, Kel. Melati, Kec. Kebayoran, Jakarta Selatan, 12345.
                                </p>
                                <div className="flex gap-4 border-t border-gray-100 pt-4">
                                    <button className="text-orange-600 font-semibold hover:underline flex items-center gap-1 text-sm">
                                        <Edit className="w-4 h-4" /> Ubah Alamat
                                    </button>
                                </div>
                            </div>

                            {/* Alamat Lainnya */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:border-orange-300 transition-colors">
                                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-1">Kantor <span className="text-gray-400 font-normal text-sm">| John Doe</span></h3>
                                <p className="text-gray-500 font-mono text-sm mb-2">081234567890</p>
                                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                                    Gedung Menara Mulia Lt. 10. Jl. Jendral Sudirman Kav. 12, Jakarta Pusat, 10220. (Patokan: Depan pos Satpam)
                                </p>
                                <div className="flex gap-4 border-t border-gray-100 pt-4 items-center">
                                    <button className="text-orange-600 font-semibold hover:underline flex items-center gap-1 border-r border-gray-200 pr-4 text-sm">
                                        <Edit className="w-4 h-4" /> Ubah
                                    </button>
                                    <button className="text-gray-500 hover:text-orange-600 font-medium hover:underline border-r border-gray-200 pr-4 text-sm">
                                        Jadikan Utama
                                    </button>
                                    <button className="text-red-500 hover:text-red-600 font-medium hover:underline flex items-center gap-1 text-sm">
                                        <Trash2 className="w-4 h-4" /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Tambah Alamat */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Tambah Alamat Baru</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-gray-50 hover:bg-red-50 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Label Alamat</label>
                                <input type="text" placeholder="Contoh: Rumah, Kantor, Apartemen" className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Penerima</label>
                                    <input type="text" placeholder="Nama lengkap" className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon</label>
                                    <input type="text" placeholder="Contoh: 0812..." className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Kota & Kecamatan</label>
                                <input type="text" placeholder="Contoh: Sleman, Depok" className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
                                <textarea rows={3} placeholder="Nama jalan, gedung, no. rumah/unit" className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border"></textarea>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer w-max group">
                                    <input type="checkbox" className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Jadikan sebagai alamat utama</span>
                                </label>
                            </div>
                        </div>
                        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">Batal</button>
                            <button onClick={() => { setIsAddModalOpen(false); alert('Alamat baru berhasil ditambahkan!'); }} className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-lg shadow-orange-500/30 transition-all">Simpan Alamat</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
