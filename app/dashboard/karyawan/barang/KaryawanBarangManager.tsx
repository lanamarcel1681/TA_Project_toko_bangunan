"use client";

import React, { useState, useRef } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Eye, X, ChevronRight, Tag, Layers, DollarSign, Archive, Save, AlertTriangle, Weight, Ruler, Camera, Upload, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/Toast';

export default function KaryawanBarangManager({ initialProducts, categories, units, suppliers = [] }: { initialProducts: any[], categories: any[], units: any[], suppliers?: any[] }) {
    const router = useRouter();
    const { showToast } = useToast();
    const [products, setProducts] = useState(initialProducts);

    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [viewingProduct, setViewingProduct] = useState<any>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    // Photo upload states
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    // Form data
    const [formData, setFormData] = useState({
        nama_kategori: '',
        nama_barang: '',
        harga_barang: '',
        satuan_barang: '',
        stok_barang: '',
        deskripsi_barang: '',
        berat_barang: '',
        dimensi_barang: '',
        minimum_barang: '',
        foto_barang: '',
        merk_barang: '',
        id_suppliers: [] as number[]
    });

    const resetForm = () => {
        setFormData({
            nama_kategori: '', nama_barang: '', harga_barang: '', satuan_barang: '', stok_barang: '',
            deskripsi_barang: '', berat_barang: '', dimensi_barang: '', minimum_barang: '',
            foto_barang: '', merk_barang: '',
            id_suppliers: []
        });
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const uploadPhoto = async (): Promise<string | null> => {
        if (!photoFile) return formData.foto_barang || null;
        try {
            setIsUploadingPhoto(true);
            const fd = new FormData();
            fd.append('file', photoFile);
            const res = await fetch('/api/upload/barang', { method: 'POST', body: fd });
            if (res.ok) {
                const data = await res.json();
                return data.url;
            }
            alert('Gagal mengunggah foto');
            return null;
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleDelete = async (id: number) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const res = await fetch(`/api/barang/${itemToDelete}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Produk berhasil dihapus!', 'success');
                setProducts(products.filter(p => p.id_barang !== itemToDelete));
                router.refresh();
            } else {
                const data = await res.json();
                showToast(data.error || "Gagal menghapus produk", 'error');
            }
        } catch (error) {
            console.error(error);
            showToast("Kesalahan sistem saat menghapus", 'error');
        } finally {
            setShowDeleteConfirm(false);
            setItemToDelete(null);
        }
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const fotoUrl = await uploadPhoto();
            const res = await fetch('/api/barang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    berat_barang: formData.berat_barang || "0",
                    dimensi_barang: formData.dimensi_barang || null,
                    minimum_barang: "10",
                    foto_barang: fotoUrl,
                    merk_barang: formData.merk_barang || null
                })
            });

            if (res.ok) {
                const newBarang = await res.json();
                showToast('Produk baru berhasil ditambahkan!', 'success');
                setProducts([newBarang, ...products]);
                setIsAddOpen(false);
                resetForm();
                router.refresh();
            } else {
                const data = await res.json();
                showToast(data.error || "Gagal menambahkan produk", 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (product: any) => {
        setEditingProduct(product);
        setFormData({
            nama_kategori: product.kategori?.nama_kategori || '',
            nama_barang: product.nama_barang || '',
            harga_barang: product.harga_barang?.toString() || '',
            satuan_barang: product.satuan?.satuan_barang || '',
            stok_barang: product.stok_barang?.toString() || '',
            deskripsi_barang: product.deskripsi_barang || '',
            berat_barang: product.berat_barang?.toString() || '',
            dimensi_barang: product.dimensi_barang?.toString() || '',
            minimum_barang: product.minimum_barang?.toString() || '',
            foto_barang: product.foto_barang || '',
            merk_barang: product.merk_barang || '',
            id_suppliers: product.barang_supplier?.map((bs: any) => bs.id_supplier) || []
        });
        // Reset new upload but show existing photo as preview
        setPhotoFile(null);
        setPhotoPreview(product.foto_barang || null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsEditOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const fotoUrl = await uploadPhoto();
            const res = await fetch(`/api/barang/${editingProduct.id_barang}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    minimum_barang: "10",
                    foto_barang: fotoUrl
                })
            });

            if (res.ok) {
                const updated = await res.json();
                showToast('Perubahan produk berhasil disimpan!', 'success');
                setProducts(products.map(p => p.id_barang === updated.id_barang ? updated : p));
                setIsEditOpen(false);
                router.refresh();
            } else {
                const data = await res.json();
                showToast(data.error || "Gagal memperbarui produk", 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <div className="text-left">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Data Barang</h1>
                    <p className="text-gray-500 font-medium font-medium">Kelola inventaris stok, kategori, dan harga produk material.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari data barang..."
                            className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-full focus:border-blue-500 outline-none w-64 font-bold text-sm text-gray-800 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsAddOpen(true); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.1em] shadow-lg shadow-blue-600/20 active:scale-95 transition-all outline-none whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" /> Tambah Barang &rarr;
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto text-left">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest">ID Barang</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest">Nama Barang</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest">Kategori</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-right">Harga</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-center">Stok</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-right">Manajemen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-10 text-center text-gray-400 font-bold">Belum ada produk terdaftar.</td>
                                </tr>
                            ) : products.map((product) => {
                                const isKritis = product.status_barang === "Menipis" || product.status_barang === "Habis";
                                return (
                                    <tr key={product.id_barang} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${isKritis ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                                <span className="text-sm font-black text-gray-400 font-mono tracking-tighter">#{product.id_barang}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all shadow-sm ${isKritis ? 'bg-red-50 text-red-600 border-red-100 group-hover:bg-red-600 group-hover:text-white' : 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white'}`}>
                                                    <Package className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-800 text-sm leading-none mb-1">{product.nama_barang}</p>
                                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">{product.satuan?.satuan_barang}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-gray-100">
                                                {product.kategori?.nama_kategori}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-gray-800 text-sm">
                                            Rp {product.harga_barang?.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${isKritis ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                                {isKritis ? `${product.stok_barang} (${product.status_barang})` : product.stok_barang}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => { setViewingProduct(product); setIsDetailOpen(true); }} className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm" title="Detail">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleEditClick(product)} className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all shadow-sm" title="Edit">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id_barang)} className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm" title="Hapus">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" onClick={() => setIsAddOpen(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] text-left">
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-50 bg-gray-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">Tambah Barang Baru</h3>
                                    <p className="text-xs font-black text-gray-400 tracking-widest uppercase mt-1">Daftarkan Produk Material ke Sistem</p>
                                </div>
                            </div>
                            <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto">
                            <form id="addFormKaryawan" onSubmit={handleAddSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Kategori Produk</label>
                                        <select required value={formData.nama_kategori} onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800 appearance-none cursor-pointer">
                                            <option value="" disabled>Pilih Kategori Barang</option>
                                            {categories.map((c: any) => (
                                                <option key={c.id_kategori_barang} value={c.nama_kategori}>{c.nama_kategori}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nama Barang Lengkap</label>
                                        <input type="text" required value={formData.nama_barang} onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })} placeholder="Masukkan nama produk material" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Deskripsi</label>
                                        <textarea rows={3} required value={formData.deskripsi_barang} onChange={(e) => setFormData({ ...formData, deskripsi_barang: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"></textarea>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Harga Jual (Rp)</label>
                                        <input type="number" required value={formData.harga_barang} onChange={(e) => setFormData({ ...formData, harga_barang: e.target.value })} placeholder="0" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Satuan</label>
                                        <select required value={formData.satuan_barang} onChange={(e) => setFormData({ ...formData, satuan_barang: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800 appearance-none cursor-pointer">
                                            <option value="" disabled>Pilih Satuan</option>
                                            {units.map((u: any) => (
                                                <option key={u.id_satuan_barang} value={u.satuan_barang}>{u.satuan_barang}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Stok Inventaris</label>
                                        <input type="number" required value={formData.stok_barang} onChange={(e) => setFormData({ ...formData, stok_barang: e.target.value })} placeholder="0" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                    </div>

                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Berat Satuan</label>
                                        <input type="number" step="0.01" required value={formData.berat_barang} onChange={(e) => setFormData({ ...formData, berat_barang: e.target.value })} placeholder="0" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Dimensi (P×L×T)</label>
                                        <input type="text" value={formData.dimensi_barang} onChange={(e) => setFormData({ ...formData, dimensi_barang: e.target.value })} placeholder="Contoh: 100x50x30" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Merk Barang</label>
                                        <input type="text" value={formData.merk_barang} onChange={(e) => setFormData({ ...formData, merk_barang: e.target.value })} placeholder="Contoh: Holcim, Toto, dll" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Foto Barang</label>
                                        <div
                                            className="relative w-full border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {photoPreview ? (
                                                <div className="relative">
                                                    <img src={photoPreview} alt="preview" className="w-full h-40 object-cover" />
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2"><Camera className="w-4 h-4" /> Ganti Foto</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-8 gap-3 text-gray-400">
                                                    <Upload className="w-8 h-8" />
                                                    <span className="text-xs font-black uppercase tracking-widest">Klik untuk upload foto</span>
                                                    <span className="text-[10px] text-gray-300">JPG, PNG, WebP — maks 5MB</span>
                                                </div>
                                            )}
                                        </div>
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                                    </div>
                                    {/* Multi-Supplier Selection Grid */}
                                    <div className="col-span-2 space-y-4 pt-4 border-t border-gray-100 text-left">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Building2 className="w-3 h-3" /> Rekanan Supplier (Multi-Select)
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {suppliers.map((s: any) => (
                                                <label 
                                                    key={s.id_supplier}
                                                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                                                        formData.id_suppliers.includes(s.id_supplier)
                                                        ? 'bg-blue-50 border-blue-500 shadow-sm' 
                                                        : 'bg-gray-50 border-transparent hover:border-gray-200 shadow-inner'
                                                    }`}
                                                >
                                                    <div className="relative flex items-center justify-center">
                                                        <input 
                                                            type="checkbox"
                                                            className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-lg checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                                            checked={formData.id_suppliers.includes(s.id_supplier)}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    id_suppliers: checked 
                                                                        ? [...prev.id_suppliers, s.id_supplier]
                                                                        : prev.id_suppliers.filter(id => id !== s.id_supplier)
                                                                }));
                                                            }}
                                                        />
                                                        <Plus className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-[11px] font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{s.nama_perusahaan_supplier}</span>
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{s.nama_supplier}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-10 py-8 border-t border-gray-50 bg-gray-50/30 flex justify-end gap-4">
                            <button onClick={() => setIsAddOpen(false)} type="button" className="px-8 py-3.5 text-gray-500 font-bold text-[11px] uppercase tracking-widest bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
                                Batal
                            </button>
                            <button type="submit" form="addFormKaryawan" disabled={isSubmitting} className="px-10 py-3.5 bg-blue-600 text-white font-black text-[11px] uppercase tracking-widest rounded-full shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                                Simpan Barang <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" onClick={() => setIsEditOpen(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] text-left">
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-50 bg-gray-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-500/20">
                                    <Edit2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">Edit Data Barang</h3>
                                    <p className="text-xs font-black text-gray-400 tracking-widest uppercase mt-1">Perbarui Spesifikasi Produk Material</p>
                                </div>
                            </div>
                            <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto">
                            <form id="editFormKaryawan" onSubmit={handleEditSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Kategori Produk</label>
                                        <select required value={formData.nama_kategori} onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800 appearance-none cursor-pointer">
                                            <option value="" disabled>Pilih Kategori Barang</option>
                                            {categories.map((c: any) => (
                                                <option key={c.id_kategori_barang} value={c.nama_kategori}>{c.nama_kategori}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nama Barang Lengkap</label>
                                        <input type="text" required value={formData.nama_barang} onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })} placeholder="Masukkan nama produk material" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Deskripsi</label>
                                        <textarea rows={3} required value={formData.deskripsi_barang} onChange={(e) => setFormData({ ...formData, deskripsi_barang: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"></textarea>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Harga Jual (Rp)</label>
                                        <input type="number" required value={formData.harga_barang} onChange={(e) => setFormData({ ...formData, harga_barang: e.target.value })} placeholder="0" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Satuan</label>
                                        <select required value={formData.satuan_barang} onChange={(e) => setFormData({ ...formData, satuan_barang: e.target.value })} className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800 appearance-none cursor-pointer">
                                            <option value="" disabled>Pilih Satuan</option>
                                            {units.map((u: any) => (
                                                <option key={u.id_satuan_barang} value={u.satuan_barang}>{u.satuan_barang}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Stok Inventaris</label>
                                        <input type="number" required value={formData.stok_barang} onChange={(e) => setFormData({ ...formData, stok_barang: e.target.value })} placeholder="0" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                    </div>

                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Berat Satuan</label>
                                        <input type="number" step="0.01" required value={formData.berat_barang} onChange={(e) => setFormData({ ...formData, berat_barang: e.target.value })} placeholder="0" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Dimensi (P×L×T)</label>
                                        <input type="text" value={formData.dimensi_barang} onChange={(e) => setFormData({ ...formData, dimensi_barang: e.target.value })} placeholder="Contoh: 100x50x30" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Merk Barang</label>
                                        <input type="text" value={formData.merk_barang} onChange={(e) => setFormData({ ...formData, merk_barang: e.target.value })} placeholder="Contoh: Holcim, Toto, dll" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Foto Barang</label>
                                        <div
                                            className="relative w-full border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-orange-400 transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {photoPreview ? (
                                                <div className="relative">
                                                    <img src={photoPreview} alt="preview" className="w-full h-40 object-cover" />
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2"><Camera className="w-4 h-4" /> Ganti Foto</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-8 gap-3 text-gray-400">
                                                    <Upload className="w-8 h-8" />
                                                    <span className="text-xs font-black uppercase tracking-widest">Klik untuk upload foto</span>
                                                    <span className="text-[10px] text-gray-300">JPG, PNG, WebP — maks 5MB</span>
                                                </div>
                                            )}
                                        </div>
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                                    </div>
                                    {/* Multi-Supplier Selection Grid */}
                                    <div className="col-span-2 space-y-4 pt-4 border-t border-gray-100 text-left">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <Building2 className="w-3 h-3" /> Rekanan Supplier (Multi-Select)
                                            </label>
                                            {formData.id_suppliers.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {suppliers.filter((s: any) => formData.id_suppliers.includes(s.id_supplier)).map((s: any) => (
                                                        <span key={s.id_supplier} className="px-2 py-0.5 bg-orange-600 text-white text-[8px] font-black rounded-full uppercase tracking-tighter">
                                                            {s.nama_perusahaan_supplier}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {suppliers.map((s: any) => (
                                                <label 
                                                    key={s.id_supplier}
                                                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                                                        formData.id_suppliers.includes(s.id_supplier)
                                                        ? 'bg-orange-50 border-orange-500 shadow-sm' 
                                                        : 'bg-gray-50 border-transparent hover:border-gray-200 shadow-inner'
                                                    }`}
                                                >
                                                    <div className="relative flex items-center justify-center">
                                                        <input 
                                                            type="checkbox"
                                                            className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-lg checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer"
                                                            checked={formData.id_suppliers.includes(s.id_supplier)}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    id_suppliers: checked 
                                                                        ? [...prev.id_suppliers, s.id_supplier]
                                                                        : prev.id_suppliers.filter(id => id !== s.id_supplier)
                                                                }));
                                                            }}
                                                        />
                                                        <Plus className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-[11px] font-black text-gray-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{s.nama_perusahaan_supplier}</span>
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{s.nama_supplier}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-10 py-8 border-t border-gray-50 bg-gray-50/30 flex justify-end gap-4">
                            <button onClick={() => setIsEditOpen(false)} type="button" className="px-8 py-3.5 text-gray-500 font-bold text-[11px] uppercase tracking-widest bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
                                Batal
                            </button>
                            <button type="submit" form="editFormKaryawan" disabled={isSubmitting} className="px-10 py-3.5 bg-orange-500 text-white font-black text-[11px] uppercase tracking-widest rounded-full shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                                <Save className="w-4 h-4" /> Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal Detail */}
            {isDetailOpen && viewingProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" onClick={() => setIsDetailOpen(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] text-left border border-white/20 animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-50 bg-gray-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">Detail Produk</h3>
                                    <p className="text-xs font-black text-gray-400 tracking-widest uppercase mt-1">Spesifikasi Lengkap Material</p>
                                </div>
                            </div>
                            <button onClick={() => setIsDetailOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="col-span-1 md:col-span-2">
                                    <div className="w-full h-72 rounded-[32px] overflow-hidden border border-gray-100 shadow-inner bg-gray-50 flex items-center justify-center relative group">
                                        {viewingProduct.foto_barang ? (
                                            <img src={viewingProduct.foto_barang} alt={viewingProduct.nama_barang} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-300 gap-3">
                                                <Package className="w-20 h-20 opacity-10" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Foto Produk Tidak Tersedia</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-gray-100 shadow-sm">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">ID #{viewingProduct.id_barang}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Tag className="w-3 h-3" /> Nama Produk</p>
                                        <p className="text-xl font-black text-gray-900 tracking-tight leading-tight">{viewingProduct.nama_barang}</p>
                                    </div>
                                    <div className="flex gap-10">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Kategori</p>
                                            <span className="inline-flex px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-blue-100">
                                                {viewingProduct.kategori?.nama_kategori}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Merk</p>
                                            <p className="text-sm font-black text-gray-800 tracking-tight">{viewingProduct.merk_barang || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><DollarSign className="w-3 h-3" /> Harga Jual</p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-2xl font-black text-blue-600 tracking-tighter">Rp {viewingProduct.harga_barang?.toLocaleString('id-ID')}</p>
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">/ {viewingProduct.satuan?.satuan_barang}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Stok Fisik</p>
                                            <p className={`text-lg font-black tracking-tighter ${viewingProduct.status_barang === 'Habis' ? 'text-red-600' : viewingProduct.status_barang === 'Menipis' ? 'text-orange-600' : 'text-gray-900'}`}>
                                                {viewingProduct.stok_barang}
                                            </p>
                                            <p className="text-[9px] font-black uppercase tracking-tight text-gray-400">{viewingProduct.status_barang}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Berat Unit</p>
                                            <p className="text-lg font-black text-gray-900 tracking-tighter">{viewingProduct.berat_barang} <span className="text-xs">kg</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 space-y-4">
                                    <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-50">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Ruler className="w-3 h-3" /> Dimensi Fisik (P×L×T)</p>
                                            <p className="text-sm font-bold text-gray-700">{viewingProduct.dimensi_barang || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Minimum Stok</p>
                                            <p className="text-sm font-bold text-gray-700">{viewingProduct.minimum_barang || '10'} pcs</p>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Building2 className="w-3 h-3" /> Daftar Rekanan Supplier
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {viewingProduct.barang_supplier && viewingProduct.barang_supplier.length > 0 ? (
                                                viewingProduct.barang_supplier.map((bs: any) => (
                                                    <span key={bs.id_supplier} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                                        {bs.supplier.nama_perusahaan_supplier}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs font-bold text-gray-400 italic">Asal supplier tidak diketahui (Opsional)</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="pt-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Deskripsi Produk & Spesifikasi Teknik</p>
                                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner">
                                            <p className="text-sm font-medium text-gray-600 leading-relaxed whitespace-pre-wrap italic">
                                                {viewingProduct.deskripsi_barang || 'Informasi deskripsi belum ditambahkan untuk produk ini.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                            <button onClick={() => setIsDetailOpen(false)} className="px-10 py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full shadow-lg shadow-gray-900/20 hover:bg-black hover:shadow-black/30 transition-all active:scale-95 flex items-center justify-center gap-2 group">
                                Tutup Panel Detail <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 text-center">
                    <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 rotate-12 group hover:rotate-0 transition-transform">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Hapus Produk?</h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            Data produk akan dihapus secara permanen dari sistem gudang.
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
