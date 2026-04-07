'use client';
import React, { useState } from 'react';
import { UserCog, Mail, Phone, ShieldCheck, Camera, Bell, Lock, LogOut, ChevronRight, User, Save, Ban, Pencil } from 'lucide-react';

export default function ProfilOwnerSayaPage() {
    const [name, setName] = useState('Pemilik Toko');
    const [email, setEmail] = useState('pemilik@bangunan.com');
    const [phone, setPhone] = useState('+62 811 0000 9999');
    const [jabatan, setJabatan] = useState('Super Admin (Owner)');

    return (
        <div className="p-8 w-full max-w-5xl mx-auto pb-20 text-left">
            {/* Page Heading */}
            <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5" />
                </div>
                <div>
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] leading-none block mb-1">Account Management</span>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Profil Saya</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Quick Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col items-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative mb-8">
                            <div className="w-40 h-40 bg-orange-100 text-orange-600 rounded-[48px] flex items-center justify-center text-5xl font-black shadow-inner border-4 border-white group-hover:scale-105 transition-transform duration-500">
                                {name.charAt(0)}
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl border border-gray-100 text-gray-400 hover:text-orange-600 hover:border-orange-100 flex items-center justify-center transition-all active:scale-90" title="Ubah Foto Profil">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-center relative z-10 w-full px-4">
                            <div className="mb-2 group/name relative flex items-center justify-center gap-2">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-transparent text-center text-2xl font-black text-gray-900 tracking-tight outline-none focus:text-orange-600 transition-colors w-full min-w-[200px]"
                                        placeholder="Nama Lengkap"
                                    />
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-orange-500 group-focus-within/name:w-full transition-all duration-300"></div>
                                </div>
                                <Pencil className="w-4 h-4 text-gray-300 group-hover/name:text-orange-400 transition-colors shrink-0" />
                            </div>
                            
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-100 rounded-full mb-6">
                                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                                <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Super Admin Utama</span>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <button className="w-full py-4 px-6 bg-gray-50 hover:bg-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest rounded-2xl transition-all flex items-center justify-between group/btn">
                                    <span className="flex items-center gap-3"><Bell className="w-4 h-4" /> Notifikasi</span>
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full py-4 px-6 bg-gray-50 hover:bg-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest rounded-2xl transition-all flex items-center justify-between group/btn">
                                    <span className="flex items-center gap-3"><Lock className="w-4 h-4" /> Keamanan Akun</span>
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full py-4 px-6 bg-red-50 hover:bg-red-500 hover:text-white text-[10px] font-black text-red-500 uppercase tracking-widest rounded-2xl transition-all flex items-center justify-between group/btn">
                                    <span className="flex items-center gap-3"><LogOut className="w-4 h-4" /> Keluar Sesi</span>
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info & Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden h-full">
                        <div className="flex items-center gap-4 mb-10">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Informasi Personal Identitas</h4>
                            <div className="h-px bg-gray-100 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <Mail className="w-3.5 h-3.5 text-orange-600" /> Alamat Email Resmi
                                    </label>
                                    <span className="flex items-center gap-1 text-[8px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                        <Ban className="w-2.5 h-2.5" /> Read Only
                                    </span>
                                </div>
                                <div className="px-6 py-4 bg-gray-100/50 rounded-[24px] border border-gray-200 cursor-not-allowed opacity-70">
                                    <input 
                                        type="email" 
                                        value={email}
                                        readOnly
                                        className="w-full bg-transparent outline-none font-bold text-gray-400 text-sm tracking-tight cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <Phone className="w-3.5 h-3.5 text-orange-600" /> Kontak Telepon / WA
                                    </label>
                                    <span className="flex items-center gap-1 text-[8px] font-black text-orange-300 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 shadow-sm opacity-0 group-hover/input:opacity-100 transition-opacity">
                                        <Pencil className="w-2.5 h-2.5" /> Editable
                                    </span>
                                </div>
                                <div className="px-6 py-4 bg-gray-50/50 rounded-[24px] border border-gray-100 shadow-inner group/input focus-within:border-orange-200 focus-within:bg-white focus-within:shadow-orange-200/10 transition-all cursor-text relative">
                                    <input 
                                        type="tel" 
                                        value={phone} 
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-transparent outline-none font-bold text-gray-900 text-sm tracking-tight pr-8"
                                    />
                                    <Pencil className="absolute right-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 group-hover/input:text-orange-400 group-focus-within/input:text-orange-500 transition-colors pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <UserCog className="w-3.5 h-3.5 text-orange-600" /> Jabatan Struktural
                                    </label>
                                    <span className="flex items-center gap-1 text-[8px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                        <Ban className="w-2.5 h-2.5" /> Read Only
                                    </span>
                                </div>
                                <div className="px-6 py-4 bg-gray-100/50 rounded-[24px] border border-gray-200 cursor-not-allowed opacity-70">
                                    <input 
                                        type="text" 
                                        value={jabatan} 
                                        readOnly
                                        className="w-full bg-transparent outline-none font-bold text-gray-400 text-sm tracking-tight cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-orange-600" /> Status Validitas Akun
                                </label>
                                <div className="px-6 py-4 bg-green-50/50 rounded-[24px] border border-green-100 shadow-inner flex items-center justify-between">
                                    <p className="font-extrabold text-green-700 text-xs tracking-widest uppercase">Aktif & Terverifikasi</p>
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end items-center gap-6 pt-10 border-t border-gray-100">
                            <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-colors">
                                Reset Pengaturan Akun
                            </button>
                            <button className="inline-flex items-center justify-center px-10 py-5 bg-orange-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:scale-105 transition-all active:scale-95 group">
                                <Save className="w-4 h-4 mr-2" />
                                Perbarui Informasi Profil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
