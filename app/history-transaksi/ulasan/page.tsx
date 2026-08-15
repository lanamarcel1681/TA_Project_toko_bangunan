'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Star, MessageSquareText, PackageCheck, Send, ImagePlus, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

function UlasanPelangganContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id_detail = searchParams.get('id_detail');

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [komentar, setKomentar] = useState('');
    const [fotoUlasan, setFotoUlasan] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState<any>(null);
    const [reviewed, setReviewed] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id_detail) return;
            try {
                setLoading(true);
                const res = await fetch(`/api/user/ulasan?id_detail=${id_detail}`);
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                    if (json.data.review) {
                        setReviewed(true);
                        setRating(json.data.review.rating);
                        setKomentar(json.data.review.komentar);
                        setFotoUlasan(json.data.review.foto_ulasan || '');
                    }
                }
            } catch (error) {
                console.error("Fetch Data Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id_detail]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran foto maksimal 5MB.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const res = await fetch('/api/upload/ulasan', {
                method: 'POST',
                body: formData
            });
            const json = await res.json();
            if (json.success) {
                setFotoUlasan(json.url);
            } else {
                alert(json.error || 'Gagal mengunggah foto');
            }
        } catch (error) {
            console.error("Upload Error:", error);
            alert('Terjadi kesalahan saat mengunggah foto');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (reviewed || rating === 0) return;

        try {
            setSubmitting(true);
            const res = await fetch('/api/user/ulasan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_detail,
                    rating,
                    komentar,
                    foto_ulasan: fotoUlasan
                })
            });

            const json = await res.json();
            if (json.success) {
                alert('Ulasan berhasil terkirim!');
                router.back();
            } else {
                alert(json.error || 'Gagal mengirim ulasan');
            }
        } catch (error) {
            console.error("Submit Error:", error);
            alert('Terjadi kesalahan teknis');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl font-bold text-gray-800 mb-4">Data tidak ditemukan</h1>
                <Link href="/history-transaksi" className="text-orange-600 hover:underline">Kembali</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="p-4 w-full max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-orange-600 hover:text-orange-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                        ← Kembali
                    </button>
                </div>

                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                        {reviewed ? 'Ulasan Anda' : 'Berikan Ulasan'}
                    </h1>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                    {reviewed && (
                        <div className="absolute top-6 right-6">
                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-green-100 uppercase tracking-wider">
                                <CheckCircle className="w-3.5 h-3.5" /> Sudah Diulas
                            </span>
                        </div>
                    )}

                    {/* Info Produk */}
                    <div className="flex items-start gap-4 pb-6 border-b border-gray-100 mb-6 font-poppins">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 overflow-hidden shrink-0">
                            {data.product.image ? (
                                <img src={data.product.image} alt={data.product.name} className="w-full h-full object-cover" />
                            ) : (
                                <PackageCheck className="w-6 h-6" />
                            )}
                        </div>
                        <div className="pt-1">
                            <h2 className="font-bold text-base text-gray-900 leading-tight mb-1">{data.product.name}</h2>
                            <p className="text-gray-400 text-[10px] font-medium uppercase tracking-widest">
                                Dibeli pada: {new Date(data.transaction.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Rating Input */}
                    <div className="mb-8 text-center border-b border-gray-50 pb-8">
                        <label className="block text-sm font-bold text-gray-800 mb-4 uppercase tracking-widest">
                            {reviewed ? 'Rating Anda' : 'Kualitas Produk'}
                        </label>
                        <div className="flex justify-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    disabled={reviewed}
                                    className={`p-1 transition-all duration-200 ${!reviewed && 'hover:scale-110 active:scale-95'} ${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => !reviewed && setHover(star)}
                                    onMouseLeave={() => !reviewed && setHover(rating)}
                                >
                                    <Star className={`w-8 h-8 ${star <= (hover || rating) ? 'fill-current' : ''}`} />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <div className="mt-3">
                                <span className="text-orange-600 font-bold text-[10px] uppercase tracking-[0.1em]">
                                    {rating === 1 && 'Sangat Buruk'}
                                    {rating === 2 && 'Buruk'}
                                    {rating === 3 && 'Cukup Bagus'}
                                    {rating === 4 && 'Sangat Bagus'}
                                    {rating === 5 && 'Sempurna!'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Photo & Review Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Upload Photo */}
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5 uppercase tracking-widest">
                                <ImagePlus className="w-3.5 h-3.5 text-orange-600" />
                                {reviewed ? 'Foto Produk' : 'Tambah Foto'}
                            </label>

                            <div className="relative group">
                                <div className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden bg-gray-50 ${fotoUlasan ? 'border-orange-500' : 'border-gray-200 hover:border-orange-300'}`}>
                                    {fotoUlasan ? (
                                        <img src={fotoUlasan} alt="Ulasan" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-4">
                                            {uploading ? (
                                                <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
                                            ) : (
                                                <>
                                                    <ImagePlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-[10px] text-gray-400 font-medium leading-tight">Klik untuk unggah foto produk</p>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {!reviewed && (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            disabled={uploading}
                                        />
                                    )}
                                </div>
                                {fotoUlasan && !reviewed && (
                                    <button
                                        onClick={() => setFotoUlasan('')}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md z-20 hover:bg-red-600 transition-colors"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Review Text */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5 uppercase tracking-widest">
                                <MessageSquareText className="w-3.5 h-3.5 text-orange-600" />
                                {reviewed ? 'Komentar Anda' : 'Tulis Ulasan'}
                            </label>
                            <textarea
                                rows={10}
                                readOnly={reviewed}
                                value={komentar}
                                onChange={(e) => setKomentar(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none bg-gray-50 text-gray-800 transition-all font-medium text-sm leading-relaxed ${reviewed ? 'opacity-70 cursor-default' : ''}`}
                                placeholder="Ceritakan pengalaman Anda menggunakan produk ini..."
                            ></textarea>
                        </div>
                    </div>

                    {!reviewed && (
                        <div className="flex justify-end mt-8">
                            <button
                                onClick={handleSubmit}
                                disabled={rating === 0 || submitting || uploading}
                                className={`px-8 py-3 rounded-xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 ${rating > 0 && !uploading ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'} ${submitting ? 'opacity-70' : ''}`}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Menunggu...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" /> Kirim Ulasan
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {reviewed && (
                        <div className="p-4 bg-green-50 rounded-xl border border-green-100 mt-8">
                            <p className="text-[11px] font-bold text-green-700 text-center leading-relaxed">
                                Terima kasih atas ulasannya! Masukan Anda sangat berarti bagi kami.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function UlasanPelangganPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
        }>
            <UlasanPelangganContent />
        </Suspense>
    );
}
