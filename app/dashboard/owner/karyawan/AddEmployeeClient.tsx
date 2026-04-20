"use client";

import { useState, useEffect } from 'react';
import { UserPlus, X, User, ShieldCheck, Mail, Phone, Calendar, Save, ArrowRight, Activity, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddEmployeeClient() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [jabatans, setJabatans] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        nama_pegawai: '',
        id_jabatan: '',
        tanggal_lahir: '',
        nomor_telepon: '',
        email_pegawai: '',
        password_pegawai: '',
        status_pegawai: 'Aktif'
    });

    useEffect(() => {
        if (isOpen) {
            fetch('/api/jabatan')
                .then(res => res.json())
                .then(data => setJabatans(data))
                .catch(err => console.error(err));
        }
    }, [isOpen]);

    const [showToast, setShowToast] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const res = await fetch('/api/pegawai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsOpen(false);
                setFormData({
                    nama_pegawai: '',
                    id_jabatan: '',
                    tanggal_lahir: '',
                    nomor_telepon: '',
                    email_pegawai: '',
                    password_pegawai: '',
                    status_pegawai: 'Aktif'
                });
                
                // Show success toast
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000);
                
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Gagal menyimpan data');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan sistem');
        } finally {
            setIsSubmitting(false);
        }
    };

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

            {/* Custom Premium Toast */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-[24px] shadow-2xl flex items-center gap-4 text-white">
                        <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-0.5">Berhasil!</p>
                            <p className="text-sm font-bold text-gray-100">Karyawan baru telah didaftarkan ke sistem.</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="ml-4 p-2 hover:bg-white/5 rounded-xl transition-colors">
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-left">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" onClick={() => setIsOpen(false)}></div>

                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-white/20 animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100 bg-gray-50/50 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.25em]">Human Resources Portal</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Registrasi Personel Baru</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-12 h-12 bg-white text-gray-400 hover:text-orange-600 hover:border-orange-100 border border-transparent rounded-2xl shadow-sm flex items-center justify-center transition-all active:scale-90 relative z-10">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto custom-scrollbar">
                            <form className="space-y-8" id="addEmployeeForm" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><User className="w-3 h-3" /> Nama Lengkap Sesuai KTP</label>
                                        <input required type="text" value={formData.nama_pegawai} onChange={(e) => setFormData({...formData, nama_pegawai: e.target.value})} placeholder="Contoh: Budi Santoso" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><ShieldCheck className="w-3 h-3" /> Penempatan Jabatan</label>
                                        <select required value={formData.id_jabatan} onChange={(e) => setFormData({...formData, id_jabatan: e.target.value})} className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer">
                                            <option value="" disabled>Pilih Posisi</option>
                                            {jabatans.map((j: any) => (
                                                <option key={j.id_jabatan} value={j.id_jabatan}>{j.nama_jabatan}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Calendar className="w-3 h-3" /> Tanggal Lahir</label>
                                        <input required type="date" value={formData.tanggal_lahir} onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})} className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner cursor-pointer" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Mail className="w-3 h-3" /> Email Akses</label>
                                        <input required type="email" value={formData.email_pegawai} onChange={(e) => setFormData({...formData, email_pegawai: e.target.value})} placeholder="budi@bangunanku.com" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Phone className="w-3 h-3" /> Nomor Telepon / WA</label>
                                        <input required type="text" value={formData.nomor_telepon} onChange={(e) => setFormData({...formData, nomor_telepon: e.target.value})} placeholder="0812...." className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Lock className="w-3 h-3" /> Kata Sandi Awal</label>
                                        <input required type="password" value={formData.password_pegawai} onChange={(e) => setFormData({...formData, password_pegawai: e.target.value})} placeholder="Buat kata sandi aman" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                        <p className="text-[10px] text-gray-400 font-medium italic">* Karyawan dapat mengubah kata sandi ini nanti.</p>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-end items-center gap-4 relative">
                            <button onClick={() => setIsOpen(false)} type="button" className="w-full sm:w-auto px-8 py-4 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Batalkan</button>
                            <button type="submit" form="addEmployeeForm" disabled={isSubmitting} className="w-full sm:w-auto px-10 py-4 bg-orange-600 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/40 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3">
                                <Save className="w-4 h-4" /> {isSubmitting ? 'Menyimpan...' : 'Finalisasi Data Karyawan'} <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
