"use client";

import { useState } from 'react';
import { UserPlus, X, User, ShieldCheck, Mail, Phone, Calendar, Save, ArrowRight, Activity } from 'lucide-react';

export default function AddEmployeeClient() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                type="button"
                className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/40 transition-all active:scale-95 group"
            >
                <UserPlus className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Registrasi Karyawan &rarr;
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-white/20 animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100 bg-gray-50/50 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.25em]">Human Resources Portal</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Registrasi Personel Baru</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-12 h-12 bg-white text-gray-400 hover:text-orange-600 hover:border-orange-100 border border-transparent rounded-2xl shadow-sm flex items-center justify-center transition-all active:scale-90 relative z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Body - Form */}
                        <div className="p-10 overflow-y-auto custom-scrollbar">
                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Nama Lengkap */}
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <User className="w-3 h-3" /> Nama Lengkap Sesuai KTP
                                        </label>
                                        <input type="text" placeholder="Contoh: Budi Santoso" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    {/* Posisi */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <ShieldCheck className="w-3 h-3" /> Penempatan Jabatan
                                        </label>
                                        <select className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer">
                                            <option>Pilih Posisi</option>
                                            <option>Manager Toko</option>
                                            <option>Kasir</option>
                                            <option>Gudang</option>
                                            <option>Sales</option>
                                            <option>Admin</option>
                                            <option>Driver</option>
                                        </select>
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <Activity className="w-3 h-3" /> Status Kepegawaian
                                        </label>
                                        <select className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer">
                                            <option>Aktif</option>
                                            <option>Masa Percobaan</option>
                                            <option>Kontrak</option>
                                            <option>Non-aktif</option>
                                        </select>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <Mail className="w-3 h-3" /> Email Institusional
                                        </label>
                                        <input type="email" placeholder="budi@bangunanku.com" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    {/* No Telepon */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <Phone className="w-3 h-3" /> Nomor Telepon / WA
                                        </label>
                                        <input type="text" placeholder="0812...." className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    {/* Tanggal Bergabung */}
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <Calendar className="w-3 h-3" /> Tanggal Mulai Bergabung
                                        </label>
                                        <input type="date" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner cursor-pointer" />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-end items-center gap-4 relative">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                            <button
                                onClick={() => setIsOpen(false)}
                                type="button"
                                className="w-full sm:w-auto px-8 py-4 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                            >
                                Batalkan Registrasi
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    alert("Menyimpan data simulasi karyawan...");
                                    setIsOpen(false);
                                }}
                                className="w-full sm:w-auto px-10 py-4 bg-orange-600 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/40 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                <Save className="w-4 h-4" /> Finalisasi Data Karyawan <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
