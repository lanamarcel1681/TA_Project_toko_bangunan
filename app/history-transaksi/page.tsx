'use client';
import React, { useState } from 'react';
import { Mail, MapPin, ShoppingBag, ChevronRight, Package, Clock, PackageOpen, FileImage, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HistoryTransaksiPage() {
    const [purchaseStatus, setPurchaseStatus] = useState('Semua');
    const purchaseTabs = ['Semua', 'Belum Bayar', 'Disiapkan', 'Dikirim', 'Selesai', 'Retur'];

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
                                    <Mail className="w-5 h-5"/>
                                    Kotak Masuk
                                </Link>
                                <Link 
                                    href="/profil/alamat"
                                    className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors text-left text-gray-600 hover:bg-gray-50 hover:text-orange-600 border-l-4 border-transparent"
                                >
                                    <MapPin className="w-5 h-5"/>
                                    Daftar Alamat
                                </Link>
                                <Link href="/history-transaksi" className="flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors text-left text-orange-600 border-l-4 border-orange-600 bg-orange-50/30">
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag className="w-5 h-5"/>
                                        Pembelian
                                    </div>
                                    <ChevronRight className="w-4 h-4 transition-transform rotate-90" />
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px] overflow-hidden flex flex-col">
                        
                        {/* Tabs Header */}
                        <div className="flex overflow-x-auto hide-scrollbar custom-scrollbar border-b border-gray-100 px-2 lg:px-6">
                            {purchaseTabs.map(tab => (
                                <button
                                    key={tab}
                                    className={`whitespace-nowrap px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${purchaseStatus === tab ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-orange-600'}`}
                                    onClick={() => setPurchaseStatus(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        
                        {/* List Pembelian */}
                        <div className="p-6 flex-1 bg-gray-50/30 flex flex-col gap-4">
                            
                            {/* Dummy Data matching what was there before */}
                            {(purchaseStatus === 'Semua' || purchaseStatus === 'Disiapkan') && (
                                <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                                    <div className="flex justify-between items-center px-6 py-3 border-b border-gray-50 bg-gray-50/50">
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-xs text-gray-500">INV/2026/MB/120301</span>
                                            <span className="text-xs font-bold text-gray-500">26 Mar 2026</span>
                                        </div>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Disiapkan</span>
                                    </div>
                                    <div className="p-6 flex flex-col md:flex-row gap-6">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                                            <Package className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 text-lg">Semen Gresik 50kg (x5)</h3>
                                            <p className="text-sm text-gray-500 mb-2">+ 2 Produk Lainnya</p>
                                            <p className="font-bold text-orange-600 text-lg">Rp 850.000</p>
                                        </div>
                                        <div className="flex flex-col gap-2 min-w-[180px]">
                                            <button className="w-full bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-700 shadow-sm transition-colors">
                                                Lacak Pesanan
                                            </button>
                                            <button className="w-full bg-white border border-gray-200 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                                                Ajukan Pembatalan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(purchaseStatus === 'Semua' || purchaseStatus === 'Belum Bayar') && (
                                <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                                    <div className="flex justify-between items-center px-6 py-3 border-b border-gray-50 bg-gray-50/50">
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-xs text-gray-500">INV/2026/MB/120302</span>
                                            <span className="text-xs font-bold text-gray-500">26 Mar 2026</span>
                                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Belum Dibayar
                                            </span>
                                        </div>
                                        <div className="text-red-600 font-bold text-sm flex items-center gap-1">
                                            Sisa Waktu: 04:59
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col md:flex-row gap-6">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                                            <PackageOpen className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 text-lg">Cat Kayu Propan 1L (x1)</h3>
                                            <p className="font-bold text-orange-600 text-lg">Rp 85.000</p>
                                        </div>
                                        <div className="flex flex-col gap-2 min-w-[200px]">
                                            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all text-sm">
                                                Bayar Sekarang
                                            </button>
                                            <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2.5 rounded-lg font-semibold transition-all flex justify-center items-center gap-2 text-sm">
                                                <FileImage className="w-4 h-4"/> Upload Bukti
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {(purchaseStatus === 'Semua' || purchaseStatus === 'Selesai') && (
                                <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                                    <div className="flex justify-between items-center px-6 py-3 border-b border-gray-50 bg-gray-50/50">
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-xs text-gray-500">INV/2026/MB/120250</span>
                                            <span className="text-xs font-bold text-gray-500">20 Mar 2026</span>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Selesai</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col md:flex-row gap-6">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                                            <Package className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 text-lg">Paku Payung 1kg</h3>
                                            <p className="font-bold text-orange-600 text-lg mt-2">Rp 25.000</p>
                                        </div>
                                        <div className="flex flex-col gap-2 min-w-[180px]">
                                            <Link href="/history-transaksi/ulasan" className="w-full bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors text-center inline-block">
                                                Beri Ulasan
                                            </Link>
                                            <button className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2.5 rounded-lg font-semibold transition-all text-sm border border-orange-200">
                                                Beli Lagi
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
