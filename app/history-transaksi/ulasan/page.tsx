'use client';
import React, { useState } from 'react';
import { Star, MessageSquareText, PackageCheck, Send, ImagePlus } from 'lucide-react';
import Link from 'next/link';

export default function UlasanPelangganPage() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    return (
        <div className="p-8 w-full max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
                <Link href="/history-transaksi" className="text-blue-600 hover:underline font-semibold text-sm">
                    &larr; Kembali ke History Transaksi
                </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Berikan Ulasan Produk</h1>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                {/* Info Produk */}
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100 mb-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                         <PackageCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-gray-800">Semen Gresik 50kg</h2>
                        <p className="text-gray-500 text-sm mb-1">Kategori: Material Dasar</p>
                        <p className="text-gray-800 text-sm font-semibold">Dibeli pada: 20 Maret 2026</p>
                    </div>
                </div>

                {/* Rating Input */}
                <div className="mb-6">
                    <label className="block text-lg font-bold text-gray-800 mb-3 text-center">Bagaimana Kualitas Produk Ini?</label>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`p-2 transition-transform hover:scale-110 ${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(rating)}
                            >
                                <Star className="w-12 h-12 fill-current" />
                            </button>
                        ))}
                    </div>
                    {rating > 0 && (
                        <p className="text-center mt-2 font-bold text-yellow-500">
                            {rating === 1 && 'Sangat Buruk'}
                            {rating === 2 && 'Buruk'}
                            {rating === 3 && 'Cukup Bagus'}
                            {rating === 4 && 'Sangat Bagus'}
                            {rating === 5 && 'Sempurna!'}
                        </p>
                    )}
                </div>

                {/* Ulasan Teks */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MessageSquareText className="w-4 h-4" /> Tulis Ulasan Anda
                    </label>
                    <textarea 
                        rows={4} 
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50 text-gray-800"
                        placeholder="Ceritakan pengalaman Anda menggunakan produk ini. Apakah sesuai deskripsi? Bagaimana kualitasnya?"
                    ></textarea>
                </div>

                {/* Upload Foto */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tambahkan Foto (Opsional)</label>
                    <button className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-500 transition-colors">
                        <ImagePlus className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Brosur/Foto</span>
                    </button>
                </div>

                <div className="flex justify-end">
                    <button className={`px-8 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all ${rating > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`} disabled={rating === 0}>
                        <Send className="w-5 h-5" /> Kirim Ulasan
                    </button>
                </div>
            </div>
        </div>
    );
}
