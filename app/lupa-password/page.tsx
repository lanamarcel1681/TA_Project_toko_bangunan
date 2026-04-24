"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '../components/Toast';

export default function LupaPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { showToast } = useToast();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/lupa-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess(true);
                showToast('Link reset password berhasil dikirim ke email Anda!', 'success');
            } else {
                showToast(data.error || 'Terjadi kesalahan. Pastikan email terdaftar.', 'error');
            }
        } catch (error) {
            showToast('Gagal menghubungi server.', 'error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="antialiased min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-100">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 p-8">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Lupa Password?</h2>
                    <p className="text-gray-500 text-sm">
                        Masukkan email yang terdaftar pada akun Anda. Kami akan mengirimkan tautan untuk mengatur ulang password.
                    </p>
                </div>

                {success ? (
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Email Terkirim!</h3>
                        <p className="text-gray-600 text-sm px-4">
                            Silakan periksa kotak masuk (atau folder spam) email <span className="font-semibold">{email}</span> untuk instruksi selanjutnya.
                        </p>
                        <div className="pt-4">
                            <Link href="/login" className="text-orange-600 font-semibold hover:text-orange-800 transition-colors">
                                Kembali ke Halaman Login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">
                                Email Terdaftar
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full text-black px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors placeholder-gray-400 text-sm bg-gray-50 focus:bg-white"
                                placeholder="Masukkan email Anda"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full flex justify-center py-3.5 px-4 rounded-lg text-sm font-bold text-white bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-500/30 transition-all shadow disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                            </button>
                        </div>
                        
                        <div className="text-center pt-2">
                            <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">
                                Kembali ke Halaman Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
