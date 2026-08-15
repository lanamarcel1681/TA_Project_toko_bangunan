"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../components/Toast';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(300);
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        if (step !== 2) return;

        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [step, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const form = e.currentTarget;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;

        if (password.length < 8) {
            setError('Password minimal harus 8 karakter');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setFormData({ name, email, password });
                showToast('OTP berhasil dikirim ke email Anda', 'success');
                setStep(2);
                setTimeLeft(300);
            } else {
                setError(data.error || 'Gagal mengirim OTP');
            }
        } catch (err) {
            setError('Gagal menghubungi server');
        } finally {
            setLoading(false);
        }
    }

    async function handleResendOtp() {
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: formData.name, email: formData.email }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                showToast('OTP baru berhasil dikirim ke email Anda', 'success');
                setTimeLeft(300);
            } else {
                setError(data.error || 'Gagal mengirim ulang OTP');
            }
        } catch (err) {
            setError('Gagal menghubungi server');
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!otp || otp.length < 6) {
            setError('Masukkan OTP yang valid');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, otp }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                showToast('Pendaftaran Berhasil! Silakan login.', 'success');
                setShowSuccessModal(true);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.error || 'Pendaftaran gagal');
                setLoading(false);
            }
        } catch (err) {
            setError('Gagal menghubungi server');
            setLoading(false);
        }
    }

    return (
        <div className="antialiased min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-100">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden min-h-[600px] border border-gray-200">

                {/* Left Side: Branding & Info (Orange Theme) */}
                <div className="w-full md:w-[45%] bg-gradient-to-br from-orange-800 to-orange-600 p-10 lg:p-14 flex flex-col items-center justify-center text-white relative">
                    <div className="absolute inset-0 bg-black opacity-10"></div>

                    <div className="relative z-10 flex flex-col items-center text-center w-full">
                        {/* Logo */}
                        <div className="mb-6 flex flex-col items-center">
                            <div className="bg-white p-4 rounded-full shadow-inner backdrop-blur-sm mb-3">
                                <img src="/Logo.png" alt="Logo TB Lumbung Jaya" className="h-16 w-16 object-contain" />
                            </div>
                            <span className="text-sm font-bold tracking-widest uppercase">TB. Lumbung Jaya</span>
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                            Bergabunglah<br />
                            Bersama Kami
                        </h1>

                        <p className="text-orange-100 text-sm mb-12 max-w-sm leading-relaxed">
                            Daftarkan diri Anda untuk mendapatkan pengalaman belanja material bangunan yang lebih mudah, penawaran eksklusif, dan melacak status pesanan Anda dengan cepat.
                        </p>
                    </div>
                </div>

                {/* Right Side: Registration Form */}
                <div className="w-full md:w-[55%] bg-white p-8 lg:p-14 flex flex-col relative">

                    {/* Back to Home */}
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors mb-6">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        Kembali ke Beranda
                    </Link>

                    <div className="flex-grow flex flex-col justify-center max-w-md w-full mx-auto pb-4">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Daftar Akun Baru</h2>
                        <p className="text-gray-500 text-sm mb-8">Lengkapi form di bawah ini untuk membuat akun Pelanggan Anda.</p>

                        {error && (
                            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start">
                                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleSendOtp} className="space-y-5">

                                {/* Nama Lengkap */}
                                <div>
                                    <label htmlFor="name" className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">Nama Lengkap</label>
                                    <input type="text" id="name" name="name" defaultValue={formData.name} className="w-full text-black px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors placeholder-gray-400 sm:text-sm bg-gray-50 focus:bg-white" placeholder="Masukkan nama lengkap Anda" required />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">Email</label>
                                    <input type="email" id="email" name="email" defaultValue={formData.email} className="w-full text-black px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors placeholder-gray-400 sm:text-sm bg-gray-50 focus:bg-white" placeholder="Masukkan email aktif (@gmail.com)" required />
                                </div>

                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">Password</label>
                                    <div className="relative">
                                        <input type={showPassword ? 'text' : 'password'} id="password" name="password" defaultValue={formData.password} className="w-full text-black px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors placeholder-gray-400 sm:text-sm bg-gray-50 focus:bg-white pr-10" placeholder="Buat password (min. 8 karakter)" required />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
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

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3.5 px-4 rounded-lg text-sm font-bold text-white bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-500/30 transition-all shadow border border-transparent disabled:opacity-60 disabled:cursor-not-allowed">
                                        {loading ? 'Memproses...' : 'Kirim OTP'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-5">
                                <div>
                                    <label htmlFor="otp" className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">Kode OTP</label>
                                    <input type="text" id="otp" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="w-full text-black px-4 py-3 text-center tracking-widest text-xl rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors placeholder-gray-400 bg-gray-50 focus:bg-white" placeholder="------" required />
                                    <p className="text-xs text-gray-500 mt-2 text-center">Kode OTP telah dikirim ke email <strong>{formData.email}</strong></p>
                                </div>
                                <div className="pt-2 flex flex-col gap-3">
                                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3.5 px-4 rounded-lg text-sm font-bold text-white bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-500/30 transition-all shadow border border-transparent disabled:opacity-60 disabled:cursor-not-allowed">
                                        {loading ? 'Memverifikasi...' : 'Verifikasi & Daftar'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={loading || timeLeft > 0}
                                        className="w-full flex justify-center py-2 px-4 rounded-lg text-sm font-medium text-orange-700 hover:bg-orange-50 focus:outline-none transition-all border border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {timeLeft > 0 ? `Kirim Ulang OTP (${formatTime(timeLeft)})` : 'Kirim Ulang OTP Sekarang'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Login Link */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                Sudah punya akun?{' '}
                                <Link href="/login" className="font-bold text-orange-600 hover:text-orange-800 transition-colors">
                                    Masuk di sini
                                </Link>
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-[11px] text-gray-400">
                                &copy; 2026 Toko TB. Lumbung Jaya<br />
                                Sistem Manajemen v1.0.0
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Sukses Pendaftaran */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Akun Anda berhasil dibuat. Anda akan dialihkan ke halaman login secara otomatis...
                        </p>
                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
