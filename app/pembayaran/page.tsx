"use client";

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
    id_keranjang: number;
    id_pembeli: number;
    id_barang: number;
    jumlah_barang: number;
    barang: {
        id_barang: number;
        nama_barang: string;
        harga_barang: number;
        foto_barang: string | null;
        stok_barang: number;
        id_kategori_barang: number;
    };
}

interface Address {
    id: number;
    label_alamat: string;
    nama_jalan: string;
    kabupaten: string;
    kecamatan: string;
    kelurahan: string;
    kode_pos: string;
    deskripsi_alamat: string;
    isMain: boolean;
    name: string;
    phone: string;
    fullAddress: string;
}

export default function PembayaranPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAlamatModal, setShowAlamatModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [metodePengiriman, setMetodePengiriman] = useState('Diantar ke Rumah');
    const [catatan, setCatatan] = useState('');
    const [pakaiProteksi, setPakaiProteksi] = useState(false);
    const [pakaiAsuransi, setPakaiAsuransi] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<string>('CASH');

    const [buktiPembayaran, setBuktiPembayaran] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const bankAccount = {
        number: '137-000-707-1323',
        owner: 'TB. Lumbung Jaya (Maria Sumiyati)',
        bank: 'MANDIRI'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Cart Items
                const cartRes = await fetch('/api/keranjang');
                const cartData = await cartRes.json();
                if (cartData.items) {
                    setCartItems(cartData.items);
                }

                // Fetch Addresses
                const addrRes = await fetch('/api/user/alamat');
                const addrData = await addrRes.json();
                if (addrData.data) {
                    setAddresses(addrData.data);
                    const main = addrData.data.find((a: Address) => a.isMain) || addrData.data[0];
                    setDefaultAddress(main);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Dynamic Pricing based on cartItems

    const isWholesale = cartItems.some(item => item.jumlah_barang > 10);
    const totalQty = cartItems.reduce((sum, item) => sum + item.jumlah_barang, 0);

    // Subtotal calculations
    const subtotalOriginal = cartItems.reduce((sum, item) => sum + item.barang.harga_barang * item.jumlah_barang, 0);
    // Discount logic
    let discountLabel = "";
    let baseDiscountRate = 0;

    if (subtotalOriginal > 10000000) {
        baseDiscountRate = 0.02;
        discountLabel = isWholesale ? "Diskon Grosir (2%)" : "Diskon Retail (2%)";
    }

    // Calculate total discount
    const discountAmount = subtotalOriginal * baseDiscountRate;
    const hargaBarang = subtotalOriginal - discountAmount;

    // Stock check helper
    const isStockInsufficient = cartItems.some(item => item.jumlah_barang > item.barang.stok_barang);
    const getInsufficientItems = () => cartItems.filter(item => item.jumlah_barang > item.barang.stok_barang);

    // Helpers for Shipping
    const isInsideDIY = (kab: string) => {
        const k = kab.toLowerCase();
        return k.includes('sleman') || k.includes('bantul') || k.includes('gunungkidul') || k.includes('kulon progo') || k.includes('yogyakarta') || k.includes('kota');
    };

    const isUnder10km = (kab: string, kec: string) => {
        const k = kab.toLowerCase();
        const c = kec.toLowerCase();
        // Berbah neighbors within ~10km
        if (k.includes('sleman')) {
            return ['berbah', 'kalasan', 'depok', 'prambanan', 'ngemplak'].some(n => c.includes(n));
        }
        if (k.includes('bantul')) {
            return ['banguntapan', 'piyungan', 'pleret', 'sewon', 'kasihan'].some(n => c.includes(n));
        }
        if (k.includes('yogyakarta') || k.includes('kota')) {
            return ['kotagede', 'umbulharjo', 'gondokusuman', 'mergangsan', 'danurejan', 'pakualaman'].some(n => c.includes(n));
        }
        return false;
    };

    // Hitung Ongkos Kirim
    const calculateOngkosKirim = () => {
        if (metodePengiriman === 'Diambil Sendiri ke Toko') return 0;
        if (!defaultAddress) return 0;

        if (!isInsideDIY(defaultAddress.kabupaten)) return 150000;

        const distUnder10 = isUnder10km(defaultAddress.kabupaten, defaultAddress.kecamatan);

        if (distUnder10) {
            return 0;
        } else {
            return 150000;
        }
    };

    const ongkosKirim = calculateOngkosKirim();
    const biayaProteksi = 8500 * totalQty;
    const biayaAsuransi = 500 * totalQty;

    const calculateTotal = () => {
        let total = hargaBarang + ongkosKirim;
        if (pakaiProteksi) total += biayaProteksi;
        if (pakaiAsuransi) total += biayaAsuransi;
        return total;
    };

    const handleCheckout = async () => {
        if (selectedPayment !== 'CASH' && !buktiPembayaran) {
            alert('Harap unggah bukti pembayaran terlebih dahulu!');
            return;
        }

        if (metodePengiriman === 'Diantar ke Rumah') {
            if (!defaultAddress) {
                alert('Harap tentukan alamat pengiriman!');
                return;
            }
            if (!isInsideDIY(defaultAddress.kabupaten)) {
                alert('Minta maaf, saat ini kami hanya melayani pengiriman area Daerah Istimewa Yogyakarta (DIY).');
                return;
            }
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('metodePengiriman', metodePengiriman);
            formData.append('metodePembayaran', selectedPayment);
            formData.append('ongkosKirim', ongkosKirim.toString());
            formData.append('catatan', catatan);
            formData.append('totalTagihan', calculateTotal().toString());
            if (metodePengiriman === 'Diantar ke Rumah' && defaultAddress) {
                const fullAddress = `${defaultAddress.nama_jalan}, ${defaultAddress.kelurahan}, ${defaultAddress.kecamatan}, ${defaultAddress.kabupaten} ${defaultAddress.kode_pos}`;
                formData.append('alamatTujuan', fullAddress);
            }

            if (buktiPembayaran) {
                formData.append('buktiPembayaran', buktiPembayaran);
            }

            const res = await fetch('/api/checkout', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                router.push(`/pembayaran/berhasil?invoice=${data.no_transaksi}`);
            } else {
                alert(data.error || 'Gagal memproses pembayaran');
            }
        } catch (error) {
            console.error("Checkout Error:", error);
            alert('Terjadi kesalahan koneksi');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F3F4F5] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#F3F4F5]">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Keranjang Anda Kosong</h2>
                    <p className="text-gray-600 mb-8">Silakan tambahkan barang ke keranjang terlebih dahulu.</p>
                    <Link href="/" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">Mulai Belanja</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F3F4F5]">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                        {metodePengiriman === 'Diantar ke Rumah' && (
                            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col space-y-4">
                                <p className="text-sm font-bold text-gray-700 tracking-wide">ALAMAT PENGIRIMAN</p>

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
                                            <li><span className="font-medium text-green-700">GRATIS Ongkir:</span> Jarak &lt; 10 km dari toko.</li>
                                            <li><span className="font-medium text-gray-700">Ongkir Rp 150.000:</span> Jarak ≥ 10 km dari toko.</li>
                                            <li><span className="font-medium text-red-700">Hanya area DIY:</span> Kami hanya melayani pengiriman di wilayah Yogyakarta.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex justify-between items-start">
                                    {defaultAddress ? (
                                        <div>
                                            <div className="flex items-center text-sm font-bold text-gray-900 mb-1">
                                                <svg className="w-4 h-4 text-green-600 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                </svg>
                                                {defaultAddress.label_alamat} • {defaultAddress.name}
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed pr-8">
                                                {defaultAddress.fullAddress}
                                            </p>
                                            {!isInsideDIY(defaultAddress.kabupaten) && (
                                                <p className="text-red-500 text-xs font-bold mt-2 italic">⚠️ Alamat di luar jangkauan (Hanya area DIY)</p>
                                            )}
                                            {isInsideDIY(defaultAddress.kabupaten) && (
                                                <p className="text-green-600 text-[10px] font-bold mt-1 uppercase tracking-wider">
                                                    Estimasi Jarak: {isUnder10km(defaultAddress.kabupaten, defaultAddress.kecamatan) ? '< 10 KM (Dekat)' : '> 10 KM (Jauh)'}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">Belum ada alamat pengiriman</p>
                                    )}
                                    <button onClick={() => setShowAlamatModal(true)} className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition whitespace-nowrap">
                                        Ganti
                                    </button>
                                </div>
                            </div>
                        )}

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

                        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="text-sm font-bold text-gray-700 tracking-wide">PESANAN</span>
                            </div>

                            <div className="flex items-center mb-4">
                                <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-white text-xs font-bold">B</span>
                                </div>
                                <span className="font-bold text-gray-900 text-sm">TB. Lumbung Jaya</span>
                            </div>

                            <div className="space-y-6 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id_keranjang} className="flex cross-start gap-4">
                                        <img
                                            src={item.barang.foto_barang || 'https://via.placeholder.com/150'}
                                            alt={item.barang.nama_barang}
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm text-gray-900 leading-snug">{item.barang.nama_barang}</p>
                                                    {item.jumlah_barang > item.barang.stok_barang && (
                                                        <p className="text-[10px] font-bold text-red-600 mt-1 uppercase tracking-tight italic bg-red-50 inline-block px-1.5 py-0.5 rounded">
                                                            ⚠️ Stok tidak mencukupi (Tersisa: {item.barang.stok_barang})
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 ml-4 whitespace-nowrap">{item.jumlah_barang} x Rp{item.barang.harga_barang.toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <label className="flex items-center mb-6 cursor-pointer group pl-20" hidden>
                                <input
                                    type="checkbox"
                                    checked={pakaiProteksi}
                                    onChange={(e) => setPakaiProteksi(e.target.checked)}
                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3"
                                />
                                <span className="text-sm text-gray-700">Proteksi Rusak Total 3 bulan</span>
                                <span className="text-sm text-gray-500 ml-1">(Rp{biayaProteksi.toLocaleString('id-ID')})</span>
                            </label>

                            <div className="pl-20">
                                <div className="border border-gray-200 rounded-lg p-3 hover:border-green-500 cursor-pointer transition">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-bold text-gray-900">
                                            {metodePengiriman === 'Diantar ke Rumah'
                                                ? `Kurir Toko (Rp${ongkosKirim.toLocaleString('id-ID')})`
                                                : 'Ambil di Toko (Gratis)'}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {metodePengiriman === 'Diantar ke Rumah' ? 'Dikirim langsung oleh kurir kami' : 'Bisa diambil hari ini'}
                                    </p>
                                </div>
                            </div>

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

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-0 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">PILIH METODE PEMBAYARAN</p>
                            </div>

                            {/* Tunai - Only for Pickup */}
                            {metodePengiriman === 'Diambil Sendiri ke Toko' && (
                                <label className={`flex flex-col p-5 border-b border-gray-100 cursor-pointer transition-all ${selectedPayment === 'CASH' ? 'bg-orange-50/50' : 'hover:bg-gray-50'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center p-1 shadow-sm font-black text-[10px] text-green-700 italic shrink-0">CASH</div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 tracking-tight leading-none mb-1 text-left">Bayar di Toko (Tunai)</p>
                                                <p className="text-[10px] text-gray-500 font-medium tracking-wide text-left">Bayar langsung saat ambil barang</p>
                                            </div>
                                        </div>
                                        <input type="radio" name="payment" value="CASH" checked={selectedPayment === 'CASH'} onChange={() => setSelectedPayment('CASH')} className="w-4 h-4 text-orange-600 focus:ring-orange-500" />
                                    </div>
                                </label>
                            )}



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

                        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-base font-bold text-gray-900">Ringkasan Belanja</h2>
                                {discountAmount > 0 && (
                                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tight border border-green-200">
                                        Status: {isWholesale ? 'Grosir' : 'Retail Premium'}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3 mb-4 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <p>Total Harga ({totalQty} Barang)</p>
                                    <p className="text-gray-900 font-medium">Rp{subtotalOriginal.toLocaleString('id-ID')}</p>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <p>{discountLabel}</p>
                                        <p>-Rp{discountAmount.toLocaleString('id-ID')}</p>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <p>Total Ongkos Kirim</p>
                                    <p className="text-gray-900 font-medium">Rp{ongkosKirim.toLocaleString('id-ID')}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-5">
                                <p className="font-bold text-gray-900">Total Tagihan</p>
                                <p className="font-bold text-xl text-gray-900">Rp{calculateTotal().toLocaleString('id-ID')}</p>
                            </div>

                            {isStockInsufficient && (
                                <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                    <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    <div>
                                        <p className="text-[11px] font-bold text-red-700 leading-tight">STOK TIDAK MENCUKUPI</p>
                                        <p className="text-[10px] text-red-600 mt-1">Beberapa barang di keranjangmu melebihi stok yang tersedia. Harap kurangi jumlah barang di keranjang.</p>
                                    </div>
                                </div>
                            )}

                            {/* Upload Bukti Pembayaran */}
                            {selectedPayment !== 'CASH' && (
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
                                                    <span className="font-medium text-orange-600 group-hover:text-orange-500 mr-1">Upload file</span>
                                                    <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setBuktiPembayaran(file);
                                                            setPreviewUrl(URL.createObjectURL(file));
                                                        }
                                                    }} />
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG max 10MB</p>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={handleCheckout}
                                disabled={submitting || isStockInsufficient}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 ${submitting || isStockInsufficient
                                    ? 'bg-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'
                                    }`}
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <span>
                                        {isStockInsufficient
                                            ? 'Stok Tidak Mencukupi'
                                            : 'Selesaikan Pembayaran'}
                                    </span>
                                )}
                            </button>

                            <p className="text-[11px] text-gray-500 text-center mt-4 leading-tight">
                                Dengan melanjutkan pembayaran, kamu menyetujui S&K <br />
                                <a href="#" className="underline">Asuransi Pengiriman & Proteksi</a>
                            </p>
                        </div>

                    </div>
                </div>
            </main>

            {/* Modal Pilih Alamat */}
            {showAlamatModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setShowAlamatModal(false)}
                    ></div>

                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Pilih Alamat Pengiriman</h3>
                            <button
                                onClick={() => setShowAlamatModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Address List */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                            {addresses.length > 0 ? (
                                addresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        onClick={() => {
                                            setDefaultAddress(addr);
                                            setShowAlamatModal(false);
                                        }}
                                        className={`group p-4 rounded-xl border-2 cursor-pointer transition-all ${defaultAddress?.id === addr.id ? 'border-green-500 bg-green-50/30' : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white px-2 py-0.5 rounded italic">
                                                    {addr.label_alamat}
                                                </span>
                                                {addr.isMain && (
                                                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                                                        Utama
                                                    </span>
                                                )}
                                            </div>
                                            {defaultAddress?.id === addr.id && (
                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 mb-1">{addr.name}</p>
                                        <p className="text-xs text-gray-500 mb-2 font-medium">{addr.phone}</p>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            {addr.fullAddress}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-sm text-gray-500 mb-4">Belum ada alamat tersimpan</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                            <Link
                                href="/profile/alamat"
                                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-bold text-gray-600 hover:border-green-500 hover:text-green-600 transition-all bg-white"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Tambah Alamat Baru
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
