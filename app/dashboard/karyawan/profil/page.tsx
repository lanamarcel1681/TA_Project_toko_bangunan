'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    UserCog, Edit3, Mail, Phone, CalendarDays, ShieldCheck,
    Save, Ban, Pencil, Camera, Loader2, CheckCircle2, AlertCircle, X
} from 'lucide-react';

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    birthdate: string;
    avatar: string | null;
    jabatan: string;
}

export default function ProfilKaryawanSayaPage() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Editable fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch profile from API on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/user/profile');
                if (!res.ok) throw new Error('Gagal memuat profil');
                const data: ProfileData = await res.json();
                setProfile(data);
                setName(data.name);
                setPhone(data.phone || '');
                setBirthdate(data.birthdate || '');
                setAvatarUrl(data.avatar || null);
            } catch (e) {
                console.error(e);
                showToast('error', 'Gagal memuat data profil.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    function showToast(type: 'success' | 'error', message: string) {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    }

    function handleEnterEdit() {
        setIsEditMode(true);
    }

    function handleCancelEdit() {
        if (!profile) return;
        setName(profile.name);
        setPhone(profile.phone || '');
        setBirthdate(profile.birthdate || '');
        setAvatarUrl(profile.avatar || null);
        setAvatarPreview(null);
        setIsEditMode(false);
    }

    async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview immediately
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
        setIsUploadingPhoto(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok || !data.url) throw new Error(data.error || 'Upload gagal');
            setAvatarUrl(data.url);
        } catch (err) {
            console.error(err);
            showToast('error', 'Gagal mengunggah foto. Coba lagi.');
            setAvatarPreview(null);
        } finally {
            setIsUploadingPhoto(false);
        }
    }

    async function handleSave() {
        if (!name.trim()) {
            showToast('error', 'Nama tidak boleh kosong.');
            return;
        }
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phone.trim(),
                    birthdate: birthdate.trim(),
                    avatar: avatarUrl,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');

            // Update local profile state
            setProfile(prev => prev ? {
                ...prev,
                name: name.trim(),
                phone: phone.trim(),
                birthdate: birthdate.trim(),
                avatar: avatarUrl,
            } : prev);
            setAvatarPreview(null);
            setIsEditMode(false);
            showToast('success', 'Profil berhasil diperbarui!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
            showToast('error', msg);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleResetPassword() {
        if (!confirm(`Apakah Anda yakin ingin mereset password ke tanggal lahir (${birthdate})?`)) return;

        try {
            const res = await fetch('/api/auth/reset-password-default', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert("Terjadi kesalahan saat mereset password");
        }
    }

    const displayAvatar = avatarPreview || avatarUrl;
    const initials = name ? name.charAt(0).toUpperCase() : '?';

    if (isLoading) {
        return (
            <div className="p-8 w-full max-w-[1400px] mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                    <p className="font-semibold text-sm">Memuat profil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border transition-all animate-in slide-in-from-top-2 duration-300 ${toast.type === 'success'
                        ? 'bg-white border-green-100 text-green-700'
                        : 'bg-white border-red-100 text-red-600'
                    }`}>
                    {toast.type === 'success'
                        ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        : <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
                    <span className="font-semibold text-sm">{toast.message}</span>
                    <button onClick={() => setToast(null)} className="ml-2 text-gray-300 hover:text-gray-500 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Profil Saya</h1>
            </div>

            <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-xl flex flex-col items-center relative overflow-hidden group">
                {/* Decorative */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />

                {/* Avatar */}
                <div className="relative mb-8 text-center">
                    <div className={`w-40 h-40 rounded-[48px] flex items-center justify-center text-5xl font-black shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 mx-auto overflow-hidden ${displayAvatar ? '' : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'}`}>
                        {displayAvatar
                            ? <img src={displayAvatar} alt="Foto Profil" className="w-full h-full object-cover" />
                            : initials
                        }
                    </div>
                    {/* Camera button — only visible in edit mode */}
                    <button
                        id="btn-ganti-foto"
                        onClick={() => isEditMode && fileInputRef.current?.click()}
                        disabled={!isEditMode || isUploadingPhoto}
                        className={`absolute -bottom-2 -right-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-xl transition-all active:scale-95 ${isEditMode
                                ? 'text-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer scale-100'
                                : 'text-gray-300 cursor-not-allowed scale-90 opacity-50'
                            }`}
                        title={isEditMode ? 'Ganti foto profil' : 'Aktifkan mode edit untuk mengganti foto'}
                    >
                        {isUploadingPhoto
                            ? <Loader2 className="w-5 h-5 animate-spin" />
                            : <Camera className="w-5 h-5" />
                        }
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                    />
                </div>

                {/* Name */}
                <div className="text-center mb-12 relative z-10 w-full max-w-md">
                    <div className="flex flex-col items-center gap-2 mb-2">
                        <div className="relative group/name w-full flex items-center justify-center gap-2">
                            <div className="relative w-full">
                                <input
                                    id="input-nama"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    readOnly={!isEditMode}
                                    className={`bg-transparent text-center text-3xl font-black text-gray-900 tracking-tight outline-none w-full min-w-[250px] transition-colors ${isEditMode ? 'focus:text-blue-600 cursor-text' : 'cursor-default'
                                        }`}
                                    placeholder="Nama Karyawan"
                                />
                                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 bg-blue-500 rounded-full transition-all duration-300 ${isEditMode ? 'w-full' : 'w-0'}`} />
                            </div>
                            {isEditMode && <Pencil className="w-5 h-5 text-blue-400 shrink-0" />}
                        </div>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">
                            Verified Employee
                        </span>
                    </div>
                    <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">
                        {profile?.jabatan || 'Karyawan'}
                    </p>
                </div>

                {/* Info Grid */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 relative z-10">

                    {/* Email — Read Only */}
                    <div className="flex items-center gap-6 p-6 bg-gray-100/50 rounded-3xl border border-gray-200 opacity-80 cursor-not-allowed">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-400">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">EMAIL RESMI</p>
                                <span className="flex items-center gap-1 text-[8px] font-black text-gray-300 uppercase tracking-widest bg-white/50 px-2 py-0.5 rounded-md border border-gray-100">
                                    <Ban className="w-2 h-2" /> LOCKED
                                </span>
                            </div>
                            <p className="font-black text-gray-400 text-lg tracking-tight leading-none">{profile?.email || '-'}</p>
                        </div>
                    </div>

                    {/* Phone — Editable */}
                    <div className={`flex items-center gap-6 p-6 rounded-3xl border transition-all relative ${isEditMode
                            ? 'bg-white border-blue-200 shadow-md cursor-text'
                            : 'bg-gray-50/50 border-transparent cursor-default'
                        }`}>
                        <div className={`p-4 rounded-2xl shadow-sm transition-all ${isEditMode ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}>
                            <Phone className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">NOMOR TELEPON</p>
                                {isEditMode && (
                                    <span className="flex items-center gap-1 text-[8px] font-black text-blue-300 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                        <Pencil className="w-2 h-2" /> EDITABLE
                                    </span>
                                )}
                            </div>
                            <input
                                id="input-telepon"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                readOnly={!isEditMode}
                                className={`w-full bg-transparent font-black text-gray-800 text-lg tracking-tight leading-none outline-none transition-colors ${isEditMode ? 'focus:text-blue-600' : 'cursor-default'}`}
                                placeholder="Nomor telepon..."
                            />
                        </div>
                        {isEditMode && <Pencil className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />}
                    </div>

                    {/* Jabatan — Read Only */}
                    <div className="flex items-center gap-6 p-6 bg-gray-100/50 rounded-3xl border border-gray-200 opacity-80 cursor-not-allowed">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-400">
                            <UserCog className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">POSISI / JABATAN</p>
                                <span className="flex items-center gap-1 text-[8px] font-black text-gray-300 uppercase tracking-widest bg-white/50 px-2 py-0.5 rounded-md border border-gray-100">
                                    <Ban className="w-2 h-2" /> LOCKED
                                </span>
                            </div>
                            <p className="font-black text-gray-300 text-lg tracking-tight leading-none">{profile?.jabatan || '-'}</p>
                        </div>
                    </div>

                    {/* Tanggal Lahir — Read Only */}
                    <div className="flex items-center gap-6 p-6 bg-gray-100/50 rounded-3xl border border-gray-200 opacity-80 cursor-not-allowed">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-400">
                            <CalendarDays className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">TANGGAL LAHIR</p>
                                <span className="flex items-center gap-1 text-[8px] font-black text-gray-300 uppercase tracking-widest bg-white/50 px-2 py-0.5 rounded-md border border-gray-100">
                                    <Ban className="w-2 h-2" /> LOCKED
                                </span>
                            </div>
                            <p className="font-black text-gray-300 text-lg tracking-tight leading-none">{profile?.birthdate || '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="w-full mt-12 pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">KEAMANAN AKUN TERJAMIN</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Edit / Cancel toggle */}
                        {!isEditMode ? (
                            <>
                                <button
                                    onClick={handleResetPassword}
                                    className="flex items-center gap-2 px-6 py-4 bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-orange-600 font-black text-[10px] uppercase tracking-[0.15em] rounded-full border border-gray-100 hover:border-orange-100 transition-all active:scale-95"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    Reset Password Default
                                </button>
                                <button
                                    id="btn-edit-profil"
                                    onClick={handleEnterEdit}
                                    className="flex items-center gap-2 px-8 py-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-black text-[10px] uppercase tracking-[0.15em] rounded-full border border-blue-100 transition-all active:scale-95"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit Profil
                                </button>
                            </>
                        ) : (
                            <button
                                id="btn-batal-edit"
                                onClick={handleCancelEdit}
                                className="flex items-center gap-2 px-8 py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-[0.15em] rounded-full border border-gray-200 transition-all active:scale-95"
                            >
                                <X className="w-4 h-4" />
                                Batal
                            </button>
                        )}

                        {/* Save button */}
                        <button
                            id="btn-simpan-profil"
                            onClick={handleSave}
                            disabled={!isEditMode || isSaving || isUploadingPhoto}
                            className={`flex items-center gap-3 px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.15em] transition-all shadow-xl active:scale-95 ${isEditMode && !isSaving && !isUploadingPhoto
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20 cursor-pointer'
                                    : 'bg-gray-100 text-gray-300 shadow-none cursor-not-allowed'
                                }`}
                        >
                            {isSaving
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Save className="w-4 h-4" />
                            }
                            {isSaving ? 'Menyimpan...' : 'Simpan Perbarui Profil'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
