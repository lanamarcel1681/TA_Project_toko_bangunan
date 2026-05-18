"use client";

import React, { useState } from 'react';
import { Tags, Plus, Search, Edit2, Trash2, X, ChevronRight, Save, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/Toast';

export default function KaryawanKategoriManager({ initialCategories }: { initialCategories: any[] }) {
    const router = useRouter();
    const { showToast } = useToast();
    const [categories, setCategories] = useState(initialCategories);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    // Form state
    const [namaKategori, setNamaKategori] = useState('');

    const filteredCategories = categories.filter(c => 
        c.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setNamaKategori('');
    };

    const handleDelete = async (id: number) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const res = await fetch(`/api/kategori/${itemToDelete}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Kategori berhasil dihapus!', 'success');
                setCategories(categories.filter(c => c.id_kategori_barang !== itemToDelete));
                router.refresh();
            } else {
                const data = await res.json();
                showToast(data.error || "Gagal menghapus kategori. Pastikan tidak ada barang di kategori ini.", 'error');
            }
        } catch (error) {
            console.error(error);
            showToast("Terjadi kesalahan sistem", 'error');
        } finally {
            setShowDeleteConfirm(false);
            setItemToDelete(null);
        }
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const res = await fetch('/api/kategori', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nama_kategori: namaKategori })
            });

            if (res.ok) {
                const newKategori = await res.json();
                showToast('Kategori baru berhasil ditambahkan!', 'success');
                setCategories([newKategori, ...categories]);
                setIsAddOpen(false);
                resetForm();
                router.refresh();
            } else {
                const data = await res.json();
                showToast(data.error || "Gagal menambah kategori", 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (kategori: any) => {
        setEditingCategory(kategori);
        setNamaKategori(kategori.nama_kategori || '');
        setIsEditOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const res = await fetch(`/api/kategori/${editingCategory.id_kategori_barang}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nama_kategori: namaKategori })
            });

            if (res.ok) {
                const updated = await res.json();
                showToast('Kategori berhasil diperbarui!', 'success');
                setCategories(categories.map(c => c.id_kategori_barang === updated.id_kategori_barang ? updated : c));
                setIsEditOpen(false);
                router.refresh();
            } else {
                const data = await res.json();
                showToast(data.error || "Gagal memperbarui kategori", 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Manajemen Kategori</h1>
                    <p className="text-gray-500 font-medium whitespace-nowrap">Kelola kategori untuk mempermudah organisasi dan pencarian inventaris barang.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors"/>
                        <input 
                            type="text" 
                            placeholder="Cari kategori..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-full focus:border-orange-500 outline-none w-full md:w-64 font-bold text-sm text-gray-800 transition-all shadow-sm" 
                        />
                    </div>
                    <button 
                        onClick={() => { resetForm(); setIsAddOpen(true); }}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.1em] shadow-lg shadow-orange-600/20 active:scale-95 transition-all outline-none whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" /> Kategori Baru &rarr;
                    </button>
                </div>
            </div>
            
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest w-24">ID</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-left">Nama Kategori</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-center">Status / Total Item</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-right">Manajemen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-10 text-center text-gray-400 font-bold">Kategori tidak ditemukan.</td>
                                </tr>
                            ) : filteredCategories.map((cat) => (
                                <tr key={cat.id_kategori_barang} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-black text-gray-400 font-mono tracking-tighter">#{cat.id_kategori_barang}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                                                <Tags className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800 text-sm leading-none mb-1">{cat.nama_kategori}</p>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Kategori Dasar</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-green-100 inline-flex items-center gap-2">
                                            Aktif / {cat._count?.barang || 0} Barang
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEditClick(cat)} className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all shadow-sm" title="Edit">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(cat.id_kategori_barang)} className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm" title="Hapus">
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

            {/* Modal Tambah Kategori */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" onClick={() => setIsAddOpen(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] text-left">
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-50 bg-gray-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-orange-600 text-white rounded-2xl shadow-lg shadow-orange-600/20">
                                    <Tags className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">Buat Kategori Baru</h3>
                                    <p className="text-xs font-black text-gray-400 tracking-widest uppercase mt-1">Organisir Inventaris dengan Kategori</p>
                                </div>
                            </div>
                            <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-10 overflow-y-auto">
                            <form id="addFormCat" onSubmit={handleAddSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nama Kategori</label>
                                    <input type="text" required value={namaKategori} onChange={(e) => setNamaKategori(e.target.value)} placeholder="Contoh: Perkakas Listrik" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                </div>
                            </form>
                        </div>
                        
                        <div className="px-10 py-8 border-t border-gray-50 bg-gray-50/30 flex justify-end gap-4">
                            <button onClick={() => setIsAddOpen(false)} type="button" className="px-8 py-3.5 text-gray-500 font-bold text-[11px] uppercase tracking-widest bg-gray-100 rounded-full hover:bg-gray-200 transition-all active:scale-[0.98]">
                                Batal
                            </button>
                            <button 
                                type="submit" form="addFormCat" disabled={isSubmitting}
                                className="px-10 py-3.5 bg-orange-600 text-white font-black text-[11px] uppercase tracking-widest rounded-full shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                Simpan Kategori <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit Kategori */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" onClick={() => setIsEditOpen(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] text-left">
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-50 bg-gray-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-500/20">
                                    <Edit2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">Edit Kategori</h3>
                                    <p className="text-xs font-black text-gray-400 tracking-widest uppercase mt-1">Perbarui Nama Kategori</p>
                                </div>
                            </div>
                            <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-10 overflow-y-auto">
                            <form id="editFormCat" onSubmit={handleEditSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nama Kategori</label>
                                    <input type="text" required value={namaKategori} onChange={(e) => setNamaKategori(e.target.value)} placeholder="Contoh: Perkakas Listrik" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                </div>
                            </form>
                        </div>
                        
                        <div className="px-10 py-8 border-t border-gray-50 bg-gray-50/30 flex justify-end gap-4">
                            <button onClick={() => setIsEditOpen(false)} type="button" className="px-8 py-3.5 text-gray-500 font-bold text-[11px] uppercase tracking-widest bg-gray-100 rounded-full hover:bg-gray-200 transition-all active:scale-[0.98]">
                                Batal
                            </button>
                            <button 
                                type="submit" form="editFormCat" disabled={isSubmitting}
                                className="px-10 py-3.5 bg-orange-500 text-white font-black text-[11px] uppercase tracking-widest rounded-full shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" /> Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 text-center">
                    <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 rotate-12 group hover:rotate-0 transition-transform">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Hapus Kategori?</h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            Menghapus kategori akan berdampak pada pengelompokan barang. Pastikan kategori ini sudah kosong.
                        </p>
                        
                        <div className="flex flex-col w-full gap-3">
                            <button 
                                onClick={confirmDelete}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95"
                            >
                                Ya, Hapus Permanen
                            </button>
                            <button 
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setItemToDelete(null);
                                }}
                                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
