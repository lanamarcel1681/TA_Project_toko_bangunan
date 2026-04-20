"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Package, ShieldCheck, AlertTriangle, Eye, Edit3, Trash2, LayoutGrid, Save, X, Plus, Tag, Layers, DollarSign, Archive, Weight, Ruler, Camera, Upload, Building2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OwnerBarangTable({ initialProducts, categories = [], units = [], suppliers = [] }: { initialProducts: any[], categories?: any[], units?: any[], suppliers?: any[] }) {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [viewingProduct, setViewingProduct] = useState<any>(null);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Photo upload
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            if (res.ok) { const data = await res.json(); return data.url; }
            alert('Gagal mengunggah foto'); return null;
        } finally { setIsUploadingPhoto(false); }
    };

    // Form states for Edit
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

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin ingin menghapus produk ini?")) return;

        try {
            setIsDeleting(true);
            const res = await fetch(`/api/barang/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setProducts(products.filter(p => p.id_barang !== id));
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Gagal menghapus produk");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat menghapus");
        } finally {
            setIsDeleting(false);
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
        // Reset new file upload, show existing photo as preview
        setPhotoFile(null);
        setPhotoPreview(product.foto_barang || null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsEditOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
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
                setProducts(products.map(p => p.id_barang === updated.id_barang ? updated : p));
                setIsEditOpen(false);
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Gagal memperbarui produk");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan sistem");
        }
    };

    return (
        <>
            <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative group/table">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/20 -mr-32 -mt-32 rounded-full blur-3xl opacity-0 group-hover/table:opacity-100 transition-opacity duration-1000"></div>

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">ID Barang</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] min-w-[200px]">Detail Produk</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Kategori</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Harga Satuan</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Sisa Stok</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] text-right">Integrasi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-10 text-center text-gray-400 font-bold">Belum ada produk terdaftar.</td>
                                </tr>
                            ) : products.map((product, i) => {
                                const isMenipis = product.status_barang === "Menipis";
                                const isHabis = product.status_barang === "Habis";
                                const isAman = !isMenipis && !isHabis;

                                return (
                                    <tr key={product.id_barang} className="hover:bg-orange-50/30 transition-all duration-300 group/row">
                                        <td className="px-8 py-8 font-black text-gray-400 text-xs tracking-wider group-hover/row:text-orange-600 transition-colors">
                                            #{product.id_barang}
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0 group-hover/row:scale-110 transition-transform">
                                                    <Package className="w-6 h-6 text-gray-300 group-hover/row:text-orange-500 transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-base tracking-tight leading-none group-hover/row:text-orange-600 transition-colors mb-1">{product.nama_barang}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.satuan?.satuan_barang}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-500 border border-gray-100 group-hover/row:bg-orange-100 group-hover/row:text-orange-600 group-hover/row:border-orange-200 transition-all">
                                                <LayoutGrid className="w-3 h-3" /> {product.kategori?.nama_kategori || '-'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8">
                                            <p className="font-black text-gray-900 text-base tracking-tight leading-none">Rp {product.harga_barang?.toLocaleString('id-ID')}</p>
                                        </td>
                                        <td className="px-8 py-8">
                                            <p className={`font-black text-base tracking-tight leading-none ${isMenipis || isHabis ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>{product.stok_barang}</p>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${isAman ? 'bg-green-50 text-green-700 border-green-100' :
                                                isMenipis ? 'bg-yellow-50 text-yellow-700 border-yellow-100 outline outline-4 outline-yellow-100/30' :
                                                    'bg-red-50 text-red-700 border-red-100'
                                                }`}>
                                                {isAman ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                                {product.status_barang || "Tersedia"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <div className="flex items-center justify-end gap-2 translate-x-4 opacity-0 group-hover/row:translate-x-0 group-hover/row:opacity-100 transition-all duration-300">
                                                <button onClick={() => { setViewingProduct(product); setIsDetailOpen(true); }} className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:border-orange-200 active:scale-90 transition-all" title="Lihat Deskripsi">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleEditClick(product)} className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 active:scale-90 transition-all" title="Edit">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id_barang)} disabled={isDeleting} className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-200 active:scale-90 transition-all disabled:opacity-50" title="Hapus">
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

            {/* Edit Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" onClick={() => setIsEditOpen(false)}></div>

                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-white/20 animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100 bg-gray-50/50 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Edit3 className="w-4 h-4 text-blue-600" />
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em]">Master Data Inventory</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Edit Produk</h3>
                            </div>
                            <button onClick={() => setIsEditOpen(false)} className="w-12 h-12 bg-white text-gray-400 hover:text-blue-600 hover:border-blue-100 border border-transparent rounded-2xl shadow-sm flex items-center justify-center transition-all active:scale-90 relative z-10">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto custom-scrollbar">
                            <form className="space-y-6" onSubmit={handleEditSubmit} id="editForm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Layers className="w-3 h-3" /> Klasifikasi Kategori</label>
                                        <select required value={formData.nama_kategori} onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })} className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer">
                                            <option value="" disabled>Pilih Kategori Produk</option>
                                            {categories.map((c: any) => (
                                                <option key={c.id_kategori_barang} value={c.nama_kategori}>{c.nama_kategori}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Package className="w-3 h-3" /> Nama Lengkap Produk Material</label>
                                        <input type="text" required value={formData.nama_barang} onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })} className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    {/* DB Extra Fields */}
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Deskripsi & Spesifikasi Produk</label>
                                        <textarea rows={3} required value={formData.deskripsi_barang} onChange={(e) => setFormData({ ...formData, deskripsi_barang: e.target.value })} className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner"></textarea>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><DollarSign className="w-3 h-3" /> Harga Jual Satuan (Rp)</label>
                                        <input type="number" required value={formData.harga_barang} onChange={(e) => setFormData({ ...formData, harga_barang: e.target.value })} className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Archive className="w-3 h-3" /> Unit Pengukuran</label>
                                        <select required value={formData.satuan_barang} onChange={(e) => setFormData({ ...formData, satuan_barang: e.target.value })} className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer">
                                            <option value="" disabled>Pilih Satuan</option>
                                            {units.map((u: any) => (
                                                <option key={u.id_satuan_barang} value={u.satuan_barang}>{u.satuan_barang}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Layers className="w-3 h-3" /> Stok Gudang Saat Ini</label>
                                        <input type="number" required value={formData.stok_barang} onChange={(e) => setFormData({ ...formData, stok_barang: e.target.value })} className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Weight className="w-3 h-3" /> Berat Satuan</label>
                                        <input type="number" step="0.01" required value={formData.berat_barang} onChange={(e) => setFormData({ ...formData, berat_barang: e.target.value })} className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Ruler className="w-3 h-3" /> Dimensi (P×L×T)</label>
                                        <input type="text" value={formData.dimensi_barang} onChange={(e) => setFormData({ ...formData, dimensi_barang: e.target.value })} placeholder="Contoh: 100x50x30" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Tag className="w-3 h-3" /> Merk Barang</label>
                                        <input type="text" value={formData.merk_barang} onChange={(e) => setFormData({ ...formData, merk_barang: e.target.value })} placeholder="Contoh: Holcim, Toto" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    {/* Multi-Supplier Selection Grid */}
                                    <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t border-gray-100 text-left">
                                        <div className="flex justify-between items-center">
                                            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                                <Building2 className="w-3 h-3" /> Rekanan Supplier (Multi-Select)
                                            </label>
                                            {formData.id_suppliers.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {suppliers.filter((s: any) => formData.id_suppliers.includes(s.id_supplier)).map((s: any) => (
                                                        <span key={s.id_supplier} className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded-full uppercase tracking-tighter">
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
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Camera className="w-3 h-3" /> Foto Barang</label>
                                        <div
                                            className="relative w-full border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {photoPreview ? (
                                                <div className="relative">
                                                    <img src={photoPreview} alt="preview" className="w-full h-48 object-cover" />
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2"><Camera className="w-4 h-4" /> Ganti Foto</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400">
                                                    <Upload className="w-10 h-10" />
                                                    <span className="text-xs font-black uppercase tracking-widest">Klik untuk upload foto produk</span>
                                                    <span className="text-[10px] text-gray-300">JPG, PNG, WebP — maks 5MB</span>
                                                </div>
                                            )}
                                        </div>
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-end items-center gap-4 relative">
                            <button onClick={() => setIsEditOpen(false)} type="button" className="w-full sm:w-auto px-8 py-4 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">
                                Batalkan
                            </button>
                            <button type="submit" form="editForm" disabled={isUploadingPhoto} className="w-full sm:w-auto px-10 py-4 bg-blue-600 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3">
                                <Save className="w-4 h-4" /> {isUploadingPhoto ? 'Mengunggah...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Detail Modal */}
            {isDetailOpen && viewingProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" onClick={() => setIsDetailOpen(false)}></div>

                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-white/20 animate-in fade-in zoom-in duration-300 text-left">
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100 bg-gray-50/50 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye className="w-4 h-4 text-orange-600" />
                                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.25em]">Informasi Produk Bangunan</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Detail Spesifikasi</h3>
                            </div>
                            <button onClick={() => setIsDetailOpen(false)} className="w-12 h-12 bg-white text-gray-400 hover:text-orange-600 hover:border-orange-100 border border-transparent rounded-2xl shadow-sm flex items-center justify-center transition-all active:scale-90 relative z-10">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="col-span-1 md:col-span-2">
                                    <div className="w-full h-80 rounded-[32px] overflow-hidden border border-gray-100 shadow-inner bg-gray-50 flex items-center justify-center relative group">
                                        {viewingProduct.foto_barang ? (
                                            <img src={viewingProduct.foto_barang} alt={viewingProduct.nama_barang} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-300 gap-3">
                                                <Package className="w-24 h-24 opacity-10" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Foto Belum Diunggah</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-gray-100 shadow-sm">
                                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none">ID #{viewingProduct.id_barang}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Tag className="w-3 h-3" /> Nama Material</p>
                                        <p className="text-xl font-black text-gray-900 tracking-tight leading-tight">{viewingProduct.nama_barang}</p>
                                    </div>
                                    <div className="flex gap-10">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Kategori</p>
                                            <span className="inline-flex px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-orange-100">
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
                                            <p className="text-2xl font-black text-orange-600 tracking-tighter">Rp {viewingProduct.harga_barang?.toLocaleString('id-ID')}</p>
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">/ {viewingProduct.satuan?.satuan_barang}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Stok Gudang</p>
                                            <p className={`text-lg font-black tracking-tighter ${viewingProduct.status_barang === 'Habis' ? 'text-red-600' : viewingProduct.status_barang === 'Menipis' ? 'text-yellow-600' : 'text-green-600'}`}>
                                                {viewingProduct.stok_barang}
                                            </p>
                                            <p className="text-[9px] font-black uppercase tracking-tight text-gray-400 leading-none mt-1">{viewingProduct.status_barang}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Berat Satuan</p>
                                            <p className="text-lg font-black text-gray-900 tracking-tighter">{viewingProduct.berat_barang} <span className="text-xs">kg</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t border-gray-50">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Ruler className="w-3 h-3" /> Dimensi Fisik (P×L×T)</p>
                                            <p className="text-sm font-bold text-gray-700">{viewingProduct.dimensi_barang || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Threshold Stok</p>
                                            <p className="text-sm font-bold text-gray-700">{viewingProduct.minimum_barang || '10'} unit</p>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Building2 className="w-3 h-3" /> Daftar Perusahaan Supplier
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {viewingProduct.barang_supplier && viewingProduct.barang_supplier.length > 0 ? (
                                                viewingProduct.barang_supplier.map((bs: any) => (
                                                    <span key={bs.id_supplier} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                                        {bs.supplier.nama_perusahaan_supplier}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs font-bold text-gray-400 italic">Asal supplier tidak diketahui (Anonim)</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Deskripsi Produk Lengkap</p>
                                        <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 shadow-inner">
                                            <p className="text-sm font-medium text-gray-600 leading-relaxed whitespace-pre-wrap italic">
                                                {viewingProduct.deskripsi_barang || 'Tidak ada informasi tambahan untuk produk bangunan ini.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                            <button onClick={() => setIsDetailOpen(false)} className="px-12 py-4 bg-orange-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/40 transition-all active:scale-95 flex items-center justify-center gap-2 group">
                                Tutup Panel <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
