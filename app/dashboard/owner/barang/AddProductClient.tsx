"use client";

import { useState, useRef } from 'react';
import { Plus, X, Package, Tag, Layers, DollarSign, Archive, Save, ArrowRight, Weight, Ruler, Camera, Upload, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/Toast';

export default function AddProductClient({ categories = [], units = [], suppliers = [] }: { categories?: any[], units?: any[], suppliers?: any[] }) {
    const router = useRouter();
    const { showToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        merk_barang: '',
        id_suppliers: [] as number[]
    });

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
        if (!photoFile) return null;
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

    const handleSubmit = async (e: React.FormEvent) => {
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
                showToast('Produk berhasil ditambahkan!', 'success');
                setIsOpen(false);
                setFormData({ nama_kategori: '', nama_barang: '', harga_barang: '', satuan_barang: '', stok_barang: '', deskripsi_barang: '', berat_barang: '', dimensi_barang: '', minimum_barang: '', merk_barang: '', id_suppliers: [] });
                setPhotoFile(null);
                setPhotoPreview(null);
                router.refresh();
            } else {
                const data = await res.json();
                showToast(data.error || "Gagal menyimpan produk", 'error');
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan sistem");
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
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Tambah Produk &rarr;
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" onClick={() => setIsOpen(false)}></div>

                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-white/20 animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100 bg-gray-50/50 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Package className="w-4 h-4 text-orange-600" />
                                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.25em]">Master Data Inventory</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Registrasi Produk Baru</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-12 h-12 bg-white text-gray-400 hover:text-orange-600 hover:border-orange-100 border border-transparent rounded-2xl shadow-sm flex items-center justify-center transition-all active:scale-90 relative z-10">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto custom-scrollbar">
                            <form className="space-y-6" id="addForm" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Foto Upload */}
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Camera className="w-3 h-3" /> Foto Barang</label>
                                        <div
                                            className="relative w-full border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-orange-400 transition-colors"
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

                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Layers className="w-3 h-3" /> Klasifikasi Kategori</label>
                                        <select required value={formData.nama_kategori} onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })} className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer">
                                            <option value="" disabled>Pilih Kategori Produk</option>
                                            {categories.map((c: any) => (
                                                <option key={c.id_kategori_barang} value={c.nama_kategori}>{c.nama_kategori}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Package className="w-3 h-3" /> Nama Lengkap Produk Material</label>
                                        <input type="text" required value={formData.nama_barang} onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })} placeholder="Masukkan nama produk spesifik" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Deskripsi &amp; Spesifikasi Produk</label>
                                        <textarea rows={3} required value={formData.deskripsi_barang} onChange={(e) => setFormData({ ...formData, deskripsi_barang: e.target.value })} placeholder="Penjelasan detail mengenai produk" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner"></textarea>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><DollarSign className="w-3 h-3" /> Harga Jual Satuan (Rp)</label>
                                        <input type="number" required value={formData.harga_barang} onChange={(e) => setFormData({ ...formData, harga_barang: e.target.value })} placeholder="0" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Archive className="w-3 h-3" /> Unit Pengukuran</label>
                                        <select required value={formData.satuan_barang} onChange={(e) => setFormData({ ...formData, satuan_barang: e.target.value })} className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer">
                                            <option value="" disabled>Pilih Satuan</option>
                                            {units.map((u: any) => (
                                                <option key={u.id_satuan_barang} value={u.satuan_barang}>{u.satuan_barang}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Layers className="w-3 h-3" /> Inisialisasi Stok Gudang</label>
                                        <input type="number" required value={formData.stok_barang} onChange={(e) => setFormData({ ...formData, stok_barang: e.target.value })} placeholder="0" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Weight className="w-3 h-3" /> Berat Satuan</label>
                                        <input type="number" step="0.01" required value={formData.berat_barang} onChange={(e) => setFormData({ ...formData, berat_barang: e.target.value })} placeholder="0.00" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Ruler className="w-3 h-3" /> Dimensi (P×L×T)</label>
                                        <input type="text" value={formData.dimensi_barang} onChange={(e) => setFormData({ ...formData, dimensi_barang: e.target.value })} placeholder="Contoh: 100x50x30" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    <div className="space-y-2 col-span-1 md:col-span-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Tag className="w-3 h-3" /> Merk Barang</label>
                                        <input type="text" value={formData.merk_barang} onChange={(e) => setFormData({ ...formData, merk_barang: e.target.value })} placeholder="Contoh: Holcim, Toto" className="block w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner" />
                                    </div>

                                    {/* Multi-Supplier Selection Grid */}
                                    <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
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
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-black text-gray-900 group-hover:text-orange-600 transition-colors">{s.nama_perusahaan_supplier}</span>
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{s.nama_supplier}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-10 py-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-end items-center gap-4 relative">
                            <button onClick={() => setIsOpen(false)} type="button" className="w-full sm:w-auto px-8 py-4 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">
                                Batalkan Entri
                            </button>
                            <button type="submit" form="addForm" disabled={isSubmitting || isUploadingPhoto} className="w-full sm:w-auto px-10 py-4 bg-orange-600 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3">
                                <Save className="w-4 h-4" /> {isSubmitting ? 'Menyimpan...' : 'Simpan Data Produk'} <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
