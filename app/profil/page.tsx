'use client';
import React, { useState, useEffect } from 'react';
import { Mail, MapPin, ShoppingBag, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../components/Toast';

export default function UserProfile() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', birthdate: '', avatar: '' });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetch('/api/user/profile')
            .then(res => res.json())
            .then(data => {
                if (data.email) {
                    setFormData({ name: data.name || '', email: data.email || '', phone: data.phone || '', birthdate: data.birthdate || '', avatar: data.avatar || '' });
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage('');

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                showToast('Profil berhasil diperbarui!', 'success');
                setIsEditing(false);
            } else {
                showToast(data.error || 'Gagal memperbarui profil', 'error');
                setMessage('Gagal memperbarui profil: ' + data.error);
            }
        } catch (error) {
            showToast('Terjadi kesalahan jaringan', 'error');
            setMessage('Terjadi kesalahan jaringan.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];

        if (file.size > 5 * 1024 * 1024) {
            showToast("Ukuran gambar tidak boleh lebih dari 5MB.", 'error');
            return;
        }

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            showToast('Mengunggah gambar...', 'info');
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setFormData({ ...formData, avatar: data.url });
                showToast('Gambar berhasil diunggah! Klik Simpan untuk mempermanenkan.', 'success');
            } else {
                showToast(data.error || 'Gagal mengunggah gambar', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan saat mengunggah gambar', 'error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Beranda
                    </Link>
                </div>
                <div className="flex flex-col md:flex-row gap-6">

                    {/* Left Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                            <Link href="/profil" className="p-6 flex items-center gap-4 cursor-pointer transition-colors bg-orange-50/50">
                                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold overflow-hidden shadow-sm">
                                    {formData.avatar ? (
                                        <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        formData.name ? formData.name.charAt(0).toUpperCase() : 'P'
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-sm font-bold text-gray-800">{formData.name || 'Pengguna'}</h2>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">Ubah Profil</p>
                                </div>
                            </Link>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <nav className="flex flex-col py-2">
                                <Link href="/profil" className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors text-left text-orange-600 border-l-4 border-orange-600 bg-orange-50/30">
                                    <Mail className="w-5 h-5" />
                                    Profil Saya
                                </Link>
                                <Link
                                    href="/profil/alamat"
                                    className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors text-left text-gray-600 hover:bg-gray-50 hover:text-orange-600 border-l-4 border-transparent"
                                >
                                    <MapPin className="w-5 h-5" />
                                    Daftar Alamat
                                </Link>
                                <Link href="/history-transaksi" className="flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors text-left text-gray-600 hover:bg-gray-50 hover:text-orange-600 border-l-4 border-transparent">
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag className="w-5 h-5" />
                                        History Transaksi
                                    </div>
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px] overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Profil Saya</h2>
                            <div className="max-w-2xl">
                                {/* Edit Foto */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 items-center border-b border-gray-50 pb-8">
                                    <div className="col-span-1 text-center sm:text-right font-medium text-gray-500">
                                        Foto Profil
                                    </div>
                                    <div className="col-span-2 flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md relative overflow-hidden group flex-shrink-0">
                                            {formData.avatar ? (
                                                <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{formData.name ? formData.name.charAt(0).toUpperCase() : 'P'}</span>
                                            )}
                                            {isEditing && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Ubah</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/jpeg, image/png"
                                                    onChange={handleFileChange}
                                                    disabled={!isEditing}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                                />
                                                <button disabled={!isEditing} className={`px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold transition-colors shadow-sm focus:ring-2 focus:ring-orange-500/30 outline-none ${!isEditing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                                                    Pilih Foto
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2 leading-relaxed">Ukuran gambar: maks. 1 MB.<br />Format: JPEG, PNG.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 items-start">
                                    <div className="col-span-1 text-center sm:text-right font-medium text-gray-500 pt-3">
                                        Nama Lengkap
                                    </div>
                                    <div className="col-span-2">
                                        <input type="text" disabled={!isEditing} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`w-full text-black px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'}`} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 items-start">
                                    <div className="col-span-1 text-center sm:text-right font-medium text-gray-500 pt-3">
                                        Email
                                    </div>
                                    <div className="col-span-2 flex items-center gap-4">
                                        <div className="relative w-full">
                                            <input type="email" disabled value={formData.email} className="w-full text-gray-600 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed" />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 items-start">
                                    <div className="col-span-1 text-center sm:text-right font-medium text-gray-500 pt-3">
                                        Nomor Telepon
                                    </div>
                                    <div className="col-span-2">
                                        <input type="tel" disabled={!isEditing} value={formData.phone === '-' ? '' : formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={`w-full text-black px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'}`} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 items-start">
                                    <div className="col-span-1 text-center sm:text-right font-medium text-gray-500 pt-3">
                                        Tanggal Lahir
                                    </div>
                                    <div className="col-span-2">
                                        <input type="date" disabled={!isEditing} value={formData.birthdate === '-' ? '' : formData.birthdate} onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })} className={`w-full text-black px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'}`} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                                    <div className="col-span-1"></div>
                                    <div className="col-span-2">
                                        {message && (
                                            <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('Gagal') || message.includes('kesalahan') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                {message}
                                            </div>
                                        )}
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => {
                                                    setIsEditing(!isEditing);
                                                    setMessage('');
                                                }}
                                                className="px-6 py-3 font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors border border-orange-200"
                                            >
                                                {isEditing ? 'Batal Edit' : 'Edit Profil'}
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                disabled={!isEditing || isSaving}
                                                className={`px-6 py-3 rounded-xl font-bold transition-all ${!isEditing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-500/20'}`}
                                            >
                                                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
