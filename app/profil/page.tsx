'use client';
import React from 'react';
import { Mail, MapPin, ShoppingBag, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UserProfile() {
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
                            <Link href="/profil" className="p-6 flex items-center gap-4 cursor-pointer transition-colors bg-orange-50/50">
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
                                <Link href="/profil" className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors text-left text-orange-600 border-l-4 border-orange-600 bg-orange-50/30">
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
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px] overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Profil Saya</h2>
                            <div className="max-w-2xl">
                                {/* Edit Foto */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 items-center border-b border-gray-50 pb-8">
                                    <div className="col-span-1 text-center sm:text-right font-medium text-gray-500">
                                        Foto Profil
                                    </div>
                                    <div className="col-span-2 flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md relative overflow-hidden group">
                                            <span>P</span>
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Ubah</span>
                                            </div>
                                        </div>
                                        <div>
                                            <button className="px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm focus:ring-2 focus:ring-orange-500/30 outline-none">
                                                Pilih Foto
                                            </button>
                                            <p className="text-xs text-gray-400 mt-2 leading-relaxed">Ukuran gambar: maks. 1 MB.<br />Format: JPEG, PNG.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 items-start">
                                    <div className="col-span-1 text-center sm:text-right font-medium text-gray-500 pt-3">
                                        Nama Lengkap
                                    </div>
                                    <div className="col-span-2">
                                        <input type="text" className="w-full text-black px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50" defaultValue="Pengguna Setia" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 items-start">
                                    <div className="col-span-1 text-center sm:text-right font-medium text-gray-500 pt-3">
                                        Email
                                    </div>
                                    <div className="col-span-2 flex items-center gap-4">
                                        <div className="relative w-full">
                                            <input type="email" disabled className="w-full text-gray-600 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed" defaultValue="pengguna@bangunan.com" />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 items-start">
                                    <div className="col-span-1 text-center sm:text-right font-medium text-gray-500 pt-3">
                                        Nomor Telepon
                                    </div>
                                    <div className="col-span-2">
                                        <input type="tel" className="w-full text-black px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50" defaultValue="081234567890" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                                    <div className="col-span-1"></div>
                                    <div className="col-span-2">
                                        <button className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 shadow-md shadow-orange-500/20 transition-colors">
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
