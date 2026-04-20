"use client";

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Dummy data from keranjang
const cartItems = [
    {
        id: 1,
        name: 'Semen Padang 50kg',
        price: 65000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        category: 'Material Dasar'
    },
    {
        id: 2,
        name: 'Cat Tembok Putih 5kg',
        price: 150000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1562259929-b7e181d8d007?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        category: 'Cat & Pelapis'
    },
];

export default function PembayaranPage() {
    const router = useRouter();
    const [metodePengiriman, setMetodePengiriman] = useState('Diantar ke Rumah');
    const [jarak, setJarak] = useState<number | ''>(4);
    const [catatan, setCatatan] = useState('');
    const [pakaiProteksi, setPakaiProteksi] = useState(false);
    const [pakaiAsuransi, setPakaiAsuransi] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('QRIS');
    const [buktiPembayaran, setBuktiPembayaran] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const bankAccount = {
        number: '137-00-1111-2222',
        owner: 'TB. Lumbung Jaya',
        bank: 'MANDIRI'
    };

    // Dynamic Pricing based on cartItems
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const hargaBarang = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Hitung Ongkos Kirim
    const calculateOngkosKirim = () => {
        if (metodePengiriman === 'Diambil Sendiri ke Toko') return 0;

        if (jarak === '') return 0; // Default when typing
        const dist = Number(jarak);

        // Ongkir gratis jika total pembelian >= 1.5 juta dan jaraknya dari toko kurang dari 5 km
        // Ongkir = 250 ribu jika total pembelian < 1.5 juta ATAU jarak dari toko lebih dari 5 km
        if (hargaBarang >= 1500000 && dist < 5) {
            return 0;
        } else {
            return 250000;
        }
    };

    const ongkosKirim = calculateOngkosKirim();
    const biayaProteksi = 8500 * totalQty; // dummy proteksi per qty
    const biayaAsuransi = 500 * totalQty; // dummy asuransi per qty

    const calculateTotal = () => {
        let total = hargaBarang + ongkosKirim;
        if (pakaiProteksi) total += biayaProteksi;
        if (pakaiAsuransi) total += biayaAsuransi;
        return total;
    };

    return (
        <div className="min-h-screen bg-[#F3F4F5]"> {/* Tokopedia-like background */}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Link */}
                <div className="mb-4">
                    <Link href="/keranjang" className="text-gray-600 hover:text-orange-600 flex items-center text-sm font-medium transition">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </Link>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-6">Pembayaran</h1>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* KIRI - Konten Utama */}
                    <div className="lg:w-[65%] space-y-4">

                        {/* Pilihan Metode Pengiriman */}
                        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                            <p className="text-sm font-bold text-gray-700 mb-3 tracking-wide">METODE PENGIRIMAN</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${metodePengiriman === 'Diantar ke Rumah' ? 'border-green-500 bg-green-50/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <div className="flex items-start">
                                        <input type="radio" value="Diantar ke Rumah" checked={metodePengiriman === 'Diantar ke Rumah'} onChange={(e) => setMetodePengiriman(e.target.value)} className="w-4 h-4 mt-1 text-green-600 focus:ring-green-500 mr-3" />
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">Diantar ke Rumah</p>
                                            <p className="text-xs text-gray-500 mt-1">Pesanan dikirim ke alamat Anda (Area Yogyakarta)</p>
                                        </div>
                                    </div>
                                </label>
                                <label className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${metodePengiriman === 'Diambil Sendiri ke Toko' ? 'border-green-500 bg-green-50/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <div className="flex items-start">
                                        <input type="radio" value="Diambil Sendiri ke Toko" checked={metodePengiriman === 'Diambil Sendiri ke Toko'} onChange={(e) => setMetodePengiriman(e.target.value)} className="w-4 h-4 mt-1 text-green-600 focus:ring-green-500 mr-3" />
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">Diambil Sendiri ke Toko</p>
                                            <p className="text-xs text-gray-500 mt-1">Ambil langsung pesanan di toko kami gratis ongkir</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* 1. Alamat Pengiriman */}
                        {metodePengiriman === 'Diantar ke Rumah' && (
                            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col space-y-4">
                                <p className="text-sm font-bold text-gray-700 tracking-wide">ALAMAT PENGIRIMAN</p>

                                {/* Banner Info Ongkir */}
                                <div className="bg-orange-50/70 border border-orange-100 rounded-lg p-3 flex items-start">
                                    <svg className="w-5 h-5 text-orange-600 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <div className="text-xs text-orange-900">
                                        <span className="font-bold block mb-1 text-[13px]">Ketentuan Ongkos Kirim (Area DIY)</span>
                                        <p className="mb-2 text-orange-800">
                                            Jarak pengiriman dihitung dari alamat toko kami:<br />
                                            <span className="font-semibold">Jl. Sampaan - Berbah, Berbah, Tegaltirto, Berbah, Sleman Regency, Special Region of Yogyakarta 55573</span>
                                        </p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li><span className="font-medium text-green-700">GRATIS Ongkir:</span> Belanja ≥ Rp 1.500.000 <b>dan</b> Jarak &lt; 5 km dari toko.</li>
                                            <li><span className="font-medium text-gray-700">Ongkir Rp 250.000:</span> Belanja &lt; Rp 1.500.000 <b>atau</b> Jarak ≥ 5 km dari toko.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center text-sm font-bold text-gray-900 mb-1">
                                            <svg className="w-4 h-4 text-green-600 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            Rumah • Lana
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed pr-8">
                                            Jl. Malioboro No. 1, Sosromenduran, Gedong Tengen, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55271, 6281913792626
                                        </p>
                                    </div>
                                    <button className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition whitespace-nowrap">
                                        Ganti
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 1b. Alamat Toko (Jika diambil sendiri) */}
                        {metodePengiriman === 'Diambil Sendiri ke Toko' && (
                            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                                <p className="text-sm font-bold text-gray-700 mb-4 tracking-wide">LOKASI PENGAMBILAN (ALAMAT TOKO)</p>
                                <div className="flex items-start">
                                    <div className="bg-orange-50 p-3 rounded-xl mr-4 hidden sm:block border border-orange-100">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="flex items-center text-base font-bold text-gray-900 mb-1">
                                            Toko TB. Lumbung Jaya
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed pr-8 mb-3">
                                            Jl. Sampaan - Berbah, Berbah, Tegaltirto, Kec. Berbah, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55573
                                        </p>
                                        <div className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg font-semibold border border-blue-100 shadow-sm">
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            Harap tunjukkan bukti pesanan saat pengambilan barang
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Pesanan */}
                        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="text-sm font-bold text-gray-700 tracking-wide">PESANAN 1</span>
                                <span className="text-gray-400 text-sm">•</span>
                                <span className="text-sm text-gray-500">Reguler</span>
                            </div>

                            <div className="flex items-center mb-4">
                                <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-white text-xs font-bold">B</span>
                                </div>
                                <span className="font-bold text-gray-900 text-sm">TB. Lumbung Jaya</span>
                            </div>

                            {/* Daftar Produk */}
                            <div className="space-y-6 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex cross-start gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm text-gray-900 leading-snug">{item.name}</p>
                                                <p className="text-sm font-bold text-gray-900 ml-4 whitespace-nowrap">{item.quantity} x Rp{item.price.toLocaleString('id-ID')}</p>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Proteksi */}
                            <label className="flex items-center mb-6 cursor-pointer group pl-20">
                                <input
                                    type="checkbox"
                                    checked={pakaiProteksi}
                                    onChange={(e) => setPakaiProteksi(e.target.checked)}
                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3"
                                />
                                <span className="text-sm text-gray-700">Proteksi Rusak Total 3 bulan</span>
                                <span className="text-sm text-gray-500 ml-1">(Rp{biayaProteksi.toLocaleString('id-ID')})</span>
                            </label>

                            {/* Pengiriman Dropdown - Demo Only MUI-like Layout */}
                            <div className="pl-20">
                                <div className="border border-gray-200 rounded-lg p-3 hover:border-green-500 cursor-pointer transition">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-bold text-gray-900">
                                            {metodePengiriman === 'Diantar ke Rumah'
                                                ? `Kurir Toko (Rp${ongkosKirim.toLocaleString('id-ID')})`
                                                : 'Ambil di Toko (Gratis)'}
                                        </p>
                                        {metodePengiriman === 'Diantar ke Rumah' && (
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {metodePengiriman === 'Diantar ke Rumah' ? 'Dikirim langsung oleh kurir kami' : 'Bisa diambil hari ini'}
                                    </p>
                                </div>

                                {/* Asuransi Pengiriman */}
                                <label className="flex items-center mt-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={pakaiAsuransi}
                                        onChange={(e) => setPakaiAsuransi(e.target.checked)}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-2"
                                    />
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <span className="text-sm text-gray-900">Pakai Asuransi Pengiriman</span>
                                    </div>
                                    <span className="text-sm text-gray-500 ml-1">(Rp{biayaAsuransi.toLocaleString('id-ID')})</span>
                                </label>
                            </div>

                            {/* Catatan */}
                            <div className="mt-6 border-t border-gray-100 pt-4">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    <input
                                        type="text"
                                        placeholder="Kasih Catatan"
                                        className="flex-1 text-sm border-none focus:ring-0 p-0 placeholder-gray-400"
                                        value={catatan}
                                        onChange={(e) => setCatatan(e.target.value)}
                                        maxLength={200}
                                    />
                                    <span className="text-xs text-gray-400">{catatan.length}/200 {'>'}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* KANAN - Sidebar Summary */}
                    <div className="lg:w-[35%] flex flex-col gap-4">

                        {/* Metode Pembayaran */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-0 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">PILIH METODE PEMBAYARAN</p>
                            </div>

                            {/* QRIS */}
                            <label className={`flex flex-col p-5 border-b border-gray-100 cursor-pointer transition-all ${selectedPayment === 'QRIS' ? 'bg-orange-50/50' : 'hover:bg-gray-50'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center p-1 shadow-sm font-black text-[10px] text-blue-900 italic shrink-0">QRIS</div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 tracking-tight leading-none mb-1 text-left">QRIS (Gopay/OVO/Dana)</p>
                                            <p className="text-[10px] text-gray-500 font-medium tracking-wide text-left">Bayar instan via scan kode QR</p>
                                        </div>
                                    </div>
                                    <input type="radio" name="payment" value="QRIS" checked={selectedPayment === 'QRIS'} onChange={() => setSelectedPayment('QRIS')} className="w-4 h-4 text-orange-600 focus:ring-orange-500" />
                                </div>

                                {selectedPayment === 'QRIS' && (
                                    <div className="mt-3 p-4 bg-white rounded-2xl border border-orange-100 shadow-sm flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-2 duration-300">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 leading-none text-center">SCAN QR CODE DI BAWAH INI</p>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QRIS Code" className="w-40 h-40 object-contain mb-2" />
                                        <p className="text-xs font-bold text-gray-700">TB. Lumbung Jaya</p>
                                    </div>
                                )}
                            </label>

                            {/* Transfer Bank */}
                            <label className={`flex flex-col p-5 cursor-pointer transition-all ${selectedPayment === 'Mandiri' ? 'bg-orange-50/50' : 'hover:bg-gray-50'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center p-1 shadow-sm font-black text-[10px] text-blue-800 uppercase italic tracking-tighter shrink-0">MANDIRI</div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 tracking-tight leading-none mb-1 text-left">Virtual Account Mandiri</p>
                                            <p className="text-[10px] text-gray-500 font-medium tracking-wide italic text-left">Dicek secara otomatis</p>
                                        </div>
                                    </div>
                                    <input type="radio" name="payment" value="Mandiri" checked={selectedPayment === 'Mandiri'} onChange={() => setSelectedPayment('Mandiri')} className="w-4 h-4 text-orange-600 focus:ring-orange-500" />
                                </div>

                                {selectedPayment === 'Mandiri' && (
                                    <div className="mt-3 p-4 bg-white rounded-2xl border border-orange-100 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2 leading-none text-left">NOMOR REKENING TUJUAN</p>
                                        <div className="flex items-center justify-between group">
                                            <div className="text-left">
                                                <p className="text-lg font-black text-gray-900 tracking-tighter leading-none mb-1.5">{bankAccount.number}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{bankAccount.owner}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigator.clipboard.writeText(bankAccount.number);
                                                    alert('Nomor rekening disalin!');
                                                }}
                                                className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:bg-orange-600 hover:text-white px-3 py-2 rounded-lg border border-orange-100 transition-all active:scale-95"
                                            >
                                                Salin
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* Ringkasan Belanja */}
                        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                            <h2 className="text-base font-bold text-gray-900 mb-4">Cek ringkasan transaksimu, yuk</h2>

                            <div className="space-y-3 mb-4 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <p>Total Harga ({totalQty} Barang)</p>
                                    <p className="text-gray-900">Rp{hargaBarang.toLocaleString('id-ID')}</p>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <p>Total Ongkos Kirim</p>
                                    <p className="text-gray-900">Rp{ongkosKirim.toLocaleString('id-ID')}</p>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <p>Total Asuransi Pengiriman</p>
                                    <p className="text-gray-900">Rp{biayaAsuransi.toLocaleString('id-ID')}</p>
                                </div>
                                {pakaiProteksi && (
                                    <div className="flex justify-between text-gray-600">
                                        <p>Total Proteksi</p>
                                        <p className="text-gray-900">Rp{biayaProteksi.toLocaleString('id-ID')}</p>
                                    </div>
                                )}
                                <div className="flex items-center text-gray-500 cursor-pointer">
                                    Total Lainnya
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-5">
                                <p className="font-bold text-gray-900">Total Tagihan</p>
                                <p className="font-bold text-xl text-gray-900">Rp{calculateTotal().toLocaleString('id-ID')}</p>
                            </div>

                            {/* Upload Bukti Pembayaran */}
                            <div className="mb-5">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Upload Bukti Pembayaran</label>
                                {previewUrl ? (
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 relative">
                                        <div className="space-y-1 text-center w-full">
                                            <div className="relative mx-auto rounded-lg overflow-hidden flex flex-col items-center">
                                                <img src={previewUrl} alt="Preview Bukti" className="h-40 object-contain rounded-md border border-gray-200" />
                                                <p className="mt-2 text-sm text-green-600 font-medium truncate w-full px-4">{buktiPembayaran?.name}</p>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setBuktiPembayaran(null);
                                                        setPreviewUrl(null);
                                                    }}
                                                    className="mt-3 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100 font-semibold"
                                                >
                                                    Hapus Foto
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <label htmlFor="file-upload" className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-orange-500 transition-colors bg-gray-50 cursor-pointer group">
                                        <div className="space-y-1 text-center w-full">
                                            <svg className="mx-auto h-10 w-10 text-gray-400 group-hover:text-orange-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <span className="font-medium text-orange-600 group-hover:text-orange-500 mr-1">Upload a file</span>
                                                <span>or drag and drop</span>
                                                <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setBuktiPembayaran(file);
                                                        setPreviewUrl(URL.createObjectURL(file));
                                                    }
                                                }} />
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF max 10MB</p>
                                        </div>
                                    </label>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    if (!buktiPembayaran) {
                                        alert('Harap unggah bukti pembayaran terlebih dahulu!');
                                        return;
                                    }
                                    router.push('/pembayaran/berhasil');
                                }}
                                className="w-full bg-[#03AC0E] hover:bg-[#03990D] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Bayar Sekarang
                            </button>

                            <p className="text-[11px] text-gray-500 text-center mt-4 leading-tight">
                                Dengan melanjutkan pembayaran, kamu menyetujui S&K <br />
                                <a href="#" className="underline">Asuransi Pengiriman & Proteksi</a>
                            </p>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
}
