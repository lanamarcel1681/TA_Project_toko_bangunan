'use client';
import React, { useState } from 'react';
import { MapPin, Truck, CreditCard, Receipt, FileImage, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
    return (
        <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-green-500" /> Checkout Aman
            </h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Bagian Kiri: Form & Opsi */}
                <div className="w-full lg:w-2/3 flex flex-col gap-6">
                    {/* Alamat Pengiriman */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-500 text-white rounded-bl-xl text-xs font-bold">Utama</div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                            <MapPin className="text-blue-600 w-6 h-6" /> Alamat Pengiriman
                        </h2>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                            <p className="font-bold text-gray-800">John Doe (081234567890)</p>
                            <p className="text-gray-600 mt-1 line-clamp-2">Jl. Mawar Merah No.15, RT.01/RW.02, Kel. Melati, Kec. Kebayoran, Jakarta Selatan, 12345.</p>
                        </div>
                        <button className="text-blue-600 font-semibold hover:underline mt-4 text-sm">Pilih Alamat Lain</button>
                    </div>

                    {/* Barang yang Dibeli */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                            <Receipt className="text-blue-600 w-6 h-6" /> Barang yang Dibeli
                        </h2>
                        <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400">BRG</div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800">Semen Gresik 50kg</h3>
                                <p className="text-gray-500 text-sm">Rp 75.000 x 5 sak</p>
                            </div>
                            <p className="font-bold text-gray-800">Rp 375.000</p>
                        </div>
                        <div className="flex items-center gap-4 py-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400">BRG</div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800">Cat Kayu Propan 1L</h3>
                                <p className="text-gray-500 text-sm">Rp 85.000 x 1 kaleng</p>
                            </div>
                            <p className="font-bold text-gray-800">Rp 85.000</p>
                        </div>
                    </div>

                     {/* Opsi Pengiriman & Pembayaran */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <Truck className="text-purple-600 w-5 h-5" /> Metode Pengiriman
                            </h2>
                            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                <option>Diantar (Mobil Pickup) - Rp 50.000</option>
                                <option>Ambil Sendiri di Toko - Gratis</option>
                            </select>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <CreditCard className="text-green-600 w-5 h-5" /> Metode Pembayaran
                            </h2>
                            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                <option>Transfer Bank (Verifikasi Manual)</option>
                                <option>QRIS (Otomatis & Real-time)</option>
                                <option>Cash (Bayar di Toko)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bagian Kanan: Ringkasan Belanja */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Ringkasan Belanja</h2>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Total Harga (6 Barang)</span>
                                <span>Rp 460.000</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Total Ongkos Kirim</span>
                                <span>Rp 50.000</span>
                            </div>
                            <div className="flex justify-between text-green-600 font-semibold">
                                <span>Diskon Retail (Beli &gt; 1 Juta)</span>
                                <span>- Rp 0</span>
                            </div>
                             <div className="flex justify-between text-green-600 font-semibold">
                                <span>Diskon Grosir</span>
                                <span>- Rp 0</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 mb-6">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-gray-800 text-lg">Total Tagihan</span>
                                <span className="font-black text-blue-600 text-2xl">Rp 510.000</span>
                            </div>
                        </div>

                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all mb-4">
                            Buat Pesanan
                        </button>
                        
                        <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1 mt-2">
                             <FileImage className="w-3 h-3" /> Jika memilih TF, siapkan bukti transfer Anda.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
