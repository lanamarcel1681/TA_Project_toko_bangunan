"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useToast } from '../components/Toast';

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
        kategori: {
            nama_kategori: string;
        } | null;
    }
}

export default function KeranjangPage() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/keranjang');
            if (res.ok) {
                const data = await res.json();
                setItems(data.items);
            }
        } catch (error) {
            console.error("Fetch cart error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (cartId: number, newQty: number) => {
        if (newQty < 1) return;
        try {
            const res = await fetch('/api/keranjang', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartId, quantity: newQty })
            });
            if (res.ok) {
                setItems(prev => prev.map(item => 
                    item.id_keranjang === cartId ? { ...item, jumlah_barang: newQty } : item
                ));
                showToast('Jumlah barang diperbarui', 'info');
                window.dispatchEvent(new Event('cart-updated'));
            }
        } catch (error) {
            console.error("Update qty error:", error);
        }
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const removeItem = async (cartId: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/keranjang?id=${cartId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setItems(prev => prev.filter(item => item.id_keranjang !== cartId));
                showToast('Produk telah dihapus dari keranjang', 'success');
                window.dispatchEvent(new Event('cart-updated'));
            }
        } catch (error) {
            console.error("Remove item error:", error);
            showToast('Gagal menghapus produk', 'error');
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const subtotal = items.reduce((sum, item) => sum + item.barang.harga_barang * item.jumlah_barang, 0);
    const total = subtotal;

    if (loading && items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Membuka keranjang...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Keranjang Belanja</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Daftar Barang */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-semibold text-gray-900">Pesanan Anda ({items.length} barang)</h2>
                            </div>

                            {items.length === 0 ? (
                                <div className="p-20 text-center flex flex-col items-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 mb-6">Keranjang Anda masih kosong nih.</p>
                                    <Link href="/produk" className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">Mulai Belanja</Link>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-100 p-6">
                                    {items.map((item) => (
                                        <li key={item.id_keranjang} className="py-6 flex flex-col sm:flex-row gap-6 first:pt-0 last:pb-0">
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 relative group">
                                                <img
                                                    src={item.barang.foto_barang || "https://placehold.co/600x400?text=No+Image"}
                                                    alt={item.barang.nama_barang}
                                                    className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>

                                            <div className="flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-bold text-gray-900">
                                                        <h3 className="line-clamp-1 hover:text-orange-600 cursor-pointer transition-colors">{item.barang.nama_barang}</h3>
                                                        <p className="ml-4 whitespace-nowrap text-orange-600">Rp {item.barang.harga_barang.toLocaleString('id-ID')}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-400 font-medium">{item.barang.kategori?.nama_kategori || 'Produk Material'}</p>
                                                </div>

                                                <div className="flex flex-1 items-end justify-between text-sm mt-4">
                                                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl p-1">
                                                        <button 
                                                            onClick={() => updateQuantity(item.id_keranjang, item.jumlah_barang - 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-orange-600 hover:shadow-sm transition-all"
                                                        >-</button>
                                                        <span className="w-10 text-center text-gray-900 font-bold">{item.jumlah_barang}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.id_keranjang, item.jumlah_barang + 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-orange-600 hover:shadow-sm transition-all"
                                                        >+</button>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            setItemToDelete(item.id_keranjang);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        type="button"
                                                        className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2 group"
                                                    >
                                                        <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Hapus Item
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Ringkasan Belanja */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <div className="w-2 h-8 bg-orange-600 rounded-full"></div>
                                Ringkasan Belanja
                            </h2>

                            <div className="space-y-5">
                                <div className="flex justify-between items-center text-gray-500">
                                    <p className="text-sm font-medium">Total Harga ({items.reduce((sum, item) => sum + item.jumlah_barang, 0)} barang)</p>
                                    <p className="font-bold text-gray-900">Rp {subtotal.toLocaleString('id-ID')}</p>
                                </div>

                                <div className="pt-6 border-t border-gray-50">
                                    <div className="flex justify-between items-center mb-8">
                                        <p className="text-base font-bold text-gray-900">Total Belanja</p>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-orange-600">Rp {total.toLocaleString('id-ID')}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sudah termasuk PPN</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Link
                                    href="/pembayaran"
                                    className="w-full flex justify-center items-center px-6 py-4 bg-orange-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:-translate-y-1 transition-all active:scale-95"
                                >
                                    Lanjut ke Pembayaran
                                </Link>
                                <Link 
                                    href="/produk" 
                                    className="w-full flex justify-center items-center px-6 py-4 bg-gray-50 text-gray-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                                >
                                    Kembali Belanja
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Custom Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 rotate-12 group hover:rotate-0 transition-transform">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Hapus Produk?</h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            Barang ini akan dihapus dari keranjang belanja Anda. Anda yakin ingin melanjutkannya?
                        </p>
                        
                        <div className="flex flex-col w-full gap-3">
                            <button 
                                onClick={() => itemToDelete && removeItem(itemToDelete)}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95"
                            >
                                Ya, Hapus Sekarang
                            </button>
                            <button 
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setItemToDelete(null);
                                }}
                                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
