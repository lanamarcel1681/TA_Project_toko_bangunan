'use client';
import React, { useState } from 'react';
import { Mail, MapPin, ShoppingBag, Plus, Star, Edit, Trash2, ChevronRight, ArrowLeft, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Address {
    id: number;
    label: string;
    name: string;
    phone: string;
    fullAddress: string;
    isMain: boolean;
}

export default function AlamatPembeliPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    
    const [addresses, setAddresses] = useState<Address[]>([
        { 
            id: 1, 
            label: 'Rumah', 
            name: 'John Doe', 
            phone: '081234567890', 
            fullAddress: 'Jl. Mawar Merah No.15, RT.01/RW.02, Kel. Melati, Kec. Kebayoran, Jakarta Selatan, 12345.', 
            isMain: true 
        },
        { 
            id: 2, 
            label: 'Kantor', 
            name: 'John Doe', 
            phone: '081234567890', 
            fullAddress: 'Gedung Menara Mulia Lt. 10. Jl. Jendral Sudirman Kav. 12, Jakarta Pusat, 10220. (Patokan: Depan pos Satpam)', 
            isMain: false 
        }
    ]);

    const [formData, setFormData] = useState({
        label: '',
        name: '',
        phone: '',
        city: '',
        address: '',
        isMain: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        const fullAddressText = formData.city ? `${formData.address}, ${formData.city}` : formData.address;
        
        const newAddress: Address = {
            id: Date.now(),
            label: formData.label || 'Alamat Baru',
            name: formData.name || 'Pengguna',
            phone: formData.phone || '-',
            fullAddress: fullAddressText || '-',
            isMain: formData.isMain
        };

        if (newAddress.isMain) {
            const updatedAddresses = addresses.map(addr => ({ ...addr, isMain: false }));
            setAddresses([newAddress, ...updatedAddresses]);
        } else {
            setAddresses([...addresses, newAddress]);
        }

        setIsAddModalOpen(false);
        setFormData({ label: '', name: '', phone: '', city: '', address: '', isMain: false });
        
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
    };

    const setAsMain = (id: number) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isMain: addr.id === id
        })));
    };

    const deleteAddress = (id: number) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
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
                            <button onClick={() => setIsAddModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-orange-500/30 transition-all text-sm">
                                <Plus className="w-5 h-5" /> Tambah Alamat
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {addresses.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-6">Belum ada alamat yang ditambahkan.</p>
                            )}
                            {addresses.map((addr) => (
                                <div key={addr.id} className={`bg-white rounded-xl p-6 shadow-sm relative overflow-hidden transition-colors ${addr.isMain ? 'border-2 border-orange-500' : 'border border-gray-200 hover:border-orange-300'}`}>
                                    {addr.isMain && (
                                        <div className="absolute top-0 right-0 px-4 py-1.5 bg-orange-500 text-white rounded-bl-xl text-xs font-bold flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-current" /> Utama
                                        </div>
                                    )}
                                    <h3 className={`font-bold text-lg text-gray-800 flex items-center gap-2 mb-1 ${addr.isMain ? 'mt-2' : ''}`}>{addr.label} <span className="text-gray-400 font-normal text-sm">| {addr.name}</span></h3>
                                    <p className="text-gray-500 font-mono text-sm mb-2">{addr.phone}</p>
                                    <p className="text-gray-600 mb-6 leading-relaxed text-sm whitespace-pre-wrap">
                                        {addr.fullAddress}
                                    </p>
                                    <div className="flex gap-4 border-t border-gray-100 pt-4 items-center">
                                        <button className={`text-orange-600 font-semibold hover:underline flex items-center gap-1 text-sm ${!addr.isMain ? 'border-r border-gray-200 pr-4' : ''}`}>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Tambah Alamat Baru</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-gray-50 hover:bg-red-50 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Label Alamat</label>
                                <input name="label" value={formData.label} onChange={handleInputChange} type="text" placeholder="Contoh: Rumah, Kantor, Apartemen" className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Penerima</label>
                                    <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Nama lengkap" className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon</label>
                                    <input name="phone" value={formData.phone} onChange={handleInputChange} type="text" placeholder="Contoh: 0812..." className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Kota & Kecamatan</label>
                                <input name="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="Contoh: Sleman, Depok" className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} placeholder="Nama jalan, gedung, no. rumah/unit" className="w-full border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm p-2.5 border"></textarea>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer w-max group">
                                    <input name="isMain" checked={formData.isMain} onChange={handleInputChange} type="checkbox" className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Jadikan sebagai alamat utama</span>
                                </label>
                            </div>
                        </div>
                        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">Batal</button>
                            <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-lg shadow-orange-500/30 transition-all">Simpan Alamat</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
