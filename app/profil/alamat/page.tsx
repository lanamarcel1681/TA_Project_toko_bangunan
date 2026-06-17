'use client';
import React, { useState, useEffect } from 'react';
import { Mail, MapPin, ShoppingBag, Plus, Star, Edit, Trash2, ChevronRight, ArrowLeft, X, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../../components/Toast';
import { dataWilayah } from './dataWilayah';

interface Address {
    id: number;
    label: string;
    name: string;
    phone: string;
    fullAddress: string;
    deskripsi_alamat: string;
    label_alamat: string;
    isMain: boolean;
    nama_jalan: string;
    kabupaten: string;
    kecamatan: string;
    kelurahan: string;
    kode_pos: string;
}

export default function AlamatPembeliPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
    const { showToast } = useToast();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);

    const sortedAddresses = [...addresses].sort((a, b) => {
        if (a.isMain && !b.isMain) return -1;
        if (!a.isMain && b.isMain) return 1;
        return 0;
    });

    const loadAddresses = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/user/alamat');
            if (res.ok) {
                const json = await res.json();
                setAddresses(json.data || []);
            }
        } catch (e) {
            console.error('Failed to load addresses', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, []);

    const [formData, setFormData] = useState({
        nama_jalan: '',
        kabupaten: '',
        kecamatan: '',
        kelurahan: '',
        kode_pos: '',
        deskripsi_alamat: '',
        label_alamat: 'Rumah',
        status_default: false
    });

    const availableKecamatans = dataWilayah.find(k => k.name === formData.kabupaten)?.kecamatan || [];
    const availableKelurahans = availableKecamatans.find(k => k.name === formData.kecamatan)?.kelurahan || [];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else if (name === 'kabupaten') {
            setFormData(prev => ({ ...prev, kabupaten: value, kecamatan: '', kelurahan: '', kode_pos: '' }));
        } else if (name === 'kecamatan') {
            setFormData(prev => ({ ...prev, kecamatan: value, kelurahan: '', kode_pos: '' }));
        } else if (name === 'kelurahan') {
            const selectedKelObj = availableKelurahans.find((k: any) => k.name === value);
            const kodepos = selectedKelObj ? (selectedKelObj.kodepos?.toString() || '') : '';
            setFormData(prev => ({ ...prev, kelurahan: value, kode_pos: kodepos }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        if (!formData.nama_jalan?.trim() || !formData.kabupaten || !formData.kecamatan || !formData.kelurahan || !String(formData.kode_pos).trim() || !formData.deskripsi_alamat?.trim()) {
            showToast('Semua field alamat harus diisi!', 'error');
            return;
        }

        try {
            const isFirst = addresses.length === 0;
            const updatedData = { ...formData, status_default: isFirst ? true : formData.status_default };

            let res;
            if (editingId) {
                res = await fetch('/api/user/alamat', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...updatedData, id: editingId, action: 'update' })
                });
            } else {
                res = await fetch('/api/user/alamat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData)
                });
            }

            if (res.ok) {
                await loadAddresses();
                setIsAddModalOpen(false);
                setEditingId(null);
                setFormData({ nama_jalan: '', kabupaten: '', kecamatan: '', kelurahan: '', kode_pos: '', deskripsi_alamat: '', label_alamat: 'Rumah', status_default: false });

                showToast(editingId ? 'Alamat berhasil diperbarui!' : 'Alamat baru berhasil ditambahkan!', 'success');
            } else {
                const errorData = await res.json().catch(() => ({}));
                showToast(errorData.error || 'Gagal menyimpan alamat', 'error');
            }
        } catch (e) {
            console.error(e);
            showToast('Terjadi kesalahan sistem', 'error');
        }
    };

    const handleEdit = (addr: Address) => {
        setEditingId(addr.id);
        setFormData({
            nama_jalan: addr.nama_jalan || '',
            kabupaten: addr.kabupaten || '',
            kecamatan: addr.kecamatan || '',
            kelurahan: addr.kelurahan || '',
            kode_pos: addr.kode_pos || '',
            deskripsi_alamat: addr.deskripsi_alamat || '',
            label_alamat: addr.label_alamat || 'Rumah',
            status_default: addr.isMain
        });
        setIsAddModalOpen(true);
    };

    const setAsMain = async (id: number) => {
        try {
            const res = await fetch('/api/user/alamat', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'setMain' })
            });
            if (res.ok) {
                await loadAddresses();
                showToast('Alamat utama berhasil diubah', 'success');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteAddress = async (id: number) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/user/alamat', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                await loadAddresses();
                showToast('Alamat berhasil dihapus', 'success');
            } else {
                showToast('Gagal menghapus alamat', 'error');
            }
        } catch (e) {
            console.error(e);
            showToast('Kesalahan jaringan', 'error');
        } finally {
            setIsLoading(false);
            setShowDeleteModal(false);
            setAddressToDelete(null);
        }
    };
    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Beranda
                    </Link>
                </div>
                <div className="flex flex-col md:flex-row gap-6">

                    {/* Left Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                            <Link href="/profil" className="p-6 flex items-center gap-4 cursor-pointer transition-colors hover:bg-gray-50">
                                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold">
                                    P
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-sm font-bold text-gray-800">Pengguna</h2>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">Ubah Profil</p>
                                </div>
                            </Link>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <nav className="flex flex-col py-2">
                                <Link href="/profil" className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors text-left text-gray-600 hover:bg-gray-50 hover:text-orange-600 border-l-4 border-transparent">
                                    <Mail className="w-5 h-5" />
                                    Profil Saya
                                </Link>
                                <Link
                                    href="/profil/alamat"
                                    className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors text-left text-orange-600 border-l-4 border-orange-600 bg-orange-50/30"
                                >
                                    <MapPin className="w-5 h-5" />
                                    Daftar Alamat
                                </Link>
                                <Link href="/history-transaksi" className="flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors text-left text-gray-600 hover:bg-gray-50 hover:text-orange-600 border-l-4 border-transparent">
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag className="w-5 h-5" />
                                        History Transaksi
                                    </div>
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px] overflow-hidden p-8">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Buku Alamat</h2>
                            <button id="btn-tambah-alamat" onClick={() => {
                                setEditingId(null);
                                setFormData({ nama_jalan: '', kabupaten: '', kecamatan: '', kelurahan: '', kode_pos: '', deskripsi_alamat: '', label_alamat: 'Rumah', status_default: false });
                                setIsAddModalOpen(true);
                            }} className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-orange-500/30 transition-all text-sm">
                                <Plus className="w-5 h-5" /> Tambah Alamat
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {isLoading && addresses.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-500 text-sm font-medium">Memuat alamat...</p>
                                </div>
                            ) : addresses.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-6">Belum ada alamat yang ditambahkan.</p>
                            ) : null}
                            {sortedAddresses.map((addr) => (
                                <div key={addr.id} className={`bg-white rounded-xl p-6 shadow-sm relative overflow-hidden transition-colors ${addr.isMain ? 'border-2 border-orange-500' : 'border border-gray-200 hover:border-orange-300'}`}>
                                    {addr.isMain && (
                                        <div className="absolute top-0 right-0 px-4 py-1.5 bg-orange-500 text-white rounded-bl-xl text-xs font-bold flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-current" /> Utama
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className={`font-bold text-lg text-gray-800 flex items-center gap-2 ${addr.isMain ? 'mt-2' : ''}`}>{addr.label_alamat}</h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 ${addr.isMain ? 'mt-2' : ''}`}>Alamat Pengiriman</span>
                                    </div>
                                    <p className="text-gray-500 font-mono text-sm mb-2 font-bold">{addr.name} | {addr.phone}</p>
                                    <p className="text-gray-600 mb-2 leading-relaxed text-sm whitespace-pre-wrap">
                                        {addr.fullAddress}
                                    </p>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 mb-6 w-full">
                                        <p className="text-gray-500 text-[10px] font-black mb-1 uppercase tracking-widest opacity-60">Deskripsi/Patokan</p>
                                        <p className="text-gray-700 text-sm font-medium">{addr.deskripsi_alamat || '-'}</p>
                                    </div>
                                    <div className="flex gap-4 border-t border-gray-100 pt-4 items-center">
                                        <button onClick={() => handleEdit(addr)} className={`text-orange-600 font-bold hover:underline flex items-center gap-1 text-xs uppercase tracking-wider ${!addr.isMain ? 'border-r border-gray-200 pr-4' : ''}`}>
                                            <Edit className="w-4 h-4" /> Ubah{addr.isMain ? ' Alamat' : ''}
                                        </button>
                                        {!addr.isMain && (
                                            <>
                                                <button onClick={() => setAsMain(addr.id)} className="text-gray-500 hover:text-orange-600 font-bold hover:underline border-r border-gray-200 pr-4 text-xs uppercase tracking-wider">
                                                    Jadikan Utama
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setAddressToDelete(addr.id);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="text-red-500 hover:text-red-600 font-bold hover:underline flex items-center gap-1 text-xs uppercase tracking-wider"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Hapus
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Tambah Alamat */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm pt-8 overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 mt-20 md:mt-10 mb-auto">
                        <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gray-50/30">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">{editingId ? 'Ubah Alamat' : 'Tambah Alamat Baru'}</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-white hover:bg-red-50 rounded-full shadow-sm">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-white">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Tandai Sebagai</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Rumah', 'Kantor', 'Toko', 'Gudang'].map(label => (
                                        <button
                                            key={label}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, label_alamat: label })}
                                            className={`px-6 py-2.5 rounded-xl border text-xs font-bold transition-all uppercase tracking-wider ${formData.label_alamat === label ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-white border-gray-100 text-gray-400 hover:border-orange-200 hover:text-orange-600'}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nama Jalan</label>
                                <textarea name="nama_jalan" value={formData.nama_jalan} onChange={handleInputChange} rows={2} placeholder="Masukkan nama jalan yang spesifik..." className="w-full bg-gray-50 border-gray-100 text-gray-900 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-sm p-4 border transition-all outline-none font-medium"></textarea>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Deskripsi & Patokan Alamat</label>
                                <textarea name="deskripsi_alamat" value={formData.deskripsi_alamat} onChange={handleInputChange} rows={2} placeholder="Catatan tambahan seperti warna rumah, patokan, atau unit gedung..." className="w-full bg-gray-50 border-gray-100 text-gray-900 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-sm p-4 border transition-all outline-none font-medium"></textarea>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Kabupaten/Kota</label>
                                    <select name="kabupaten" value={formData.kabupaten} onChange={handleInputChange} className="w-full bg-gray-50 border-gray-100 text-gray-900 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-sm p-4 border transition-all outline-none font-medium appearance-none">
                                        <option value="">Pilih Kabupaten/Kota</option>
                                        {dataWilayah.map(kab => (
                                            <option key={kab.name} value={kab.name}>{kab.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Kecamatan</label>
                                    <select name="kecamatan" value={formData.kecamatan} onChange={handleInputChange} disabled={!formData.kabupaten} className="w-full bg-gray-50 border-gray-100 text-gray-900 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-sm p-4 border transition-all outline-none font-medium appearance-none disabled:opacity-50">
                                        <option value="">Pilih Kecamatan</option>
                                        {availableKecamatans.map(kec => (
                                            <option key={kec.name} value={kec.name}>{kec.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Kelurahan</label>
                                    <select name="kelurahan" value={formData.kelurahan} onChange={handleInputChange} disabled={!formData.kecamatan} className="w-full bg-gray-50 border-gray-100 text-gray-900 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-sm p-4 border transition-all outline-none font-medium appearance-none disabled:opacity-50">
                                        <option value="">Pilih Kelurahan</option>
                                        {availableKelurahans.map((kel: any) => (
                                            <option key={kel.name} value={kel.name}>{kel.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Kode Pos</label>
                                    <input name="kode_pos" value={formData.kode_pos} onChange={handleInputChange} type="text" placeholder="Contoh: 55281" className="w-full bg-gray-50 border-gray-100 text-gray-900 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-sm p-4 border transition-all outline-none font-medium" />
                                </div>
                            </div>
                            <div className="pt-2">
                                <label className="flex items-center gap-3 cursor-pointer group bg-gray-50 p-4 rounded-xl border border-gray-100 hover:bg-orange-50 transition-all">
                                    <input name="status_default" checked={formData.status_default} onChange={handleInputChange} type="checkbox" className="w-5 h-5 text-orange-600 border-gray-300 rounded-lg focus:ring-orange-500 transition-all" />
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-orange-600 transition-colors uppercase tracking-wider">Jadikan Alamat Utama</span>
                                </label>
                            </div>
                        </div>
                        <div className="p-8 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50/50">
                            <button id="btn-batal" type="button" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto px-8 py-3 rounded-xl border border-gray-200 text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-white hover:text-gray-600 transition-all">Batal</button>
                            <button id="btn-simpan-alamat" type="button" onClick={handleSave} className="w-full sm:w-auto px-10 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all active:scale-95">{editingId ? 'Simpan Perubahan' : 'Simpan Alamat'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 rotate-12 group hover:rotate-0 transition-transform">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Hapus Alamat?</h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            Alamat ini akan dihapus permanen. Anda yakin ingin melanjutkannya?
                        </p>

                        <div className="flex flex-col w-full gap-3">
                            <button
                                onClick={() => addressToDelete && deleteAddress(addressToDelete)}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95"
                            >
                                Ya, Hapus Sekarang
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setAddressToDelete(null);
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
