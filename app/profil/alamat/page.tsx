'use client';
import React, { useState, useEffect } from 'react';
import { Mail, MapPin, ShoppingBag, Plus, Star, Edit, Trash2, ChevronRight, ArrowLeft, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';

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
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
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
                
                setShowSuccessAlert(true);
                setTimeout(() => setShowSuccessAlert(false), 3000);
            }
        } catch (e) {
            console.error(e);
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
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteAddress = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) return;
        
        try {
            const res = await fetch('/api/user/alamat', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                await loadAddresses();
            }
        } catch (e) {
            console.error(e);
        }
    };
    return (
        <div className="bg-gray-50 min-h-screen py-8">
            {/* Custom Alert Sukses */}
            {showSuccessAlert && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-green-50 border border-green-200 shadow-xl rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-sm font-bold text-green-800">Alamat baru berhasil ditambahkan!</p>
                    <button onClick={() => setShowSuccessAlert(false)} className="text-green-500 hover:text-green-700 ml-2">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

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
                                    Kotak Masuk
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
                                        Pembelian
                                    </div>
                                    <ChevronRight className="w-4 h-4 transition-transform" />
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
                            {isLoading ? (
                                <p className="text-gray-500 text-sm py-6 text-center">Memuat alamat...</p>
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
                                    <p className="text-gray-500 font-mono text-sm mb-2">{addr.name} | {addr.phone}</p>
                                    <p className="text-gray-600 mb-2 leading-relaxed text-sm whitespace-pre-wrap">
                                        {addr.fullAddress}
                                    </p>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 mb-6 w-full">
                                        <p className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wider">Deskripsi/Patokan</p>
                                        <p className="text-gray-700 text-sm">{addr.deskripsi_alamat || '-'}</p>
                                    </div>
                                    <div className="flex gap-4 border-t border-gray-100 pt-4 items-center">
                                        <button onClick={() => handleEdit(addr)} className={`text-orange-600 font-semibold hover:underline flex items-center gap-1 text-sm ${!addr.isMain ? 'border-r border-gray-200 pr-4' : ''}`}>
                                            <Edit className="w-4 h-4" /> Ubah{addr.isMain ? ' Alamat' : ''}
                                        </button>
                                        {!addr.isMain && (
                                            <>
                                                <button onClick={() => setAsMain(addr.id)} className="text-gray-500 hover:text-orange-600 font-medium hover:underline border-r border-gray-200 pr-4 text-sm">
                                                    Jadikan Utama
                                                </button>
                                                <button onClick={() => deleteAddress(addr.id)} className="text-red-500 hover:text-red-600 font-medium hover:underline flex items-center gap-1 text-sm">
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
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200 mt-20 md:mt-10 mb-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Ubah Alamat' : 'Tambah Alamat Baru'}</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-gray-50 hover:bg-red-50 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tandai Sebagai</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Rumah', 'Kantor', 'Toko', 'Gudang'].map(label => (
                                        <button
                                            key={label}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, label_alamat: label })}
                                            className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${formData.label_alamat === label ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-white border-gray-200 text-gray-500 hover:border-orange-300'}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Jalan</label>
                                <textarea name="nama_jalan" value={formData.nama_jalan} onChange={handleInputChange} rows={2} placeholder="Masukkan nama jalan yang spesifik..." className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi & Patokan Alamat</label>
                                <textarea name="deskripsi_alamat" value={formData.deskripsi_alamat} onChange={handleInputChange} rows={2} placeholder="Catatan tambahan seperti warna rumah, patokan, atau unit gedung..." className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border"></textarea>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Kabupaten/Kota</label>
                                    <input name="kabupaten" value={formData.kabupaten} onChange={handleInputChange} type="text" placeholder="Contoh: Sleman" className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Kecamatan</label>
                                    <input name="kecamatan" value={formData.kecamatan} onChange={handleInputChange} type="text" placeholder="Contoh: Depok" className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Kelurahan</label>
                                    <input name="kelurahan" value={formData.kelurahan} onChange={handleInputChange} type="text" placeholder="Contoh: Caturtunggal" className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Kode Pos</label>
                                    <input name="kode_pos" value={formData.kode_pos} onChange={handleInputChange} type="text" placeholder="Contoh: 55281" className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border" />
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer w-max group mt-2">
                                    <input name="status_default" checked={formData.status_default} onChange={handleInputChange} type="checkbox" className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Jadikan sebagai alamat utama</span>
                                </label>
                            </div>
                        </div>
                        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                            <button id="btn-batal" type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">Batal</button>
                            <button id="btn-simpan-alamat" type="button" onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-lg shadow-orange-500/30 transition-all">{editingId ? 'Simpan Perubahan' : 'Simpan Alamat'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
