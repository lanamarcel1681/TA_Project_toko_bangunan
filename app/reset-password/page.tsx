"use client";

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '../components/Toast';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { showToast } = useToast();

    if (!token) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Token Tidak Valid</h2>
                <p className="text-gray-600 mb-6">Tautan reset password tidak lengkap atau tidak valid.</p>
                <Link href="/lupa-password" className="text-orange-600 font-semibold hover:underline">
                    Kirim Ulang Link Reset
                </Link>
            </div>
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            showToast('Konfirmasi password tidak cocok!', 'error');
            return;
        }
        
        if (password.length < 6) {
            showToast('Password minimal harus 6 karakter!', 'warning');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                showToast('Password berhasil diperbarui! Silakan login.', 'success');
                router.push('/login');
            } else {
                showToast(data.error || 'Gagal mereset password. Link mungkin sudah kadaluarsa.', 'error');
            }
        } catch (error) {
            showToast('Gagal menghubungi server.', 'error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Atur Ulang Password</h2>
                <p className="text-gray-500 text-sm">
                    Silakan masukkan password baru Anda. Pastikan password mudah diingat dan aman.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="password" className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">
                        Password Baru
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-black px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors placeholder-gray-400 text-sm bg-gray-50 focus:bg-white pr-10"
                            placeholder="Masukkan password baru"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showPassword ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">
                        Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full text-black px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors placeholder-gray-400 text-sm bg-gray-50 focus:bg-white pr-10"
                            placeholder="Ulangi password baru"
                            required
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || !password || !confirmPassword}
                        className="w-full flex justify-center py-3.5 px-4 rounded-lg text-sm font-bold text-white bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-500/30 transition-all shadow disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Memproses...' : 'Simpan Password Baru'}
                    </button>
                </div>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="antialiased min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-100">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 p-8">
                <Suspense fallback={<div className="text-center p-4">Memuat...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
