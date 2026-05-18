'use client';
import React, { useState } from 'react';
import { UserCog, Mail, Phone, ShieldCheck, Camera, Bell, Lock, LogOut, ChevronRight, User, Save, Ban, Pencil, Calendar } from 'lucide-react';

interface ProfileClientProps {
    userData: {
        id: number;
        name: string;
        role: 'owner' | 'employee';
    },
    userEmail: string;
    userPhone: string;
    joinDate: string;
    birthDate: string;
}

export default function ProfileClient({ userData, userEmail, userPhone, joinDate, birthDate }: ProfileClientProps) {
    const isOwner = userData.role === 'owner';
    const themeColor = isOwner ? 'text-orange-600' : 'text-orange-600';
    const themeBg = isOwner ? 'bg-orange-50' : 'bg-orange-50';
    const themeBorder = isOwner ? 'border-orange-100' : 'border-orange-100';
    const themeIconColor = isOwner ? 'text-orange-400' : 'text-orange-400';
    const themeHoverBorder = isOwner ? 'focus-within:border-orange-200 focus-within:shadow-orange-200/10' : 'focus-within:border-orange-200 focus-within:shadow-orange-200/10';
    
    const [name, setName] = useState(userData.name);
    const [phone, setPhone] = useState(userPhone);
    const [reseting, setReseting] = useState(false);

    const handleResetPassword = async () => {
        if (!confirm(`Apakah Anda yakin ingin mereset password ke tanggal lahir (${birthDate})?`)) return;

        setReseting(true);
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
        } finally {
            setReseting(false);
        }
    };

    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20 text-left animate-in fade-in zoom-in-95 duration-500">
            {/* Page Heading */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${themeBg} ${themeColor} rounded-2xl flex items-center justify-center border ${themeBorder} shadow-sm`}>
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <span className={`text-[10px] font-black ${themeColor} uppercase tracking-[0.25em] leading-none block mb-1.5`}>Account Management</span>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Profil Saya</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                    <Calendar className="w-3.5 h-3.5" /> Bergabung sejak {joinDate}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Avatar & Quick Info */}
                <div className="lg:col-span-1 space-y-10">
                    <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col items-center relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${isOwner ? 'bg-orange-50' : 'bg-orange-50'} rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700`}></div>

                        <div className="relative mb-10">
                            <div className={`w-40 h-40 ${isOwner ? 'bg-orange-100 text-orange-600' : 'bg-orange-100 text-orange-600'} rounded-[48px] flex items-center justify-center text-5xl font-black shadow-inner border-4 border-white group-hover:scale-105 transition-transform duration-500 shadow-lg`}>
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl border border-gray-100 text-gray-400 hover:text-orange-600 hover:border-orange-100 flex items-center justify-center transition-all active:scale-90" title="Ubah Foto Profil">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-center relative z-10 w-full px-4">
                            <div className="mb-3 group/name relative flex items-center justify-center gap-2">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-transparent text-center text-2xl font-black text-gray-900 tracking-tight outline-none focus:text-orange-600 transition-colors w-full min-w-[200px]"
                                        placeholder="Nama Lengkap"
                                    />
                                    <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 ${isOwner ? 'bg-orange-500' : 'bg-orange-500'} group-focus-within/name:w-full transition-all duration-300`}></div>
                                </div>
                                <Pencil className={`w-4 h-4 text-gray-200 group-hover/name:${isOwner ? 'text-orange-400' : 'text-orange-400'} transition-colors shrink-0`} />
                            </div>
                            
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 ${themeBg} border ${themeBorder} rounded-full mb-8 shadow-sm`}>
                                {isOwner ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserCog className="w-3.5 h-3.5" />}
                                <span className={`text-[10px] font-black ${themeColor} uppercase tracking-[0.2em]`}>{isOwner ? 'Pemilik Toko' : 'Karyawan'}</span>
                            </div>

                            <div className="flex flex-col gap-3 w-full">
                                <button className="w-full py-4 px-6 bg-gray-50 hover:bg-gray-100 text-[10px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest rounded-2xl transition-all flex items-center justify-between group/btn border border-transparent hover:border-gray-200">
                                    <span className="flex items-center gap-3"><Bell className="w-4 h-4" /> Notifikasi</span>
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full py-4 px-6 bg-gray-50 hover:bg-gray-100 text-[10px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest rounded-2xl transition-all flex items-center justify-between group/btn border border-transparent hover:border-gray-200">
                                    <span className="flex items-center gap-3"><Lock className="w-4 h-4" /> Keamanan Akun</span>
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full py-4 px-6 bg-red-50 hover:bg-red-500 hover:text-white text-[10px] font-black text-red-500 uppercase tracking-widest rounded-2xl transition-all flex items-center justify-between group/btn shadow-sm hover:shadow-red-500/20">
                                    <span className="flex items-center gap-3"><LogOut className="w-4 h-4" /> Keluar Sesi</span>
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info & Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[40px] p-16 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden h-full flex flex-col">
                        <div className="flex items-center gap-6 mb-12">
                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">Informasi Personal Detail</h4>
                            <div className="h-px bg-gray-100 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 flex-1">
                            {/* Email (Locked) */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                        <Mail className={`w-4 h-4 ${themeColor}`} /> Alamat Email Resmi
                                    </label>
                                    <span className="flex items-center gap-1.5 text-[8px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                        <Ban className="w-3 h-3" /> Read Only
                                    </span>
                                </div>
                                <div className="px-8 py-5 bg-gray-100/50 rounded-[28px] border border-gray-200 cursor-not-allowed opacity-80 shadow-inner group/locked">
                                    <input 
                                        type="email" 
                                        value={userEmail}
                                        readOnly
                                        className="w-full bg-transparent outline-none font-bold text-gray-400 text-sm tracking-tight cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Phone (Editable) */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                        <Phone className={`w-4 h-4 ${themeColor}`} /> Kontak Telepon / WA
                                    </label>
                                    <span className={`flex items-center gap-1.5 text-[8px] font-black ${themeColor} uppercase tracking-widest ${themeBg} px-3 py-1 rounded-lg border ${themeBorder} shadow-sm opacity-0 group-hover/input:opacity-100 transition-opacity`}>
                                        <Pencil className="w-3 h-3" /> Editable
                                    </span>
                                </div>
                                <div className={`px-8 py-5 bg-gray-50/50 rounded-[28px] border border-gray-100 shadow-inner group/input ${themeHoverBorder} transition-all cursor-text relative`}>
                                    <input 
                                        type="tel" 
                                        value={phone} 
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-transparent outline-none font-bold text-gray-900 text-sm tracking-tight pr-10"
                                    />
                                    <Pencil className={`absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-200 group-hover/input:${themeIconColor} group-focus-within/input:${themeColor} transition-colors pointer-events-none`} />
                                </div>
                            </div>

                            {/* Jabatan (Locked) */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                        <UserCog className={`w-4 h-4 ${themeColor}`} /> Jabatan Struktural
                                    </label>
                                    <span className="flex items-center gap-1.5 text-[8px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                        <Ban className="w-3 h-3" /> Read Only
                                    </span>
                                </div>
                                <div className="px-8 py-5 bg-gray-100/50 rounded-[28px] border border-gray-200 cursor-not-allowed opacity-80 shadow-inner">
                                    <input 
                                        type="text" 
                                        value={isOwner ? 'Super Admin (Owner)' : 'Staff Operasional'} 
                                        readOnly
                                        className="w-full bg-transparent outline-none font-bold text-gray-400 text-sm tracking-tight cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Status (Implicitly Locked) */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none ml-1">
                                    <ShieldCheck className={`w-4 h-4 ${themeColor}`} /> Status Akun
                                </label>
                                <div className="px-8 py-5 bg-emerald-50/50 rounded-[28px] border border-emerald-100 shadow-inner flex items-center justify-between group">
                                    <p className="font-black text-emerald-700 text-[10px] tracking-widest uppercase">Verified & Active</p>
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-12 border-t border-gray-50">
                            <button 
                                onClick={handleResetPassword}
                                disabled={reseting}
                                className="inline-flex items-center justify-center px-8 py-5 bg-gray-100 hover:bg-orange-50 text-gray-500 hover:text-orange-600 border border-transparent hover:border-orange-100 rounded-full font-black text-[11px] uppercase tracking-[0.25em] transition-all active:scale-95 group"
                            >
                                <Lock className={`w-4 h-4 mr-2.5 ${reseting ? 'animate-spin' : ''}`} />
                                {reseting ? 'Memproses...' : 'Reset ke Password Default'}
                            </button>
                            <button className={`inline-flex items-center justify-center px-12 py-5 ${isOwner ? 'bg-orange-600 shadow-orange-600/20 hover:bg-orange-700' : 'bg-orange-600 shadow-orange-600/20 hover:bg-orange-700'} text-white rounded-full font-black text-[11px] uppercase tracking-[0.25em] shadow-xl hover:scale-105 transition-all active:scale-95 group`}>
                                <Save className="w-4 h-4 mr-2.5 group-hover:rotate-12 transition-transform" />
                                Perbarui Informasi &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
