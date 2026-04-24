"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function BerhasilContent() {
    const searchParams = useSearchParams();
    const invoice = searchParams.get('invoice');

    return (
        <div className="bg-white rounded-3xl p-10 max-w-sm sm:max-w-md w-full shadow-2xl shadow-orange-100 border border-orange-50 text-center animate-in fade-in zoom-in duration-500">
            {/* Success Icon with Animation */}
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center animate-bounce duration-1000">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
            </div>

            <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Pesanan Terkirim!</h1>
            <p className="text-sm text-gray-500 mb-6 font-medium px-4">
                Pesananmu telah tercatat. Harap tunggu proses verifikasi pembayaran oleh admin.
            </p>

            {/* Timeline Status */}
            <div className="mb-8 px-2 text-center">
                <div className="flex items-center justify-between relative max-w-[280px] mx-auto">
                    {/* Line Background */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-10"></div>
                    
                    {/* Step 1 */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span className="text-[8px] font-black text-gray-400 uppercase">Checkout</span>
                    </div>

                    {/* Step 2 (Active) */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center ring-4 ring-white animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-[8px] font-black text-orange-600 uppercase">Verifikasi</span>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center ring-4 ring-white"></div>
                        <span className="text-[8px] font-black text-gray-400 uppercase">Diproses</span>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center ring-4 ring-white"></div>
                        <span className="text-[8px] font-black text-gray-400 uppercase">Selesai</span>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6 mb-8 text-left space-y-4">
                <div>
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Nomor Transaksi</p>
                    <p className="text-lg font-black text-gray-900 tracking-tighter leading-none mb-1">{invoice || 'INV-LOADING...'}</p>
                    <p className="text-[10px] text-gray-400 italic leading-none font-medium">Simpan nomor ini untuk pengecekan manual</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-orange-100 font-sans">
                    <div>
                        <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1.5">Status Saat Ini</p>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                            <span className="text-xs font-black text-orange-700 uppercase tracking-tight">
                                Menunggu Verifikasi
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <Link href="/history-transaksi" className="w-full block bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-100 active:scale-[0.98] text-sm">
                    Cek Status Pesanan
                </Link>
                <Link href="/" className="w-full block bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-xl border border-gray-200 transition-all active:scale-[0.98] text-sm font-sans uppercase tracking-widest">
                    Lanjut Belanja
                </Link>
            </div>

            <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                    <span className="font-black italic uppercase mr-1">Catatan:</span> Kami akan memvalidasi bukti pembayaran Anda dalam waktu <span className="font-bold underline decoration-blue-300">5-10 menit</span>. Pesanan akan diproses otomatis setelah diverifikasi.
                </p>
            </div>
        </div>
    );
}

export default function PembayaranBerhasilPage() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50"></div>
            
            <Suspense fallback={
                <div className="text-orange-600 font-bold animate-pulse">Memuat Detail Pesanan...</div>
            }>
                <BerhasilContent />
            </Suspense>
        </div>
    );
}
