'use client';
import React, { useState } from 'react';
import { UserCog, Edit, Mail, Phone, CalendarCheck, ShieldCheck, MapPin, ChevronRight, Save, Ban, Pencil } from 'lucide-react';

export default function ProfilKaryawanSayaPage() {
    const [name, setName] = useState('Karyawan Toko');
    const [email] = useState('karyawan@bangunan.com');
    const [phone, setPhone] = useState('+62 822 1111 2222');
    const [jabatan] = useState('Staff Gudang & Logistik');
    const [joinDate] = useState('12 JANUARI 2025');

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Profil Profesional</h1>
                <p className="text-gray-500 font-medium">Informasi data diri dan detail penempatan operasional karyawan.</p>
            </div>
            
            <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-xl flex flex-col items-center relative overflow-hidden group">
                {/* Decorative Background Elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>

                <div className="relative mb-8 text-center group/avatar">
                    <div className="w-40 h-40 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-[48px] flex items-center justify-center text-5xl font-black shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 mx-auto">
                        {name.charAt(0)}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all scale-90 hover:scale-100 active:scale-95">
                        <Edit className="w-5 h-5" />
                    </button>
                </div>

                <div className="text-center mb-12 relative z-10 w-full max-w-md">
                    <div className="flex flex-col items-center gap-2 mb-2">
                        <div className="relative group/name w-full flex items-center justify-center gap-2">
                            <div className="relative">
                                <input 
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-transparent text-center text-3xl font-black text-gray-900 tracking-tight outline-none focus:text-blue-600 transition-colors w-full min-w-[250px]"
                                    placeholder="Nama Karyawan"
                                />
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-blue-500 group-focus-within/name:w-full transition-all duration-300"></div>
                            </div>
                            <Pencil className="w-5 h-5 text-gray-200 group-hover/name:text-blue-400 transition-colors shrink-0" />
                        </div>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">Verified Employee</span>
                    </div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs tracking-[0.2em]">{jabatan}</p>
                </div>
                
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 relative z-10">
                    {/* Email (Read Only) */}
                    <div className="flex items-center gap-6 p-6 bg-gray-100/50 rounded-3xl border border-gray-200 opacity-80 cursor-not-allowed group/locked">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-400">
                            <Mail className="w-6 h-6"/>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">EMAIL RESMI</p>
                                <span className="flex items-center gap-1 text-[8px] font-black text-gray-300 uppercase tracking-widest bg-white/50 px-2 py-0.5 rounded-md border border-gray-100"><Ban className="w-2 h-2" /> LOCKED</span>
                            </div>
                            <input type="text" value={email} readOnly className="w-full bg-transparent font-black text-gray-400 text-lg tracking-tight leading-none outline-none cursor-not-allowed" />
                        </div>
                    </div>

                    {/* Phone (Editable) */}
                    <div className="flex items-center gap-6 p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-md transition-all group/card focus-within:border-blue-200 focus-within:bg-white focus-within:shadow-md cursor-text relative">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600 group-hover/card:bg-blue-600 group-hover/card:text-white transition-all">
                            <Phone className="w-6 h-6"/>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">NOMOR TELEPON</p>
                                <span className="flex items-center gap-1 text-[8px] font-black text-blue-300 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 opacity-0 group-hover/card:opacity-100 transition-opacity"><Pencil className="w-2 h-2" /> EDITABLE</span>
                            </div>
                            <input 
                                type="tel" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-transparent font-black text-gray-800 text-lg tracking-tight leading-none outline-none focus:text-blue-600 pr-8" 
                            />
                        </div>
                        <Pencil className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-200 group-hover/card:text-blue-400 group-focus-within/card:text-blue-500 transition-colors pointer-events-none" />
                    </div>

                    {/* Position (Read Only) */}
                    <div className="flex items-center gap-6 p-6 bg-gray-100/50 rounded-3xl border border-gray-200 opacity-80 cursor-not-allowed group/locked">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-400">
                            <UserCog className="w-6 h-6"/>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">POSISI / JABATAN</p>
                                <span className="flex items-center gap-1 text-[8px] font-black text-gray-300 uppercase tracking-widest bg-white/50 px-2 py-0.5 rounded-md border border-gray-100"><Ban className="w-2 h-2" /> LOCKED</span>
                            </div>
                            <input type="text" value={jabatan} readOnly className="w-full bg-transparent font-black text-gray-300 text-lg tracking-tight leading-none outline-none cursor-not-allowed" />
                        </div>
                    </div>

                    {/* Join Date (Read Only) */}
                    <div className="flex items-center gap-6 p-6 bg-gray-100/50 rounded-3xl border border-gray-200 opacity-80 cursor-not-allowed group/locked">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-400">
                            <CalendarCheck className="w-6 h-6"/>
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1.5 leading-none">TANGGAL BERGABUNG</p>
                            <input type="text" value={joinDate} readOnly className="w-full bg-transparent font-black text-gray-300 text-lg tracking-tight leading-none outline-none cursor-not-allowed" />
                        </div>
                    </div>
                </div>

                <div className="w-full mt-12 pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">KEAMANAN AKUN TERJAMIN</span>
                    </div>
                    <button className="flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-full hover:bg-blue-700 font-black text-[10px] uppercase tracking-[0.15em] transition-all shadow-xl shadow-blue-600/20 active:scale-95 group/save">
                        <Save className="w-4 h-4" /> Simpan Perbarui Profil <ChevronRight className="w-4 h-4 group-hover/save:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
