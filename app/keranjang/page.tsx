"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

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
                window.dispatchEvent(new Event('cart-updated'));
            }
        } catch (error) {
            console.error("Update qty error:", error);
        }
    };

    const removeItem = async (cartId: number) => {
        if (!confirm('Hapus item ini dari keranjang?')) return;
        try {
            const res = await fetch(`/api/keranjang?id=${cartId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setItems(prev => prev.filter(item => item.id_keranjang !== cartId));
                window.dispatchEvent(new Event('cart-updated'));
            }
        } catch (error) {
            console.error("Remove item error:", error);
        }
    };

    const subtotal = items.reduce((sum, item) => sum + item.barang.harga_barang * item.jumlah_barang, 0);
    const total = subtotal;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">Membuka keranjang...</div>
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
                                <div className="p-10 text-center text-gray-500">
                                    Keranjang Anda kosong. <Link href="/produk" className="text-orange-600 font-medium">Mulai belanja</Link>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-100 p-6">
                                    {items.map((item) => (
                                        <li key={item.id_keranjang} className="py-6 flex flex-col sm:flex-row gap-6 first:pt-0 last:pb-0">
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100 relative">
                                                <img
                                                    src={item.barang.foto_barang || "https://placehold.co/600x400?text=No+Image"}
                                                    alt={item.barang.nama_barang}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>

                                            <div className="flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3 className="line-clamp-2">{item.barang.nama_barang}</h3>
                                                        <p className="ml-4 whitespace-nowrap">Rp {item.barang.harga_barang.toLocaleString('id-ID')}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{item.barang.kategori?.nama_kategori || 'Produk'}</p>
                                                </div>

                                                <div className="flex flex-1 items-end justify-between text-sm mt-4">
                                                    <div className="flex items-center border border-gray-300 rounded-md">
                                                        <button 
                                                            onClick={() => updateQuantity(item.id_keranjang, item.jumlah_barang - 1)}
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                                                        >-</button>
                                                        <span className="px-3 py-1 text-gray-900 font-medium border-x border-gray-300">{item.jumlah_barang}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.id_keranjang, item.jumlah_barang + 1)}
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                                                        >+</button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.id_keranjang)}
                                                        type="button"
                                                        className="font-medium text-red-600 hover:text-red-500 transition flex items-center gap-1"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Hapus
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Ringkasan Belanja</h2>

                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <p>Total Harga ({items.reduce((sum, item) => sum + item.jumlah_barang, 0)} barang)</p>
                                    <p className="font-medium text-gray-900">Rp {subtotal.toLocaleString('id-ID')}</p>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center bg-orange-50 p-4 rounded-lg border border-orange-100">
                                        <p className="text-base font-bold text-gray-900">Total Belanja</p>
                                        <p className="text-lg font-bold text-orange-600">Rp {total.toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Link
                                    href="/pembayaran"
                                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 transition"
                                >
                                    Lanjut ke Pembayaran
                                </Link>
                                <div className="mt-4 text-center">
                                    <Link href="/produk" className="text-sm font-medium text-orange-600 hover:text-orange-500 transition">
                                        atau Lanjutkan Belanja
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
