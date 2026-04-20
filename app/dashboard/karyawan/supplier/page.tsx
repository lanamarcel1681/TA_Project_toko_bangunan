'use client';
import React, { useState, useEffect } from 'react';
import { 
    Truck, Plus, Search, Edit2, Trash2, Eye, 
    X, User, Phone, MapPin, Building2, 
    ChevronRight, AlertCircle, CheckCircle2, Calendar,
    Loader2
} from 'lucide-react';

interface Supplier {
    id_supplier: number;
    nama_supplier: string;
    nomor_telepon_supplier: string;
    tanggal_lahir_supplier: string;
    nama_perusahaan_supplier: string;
}

export default function ManajemenSupplierKaryawanPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const handleToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastMsg(msg);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
    };

    const [formData, setFormData] = useState({
        nama_supplier: '',
        nama_perusahaan_supplier: '',
        nomor_telepon_supplier: '',
        tanggal_lahir_supplier: ''
    });

    const fetchSuppliers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/supplier${searchQuery ? `?search=${searchQuery}` : ''}`);
            const data = await res.json();
            setSuppliers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            handleToast('Gagal mengambil data dari database', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSuppliers();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = editingId ? `/api/supplier/${editingId}` : '/api/supplier';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                handleToast(editingId ? 'Data Supplier Berhasil Diperbarui!' : 'Supplier Berhasil Ditambahkan ke Database!');
                setIsModalOpen(false);
                setFormData({
                    nama_supplier: '',
                    nama_perusahaan_supplier: '',
                    nomor_telepon_supplier: '',
                    tanggal_lahir_supplier: ''
                });
                setEditingId(null);
                fetchSuppliers();
            } else {
                const err = await res.json();
                handleToast(`Error: ${err.error}`, 'error');
            }
        } catch (error) {
            handleToast('Terjadi kesalahan pada validasi server', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (supplier: Supplier) => {
        setEditingId(supplier.id_supplier);
        setFormData({
            nama_supplier: supplier.nama_supplier,
            nama_perusahaan_supplier: supplier.nama_perusahaan_supplier,
            nomor_telepon_supplier: supplier.nomor_telepon_supplier,
            tanggal_lahir_supplier: supplier.tanggal_lahir_supplier || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data supplier ini secara permanen?')) return;

        try {
            const res = await fetch(`/api/supplier/${id}`, { method: 'DELETE' });
            if (res.ok) {
                handleToast('Supplier Berhasil Dihapus!');
                fetchSuppliers();
            } else {
                const err = await res.json();
                handleToast(`Gagal menghapus: ${err.error}`, 'error');
            }
        } catch (error) {
            handleToast('Kesalahan jaringan saat mencoba menghapus data', 'error');
        }
    };

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left relative">
            {/* Custom Premium Toast */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <div className={`backdrop-blur-xl border border-white/10 px-8 py-5 rounded-[28px] shadow-2xl flex items-center gap-5 text-white ${toastType === 'success' ? 'bg-gray-900/90' : 'bg-red-900/90'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${toastType === 'success' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                            {toastType === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${toastType === 'success' ? 'text-blue-400' : 'text-red-400'}`}>
                                {toastType === 'success' ? 'Selesai' : 'Perhatian'}
                            </p>
                            <p className="text-sm font-bold text-gray-100">{toastMsg}</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="ml-6 p-2.5 hover:bg-white/5 rounded-2xl transition-all active:scale-90">
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Manajemen Supplier</h1>
                    <p className="text-gray-500 font-medium">Kelola direktori pemasok barang dan katalog distributor toko.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors"/>
                        <input 
                            type="text" 
                            placeholder="Cari Nama Supplier atau Perusahaan..." 
                            className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-full focus:border-blue-500 outline-none w-full md:w-80 font-bold text-sm text-gray-800 transition-all shadow-sm" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => {
                            setEditingId(null);
                            setFormData({
                                nama_supplier: '',
                                nama_perusahaan_supplier: '',
                                nomor_telepon_supplier: '',
                                tanggal_lahir_supplier: ''
                            });
                            setIsModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.1em] shadow-lg shadow-blue-600/20 active:scale-95 transition-all outline-none whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" /> TAMBAH SUPPLIER &rarr;
                    </button>
                </div>
            </div>
            
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest">ID Supplier</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest">Nama & Dealer</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest">Kontak Person (PIC)</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest">Tgl Lahir</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-right">Manajemen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 font-bold text-gray-400 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" /> Sedang memuat data...
                                        </div>
                                    </td>
                                </tr>
                            ) : suppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 font-bold text-gray-400 text-center">
                                        Tidak ada data supplier ditemukan.
                                    </td>
                                </tr>
                            ) : suppliers.map((supplier) => (
                                <tr key={supplier.id_supplier} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <span className="text-sm font-black text-gray-400 font-mono tracking-tighter">SUP-{String(supplier.id_supplier).padStart(3, '0')}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                <Truck className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800 text-sm leading-none mb-1">{supplier.nama_perusahaan_supplier}</p>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Mitra Pemasok</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-gray-800 text-sm">{supplier.nama_supplier}</p>
                                        <p className="text-[11px] font-bold text-blue-600 flex items-center gap-1 mt-1">
                                            <Phone className="w-3 h-3" /> {supplier.nomor_telepon_supplier}
                                        </p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-bold text-gray-500">{supplier.tanggal_lahir_supplier || '-'}</p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(supplier)}
                                                className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all shadow-sm" title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(supplier.id_supplier)}
                                                className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm" title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah/Edit Supplier */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[95vh] text-left">
                        {/* Modal Header */}
                        <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">
                                        {editingId ? 'Edit Data Supplier' : 'Registrasi Supplier Baru'}
                                    </h3>
                                    <p className="text-xs font-black text-gray-400 tracking-widest uppercase mt-1">Daftar Pemasok & Distributor Resmi Toko</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-10">
                            <form onSubmit={handleSubmit} className="space-y-10 focus:outline-none">
                                {/* Supplier Identity */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nama PIC Supplier</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><User className="w-4 h-4" /></span>
                                                <input 
                                                    type="text" required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                                                    placeholder="Contoh: Hendra Gunawan"
                                                    value={formData.nama_supplier}
                                                    onChange={e => setFormData({...formData, nama_supplier: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nama Perusahaan / PT</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><Building2 className="w-4 h-4" /></span>
                                                <input 
                                                    type="text" required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                                                    placeholder="Contoh: PT Bangun Cipta Utama"
                                                    value={formData.nama_perusahaan_supplier}
                                                    onChange={e => setFormData({...formData, nama_perusahaan_supplier: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">No. WhatsApp / Telepon</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><Phone className="w-4 h-4" /></span>
                                                <input 
                                                    type="tel" required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                                                    placeholder="0812-xxxx-xxxx"
                                                    value={formData.nomor_telepon_supplier}
                                                    onChange={e => setFormData({...formData, nomor_telepon_supplier: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tanggal Lahir PIC</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><Calendar className="w-4 h-4" /></span>
                                                <input 
                                                    type="date"
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800 appearance-none"
                                                    value={formData.tanggal_lahir_supplier}
                                                    onChange={e => setFormData({...formData, tanggal_lahir_supplier: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary & Actions */}
                                <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
                                    <div className="flex items-center gap-4 bg-green-50 px-6 py-4 rounded-2xl border border-green-100/50">
                                        <div className="p-2 bg-green-600 text-white rounded-xl shadow-lg shadow-green-600/20"><AlertCircle className="w-4 h-4"/></div>
                                        <p className="text-[11px] font-black text-green-700 uppercase tracking-wider leading-tight">Data akan disimpan secara aman <br/>ke direktori pemasok toko.</p>
                                    </div>
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <button 
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 md:flex-none px-6 py-3.5 text-gray-500 font-bold text-[11px] uppercase tracking-widest bg-gray-100 rounded-full hover:bg-gray-200 transition-all active:scale-[0.98]"
                                        >
                                            Batal
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-[2] md:flex-none px-10 py-3.5 bg-blue-600 text-white font-black text-[11px] uppercase tracking-widest rounded-full shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : editingId ? 'Perbarui Data' : 'Simpan Supplier'} 
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
