"use client";

import Link from 'next/link';

export default function PembayaranBerhasilPage() {
    return (
        <div className="min-h-screen bg-[#F3F4F5] flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-sm border border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Pembayaran Berhasil!</h1>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    Terima kasih, pembayaranmu sedang kami verifikasi. Pesananmu akan segera diproses.
                </p>

                <div className="space-y-3">
                    <Link href="/history-transaksi" className="w-full block bg-[#03AC0E] hover:bg-[#03990D] text-white font-bold py-3 px-4 rounded-lg transition text-sm">
                        Cek Status Pesanan
                    </Link>
                    <Link href="/" className="w-full block bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-lg border border-gray-200 transition text-sm">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}
