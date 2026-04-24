'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle, Truck, MapPin, CreditCard, ShoppingBag, ChevronRight, FileText, MessageSquareText } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function DetailTransaksiPage() {
    const params = useParams();
    const invoiceId = params.invoice;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/user/transaksi/history/${invoiceId}`);
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch detail:", error);
            } finally {
                setLoading(false);
            }
        };

        if (invoiceId) fetchDetail();
    }, [invoiceId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 bg-orange-200 rounded-full"></div>
                    <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest text-left">Memuat Rincian...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Transaksi Tidak Ditemukan</h1>
                    <Link href="/history-transaksi" className="text-orange-600 font-bold hover:underline">Kembali ke Riwayat</Link>
                </div>
            </div>
        );
    }

    const steps = [
        { label: 'Pesanan Dibuat', icon: FileText, active: true, completed: true },
        { label: 'Pembayaran Diverifikasi', icon: CreditCard, active: data.status !== 'Menunggu Verifikasi Pembayaran', completed: data.status !== 'Menunggu Verifikasi Pembayaran' },
        { label: 'Sedang Dikemas', icon: Package, active: ['Menunggu Pengemasan', 'Siap Diambil', 'Sedang Dikirim', 'Selesai'].includes(data.status), completed: ['Siap Diambil', 'Sedang Dikirim', 'Selesai'].includes(data.status) },
        { label: 'Dalam Pengiriman', icon: Truck, active: ['Sedang Dikirim', 'Selesai'].includes(data.status), completed: data.status === 'Selesai' },
        { label: 'Selesai', icon: CheckCircle, active: data.status === 'Selesai', completed: data.status === 'Selesai' }
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header Sticky */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-left">
                        <Link href="/history-transaksi" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:text-orange-600 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none mb-1">Rincian Pembelian</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{data.inv}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mt-8">
                {/* Status Stepper */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 overflow-x-auto">
                    <div className="flex justify-between items-start min-w-[600px] px-4">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center flex-1 relative group">
                                {idx !== 0 && (
                                    <div className={`absolute left-[-50%] top-6 w-full h-[2px] ${step.active ? 'bg-orange-500' : 'bg-gray-100'}`}></div>
                                )}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${step.completed ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : step.active ? 'bg-orange-100 text-orange-600 border-2 border-orange-500' : 'bg-gray-50 text-gray-300 border-2 border-gray-100'}`}>
                                    <step.icon className="w-5 h-5" />
                                </div>
                                <p className={`mt-4 text-[9px] font-black uppercase tracking-widest text-center ${step.active ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Items & Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-8 text-left">
                                <ShoppingBag className="w-5 h-5 text-orange-600" />
                                <h2 className="font-black text-gray-900 tracking-tight">Daftar Produk</h2>
                            </div>
                            <div className="space-y-6">
                                {data.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0 group-hover:scale-105 transition-transform">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-200"><Package className="w-8 h-8" /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center text-left">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 leading-tight mb-1">{item.name}</h4>
                                                    <p className="text-xs text-gray-400 font-medium">{item.qty} x Rp {item.price.toLocaleString('id-ID')}</p>
                                                    <p className="text-sm font-black text-orange-600 mt-2">Rp {item.subtotal.toLocaleString('id-ID')}</p>
                                                </div>
                                                {data.status === 'Selesai' && (
                                                    item.id_ulasan ? (
                                                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-1">
                                                            <CheckCircle className="w-3 h-3" /> Sudah Diulas
                                                        </span>
                                                    ) : (
                                                        <Link 
                                                            href={`/history-transaksi/ulasan?id_detail=${item.id_detail}`}
                                                            className="px-4 py-2 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-orange-700 transition-all flex items-center gap-2 shadow-lg shadow-orange-100 active:scale-95"
                                                        >
                                                            <MessageSquareText className="w-3.5 h-3.5" /> Beri Ulasan
                                                        </Link>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-6 text-left">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <h2 className="font-black text-gray-900 tracking-tight">Informasi Pengantaran</h2>
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Metode</p>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-black text-gray-800 text-sm">
                                    {data.method}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Totals & Receipt Style */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-6xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                            {/* Decorative Cutout at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[radial-gradient(circle_at_5px_1px,rgba(0,0,0,0)_5px,#fff_0)] bg-[length:10px_10px] transform rotate-180"></div>

                            <h2 className="font-black text-gray-900 tracking-tight mb-8 text-left uppercase text-[10px] tracking-[0.2em] text-gray-400">Ringkasan Pembayaran</h2>

                            <div className="mb-8 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No. Transaksi</span>
                                <span className="text-xs font-black text-gray-900 tracking-tight">{data.inv}</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-medium">Total Harga Barang</span>
                                    <span className="text-gray-900 font-black">Rp {(data.total - data.ongkir).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-medium">Total Ongkos Kirim</span>
                                    <span className="text-gray-900 font-black">Rp {data.ongkir.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between">
                                    <span className="text-gray-900 font-black">Total Belanja</span>
                                    <span className="text-orange-600 font-black text-lg">Rp {data.total.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Status Pembayaran</p>
                                <p className="text-xs font-black text-orange-600 uppercase tracking-widest">{data.payment.status}</p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] mb-4">Terima Kasih</p>
                                <div className="flex justify-center gap-2">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="w-1.5 h-6 bg-gray-50 rounded-full"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {data.payment.proof && (
                            <button
                                onClick={() => window.open(data.payment.proof, '_blank')}
                                className="w-full bg-white border border-gray-200 p-4 rounded-3xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all font-black text-[10px] uppercase tracking-widest text-gray-500"
                            >
                                <FileText className="w-4 h-4" /> Lihat Bukti Transfer
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
