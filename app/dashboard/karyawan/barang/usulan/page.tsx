'use client';
import React, { useState, useEffect } from 'react';
import { 
    Package, Plus, Search, Edit2, Trash2, Eye, 
    X, User, Phone, MapPin, Building2, 
    ChevronRight, AlertCircle, CheckCircle2, Calendar,
    Loader2, Tag, FileText, DollarSign, Clock
} from 'lucide-react';

interface Kategori {
    id_kategori_barang: number;
    nama_kategori: string;
}

interface UsulanBarang {
    id_usulan_barang: number;
    nama_barang_usulan: string;
    deskripsi_usulan: string;
    tanggal_usulan: string;
    status_usulan: string;
    harga_beli_perkiraan: number;
    harga_jual_perkiraan: number;
    id_kategori_barang: number;
    kategori: Kategori;
}

export default function ManajemenUsulanBarangPage() {
    const [suggestions, setSuggestions] = useState<UsulanBarang[]>([]);
    const [categories, setCategories] = useState<Kategori[]>([]);
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
        nama_barang_usulan: '',
        id_kategori_barang: '',
        deskripsi_usulan: '',
        harga_beli_perkiraan: '',
        harga_jual_perkiraan: ''
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch Categories
            const catRes = await fetch('/api/kategori');
            const catData = await catRes.json();
            setCategories(catData);

            // Fetch Suggestions
            const res = await fetch(`/api/usulan-barang${searchQuery ? `?search=${searchQuery}` : ''}`);
            const data = await res.json();
            setSuggestions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            handleToast('Gagal memuat data', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = editingId ? `/api/usulan-barang/${editingId}` : '/api/usulan-barang';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                handleToast(editingId ? 'Usulan Berhasil Diperbarui!' : 'Usulan Baru Berhasil Dikirim ke Owner!');
                setIsModalOpen(false);
                setFormData({
                    nama_barang_usulan: '',
                    id_kategori_barang: '',
                    deskripsi_usulan: '',
                    harga_beli_perkiraan: '',
                    harga_jual_perkiraan: ''
                });
                setEditingId(null);
                fetchData();
            } else {
                const err = await res.json();
                handleToast(`Error: ${err.error}`, 'error');
            }
        } catch (error) {
            handleToast('Terjadi kesalahan server', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (item: UsulanBarang) => {
        if (item.status_usulan !== 'Pending') {
            handleToast('Usulan yang sudah diproses tidak dapat diubah', 'error');
            return;
        }
        setEditingId(item.id_usulan_barang);
        setFormData({
            nama_barang_usulan: item.nama_barang_usulan,
            id_kategori_barang: item.id_kategori_barang.toString(),
            deskripsi_usulan: item.deskripsi_usulan,
            harga_beli_perkiraan: item.harga_beli_perkiraan.toString(),
            harga_jual_perkiraan: item.harga_jual_perkiraan.toString()
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus usulan ini?')) return;

        try {
            const res = await fetch(`/api/usulan-barang/${id}`, { method: 'DELETE' });
            if (res.ok) {
                handleToast('Usulan Berhasil Dihapus!');
                fetchData();
            } else {
                const err = await res.json();
                handleToast(`Error: ${err.error}`, 'error');
            }
        } catch (error) {
            handleToast('Kesalahan jaringan', 'error');
        }
    };

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left relative">
            {/* Custom Toast */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <div className={`backdrop-blur-xl border border-white/10 px-8 py-5 rounded-[28px] shadow-2xl flex items-center gap-5 text-white ${toastType === 'success' ? 'bg-gray-900/90' : 'bg-red-900/90'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${toastType === 'success' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                            {toastType === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">
                                {toastType === 'success' ? 'Selesai' : 'Perhatian'}
                            </p>
                            <p className="text-sm font-bold">{toastMsg}</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="ml-6 p-2 hov:bg-white/5 rounded-2xl transition-all">
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Usulan Barang Baru</h1>
                    <p className="text-gray-500 font-medium">Sarankan produk baru yang potensial untuk stok gudang.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors"/>
                        <input 
                            type="text" 
                            placeholder="Cari Nama Barang..." 
                            className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-full focus:border-blue-500 outline-none w-full md:w-80 font-bold text-sm text-gray-800 transition-all shadow-sm" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => {
                            setEditingId(null);
                            setFormData({
                                nama_barang_usulan: '',
                                id_kategori_barang: '',
                                deskripsi_usulan: '',
                                harga_beli_perkiraan: '',
                                harga_jual_perkiraan: ''
                            });
                            setIsModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.1em] shadow-lg shadow-blue-600/20 active:scale-95 transition-all outline-none whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" /> BUAT USULAN &rarr;
                    </button>
                </div>
            </div>
            
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest">Barang & Kategori</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest">Tgl Usulan</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest">Est. Harga Beli</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-right">Manajemen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 font-bold text-gray-400 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" /> Sedang memuat...
                                        </div>
                                    </td>
                                </tr>
                            ) : suggestions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 font-bold text-gray-400 text-center">
                                        Belum ada usulan barang.
                                    </td>
                                </tr>
                            ) : suggestions.map((item) => (
                                <tr key={item.id_usulan_barang} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800 text-sm leading-none mb-1">{item.nama_barang_usulan}</p>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{item.kategori.nama_kategori}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(item.tanggal_usulan).toLocaleDateString('id-ID')}
                                        </p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-gray-800 text-sm">Rp {item.harga_beli_perkiraan.toLocaleString()}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border inline-flex items-center gap-2 ${
                                            item.status_usulan === 'Pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                            item.status_usulan === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                            'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                            <Clock className="w-3 h-3"/> {item.status_usulan}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(item)}
                                                disabled={item.status_usulan !== 'Pending'}
                                                className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all shadow-sm disabled:opacity-30" title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id_usulan_barang)}
                                                disabled={item.status_usulan !== 'Pending'}
                                                className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm disabled:opacity-30" title="Hapus"
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

            {/* Modal Tambah/Edit Usulan */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-left">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[95vh]">
                        {/* Modal Header */}
                        <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-orange-600 text-white rounded-2xl shadow-lg shadow-orange-600/20">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">
                                        {editingId ? 'Edit Usulan Barang' : 'Buat Usulan Barang Baru'}
                                    </h3>
                                    <p className="text-xs font-black text-gray-400 tracking-widest uppercase mt-1">Saran pengadaan produk baru aplikasi</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-10">
                            <form onSubmit={handleSubmit} className="space-y-10 focus:outline-none">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nama Barang Usulan*</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><Package className="w-4 h-4" /></span>
                                                <input 
                                                    type="text" required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                                                    placeholder="Contoh: Semen Gresik Premium"
                                                    value={formData.nama_barang_usulan}
                                                    onChange={e => setFormData({...formData, nama_barang_usulan: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Kategori Barang*</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><Tag className="w-4 h-4" /></span>
                                                <select 
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-gray-800 appearance-none"
                                                    value={formData.id_kategori_barang}
                                                    onChange={e => setFormData({...formData, id_kategori_barang: e.target.value})}
                                                >
                                                    <option value="">Pilih Kategori</option>
                                                    {categories.map(c => (
                                                        <option key={c.id_kategori_barang} value={c.id_kategori_barang}>{c.nama_kategori}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Est. Harga Beli*</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><DollarSign className="w-4 h-4" /></span>
                                                <input 
                                                    type="number" required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                                                    placeholder="Perkiraan Harga Beli Satuan"
                                                    value={formData.harga_beli_perkiraan}
                                                    onChange={e => setFormData({...formData, harga_beli_perkiraan: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Est. Harga Jual</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><DollarSign className="w-4 h-4" /></span>
                                                <input 
                                                    type="number"
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                                                    placeholder="Usulan Harga Jual"
                                                    value={formData.harga_jual_perkiraan}
                                                    onChange={e => setFormData({...formData, harga_jual_perkiraan: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Alasan / Deskripsi Usulan</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-5 text-gray-400"><FileText className="w-4 h-4" /></span>
                                        <textarea 
                                            rows={3}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-3xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-gray-800 text-sm"
                                            placeholder="Jelaskan mengapa barang ini perlu ditambahkan..."
                                            value={formData.deskripsi_usulan}
                                            onChange={e => setFormData({...formData, deskripsi_usulan: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
                                    <div className="flex items-center gap-4 bg-orange-50 px-6 py-4 rounded-2xl border border-orange-100/50">
                                        <div className="p-2 bg-orange-600 text-white rounded-xl"><AlertCircle className="w-4 h-4"/></div>
                                        <p className="text-[11px] font-black text-orange-700 uppercase tracking-wider leading-tight">Memberikan usulan membantu toko <br/>berkembang lebih cepat.</p>
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
                                            ) : editingId ? 'Perbarui Usulan' : 'Submit Usulan'} 
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
