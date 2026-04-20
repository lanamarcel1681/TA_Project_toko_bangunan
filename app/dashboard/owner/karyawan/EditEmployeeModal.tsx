"use client";

import { useState, useEffect } from 'react';
import { X, User, ShieldCheck, Mail, Phone, Calendar, Save, ArrowRight, Activity, Lock, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EditEmployeeModal({ 
    isOpen, 
    onClose, 
    employee,
    onSuccess
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    employee: any;
    onSuccess?: (msg: string) => void;
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [jabatans, setJabatans] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        nama_pegawai: '',
        id_jabatan: '',
        tanggal_lahir: '',
        nomor_telepon: '',
        email_pegawai: '',
        status_pegawai: ''
    });

    useEffect(() => {
        if (isOpen && employee) {
            setFormData({
                nama_pegawai: employee.nama_pegawai || '',
                id_jabatan: employee.id_jabatan?.toString() || '',
                tanggal_lahir: employee.tanggal_lahir || '',
                nomor_telepon: employee.nomor_telepon || '',
                email_pegawai: employee.email_pegawai || '',
                status_pegawai: employee.status_pegawai || 'Aktif'
            });

            fetch('/api/jabatan')
                .then(res => res.json())
                .then(data => setJabatans(data))
                .catch(err => console.error(err));
        }
    }, [isOpen, employee]);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const res = await fetch(`/api/pegawai/${employee.id_pegawai}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                if (onSuccess) onSuccess('Data karyawan berhasil diperbarui!');
                onClose();
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Gagal memperbarui data');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan sistem');
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDeactivate = async () => {
        try {
            setIsSubmitting(true);
            const newStatus = formData.status_pegawai === 'Aktif' ? 'Non-aktif' : 'Aktif';
            const res = await fetch(`/api/pegawai/${employee.id_pegawai}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status_pegawai: newStatus })
            });

            if (res.ok) {
                setIsConfirmOpen(false);
                if (onSuccess) onSuccess(`Status karyawan berhasil diubah menjadi ${newStatus}!`);
                onClose();
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Custom Confirm Modal */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 text-left">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsConfirmOpen(false)}></div>
                    <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl relative z-10 p-10 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">Konfirmasi Keaktifan</h3>
                        <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
                            Apakah Anda yakin ingin merubah status kepegawaian <span className="font-bold text-gray-900">{formData.nama_pegawai}</span>? 
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={confirmDeactivate}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95"
                            >
                                Ya, Lanjutkan Perubahan
                            </button>
                            <button 
                                onClick={() => setIsConfirmOpen(false)}
                                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-left">
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" onClick={onClose}></div>

                <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-white/20 animate-in fade-in zoom-in duration-300 text-left">
                    <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100 bg-gray-50/50 relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-blue-600" />
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em]">Update Personnel Profile</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Edit Data Karyawan</h3>
                        </div>
                        <button onClick={onClose} className="w-12 h-12 bg-white text-gray-400 hover:text-blue-600 hover:border-blue-100 border border-transparent rounded-2xl shadow-sm flex items-center justify-center transition-all active:scale-90 relative z-10">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-10 overflow-y-auto custom-scrollbar">
                        <form className="space-y-8" id="editEmployeeForm" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><User className="w-3 h-3" /> Nama Lengkap</label>
                                    <input 
                                        required 
                                        type="text" 
                                        value={formData.nama_pegawai} 
                                        onChange={(e) => setFormData({...formData, nama_pegawai: e.target.value})} 
                                        disabled={formData.status_pegawai === 'Non-aktif'}
                                        className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><ShieldCheck className="w-3 h-3" /> Penempatan Jabatan</label>
                                    <select 
                                        required 
                                        value={formData.id_jabatan} 
                                        onChange={(e) => setFormData({...formData, id_jabatan: e.target.value})} 
                                        disabled={formData.status_pegawai === 'Non-aktif'}
                                        className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="" disabled>Pilih Posisi</option>
                                        {jabatans.map((j: any) => (
                                            <option key={j.id_jabatan} value={j.id_jabatan}>{j.nama_jabatan}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Activity className="w-3 h-3" /> Status</label>
                                    <select disabled value={formData.status_pegawai} className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner appearance-none cursor-not-allowed opacity-70">
                                        <option value="Aktif">Aktif</option>
                                        <option value="Non-aktif">Non-aktif</option>
                                    </select>
                                    <p className="text-[9px] text-gray-400 font-medium italic ml-1">* Gunakan tombol di bawah untuk mengubah status.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Calendar className="w-3 h-3" /> Tanggal Lahir</label>
                                    <input 
                                        required 
                                        type="date" 
                                        value={formData.tanggal_lahir} 
                                        onChange={(e) => setFormData({...formData, tanggal_lahir: e.target.value})} 
                                        disabled={formData.status_pegawai === 'Non-aktif'}
                                        className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Mail className="w-3 h-3" /> Email</label>
                                    <input 
                                        required 
                                        type="email" 
                                        value={formData.email_pegawai} 
                                        onChange={(e) => setFormData({...formData, email_pegawai: e.target.value})} 
                                        disabled={formData.status_pegawai === 'Non-aktif'}
                                        className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed" 
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Phone className="w-3 h-3" /> Nomor Telepon / WA</label>
                                    <input 
                                        required 
                                        type="text" 
                                        value={formData.nomor_telepon} 
                                        onChange={(e) => setFormData({...formData, nomor_telepon: e.target.value})} 
                                        disabled={formData.status_pegawai === 'Non-aktif'}
                                        className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed" 
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 relative">
                        <button 
                            onClick={() => setIsConfirmOpen(true)}
                            type="button" 
                            className="w-full sm:w-auto px-8 py-4 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> {formData.status_pegawai === 'Aktif' ? 'Nonaktifkan Karyawan' : 'Aktifkan Kembali'}
                        </button>
                        <div className="flex gap-4">
                            <button onClick={onClose} type="button" className="px-8 py-4 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Batal</button>
                            <button 
                                type="submit" 
                                form="editEmployeeForm" 
                                disabled={isSubmitting || formData.status_pegawai === 'Non-aktif'} 
                                className="px-10 py-4 bg-blue-600 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center gap-3"
                                title={formData.status_pegawai === 'Non-aktif' ? 'Aktifkan kembali karyawan untuk dapat mengupdate data.' : ''}
                            >
                                <Save className="w-4 h-4" /> {isSubmitting ? 'Menyimpan...' : 'Update Data'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
