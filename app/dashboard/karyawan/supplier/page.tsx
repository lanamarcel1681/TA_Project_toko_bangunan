'use client';
import React, { useState } from 'react';
import { 
    Truck, Plus, Search, Edit2, Trash2, Eye, 
    X, User, Phone, Mail, MapPin, Building2, 
    ChevronRight, AlertCircle, CheckCircle2 
} from 'lucide-react';

export default function ManajemenSupplierKaryawanPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        nama: '',
        pic: '',
        phone: '',
        email: '',
        address: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Supplier "${formData.nama}" Berhasil Ditambahkan ke Database!`);
        setIsModalOpen(false);
        setFormData({ nama: '', pic: '', phone: '', email: '', address: '' });
    };

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
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
                            placeholder="Cari ID atau Nama Supplier..." 
                            className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-full focus:border-blue-500 outline-none w-full md:w-80 font-bold text-sm text-gray-800 transition-all shadow-sm" 
                        />
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
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
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest">Status / Region</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-right">Manajemen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <span className="text-sm font-black text-gray-400 font-mono tracking-tighter">SUP-002{i}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                <Truck className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800 text-sm leading-none mb-1">PT Maju Bangunan Sejahtera {i}</p>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Distributor Cat & Semen</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-gray-800 text-sm">Hendra Gunawan</p>
                                        <p className="text-[11px] font-bold text-blue-600 flex items-center gap-1 mt-1">
                                            <Phone className="w-3 h-3" /> +62 812-3456-789{i}
                                        </p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-green-100 inline-flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3"/> AKTIF / JAKARTA
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm" title="Detail">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all shadow-sm" title="Edit">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm" title="Hapus">
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

            {/* Modal Tambah Supplier */}
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
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">Registrasi Supplier Baru</h3>
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
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nama Supplier / PT</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><Truck className="w-4 h-4" /></span>
                                                <input 
                                                    type="text" required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                                                    placeholder="Contoh: PT Bangun Cipta Utama"
                                                    value={formData.nama}
                                                    onChange={e => setFormData({...formData, nama: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Person In Charge (PIC)</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><User className="w-4 h-4" /></span>
                                                <input 
                                                    type="text" required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                                                    placeholder="Nama Lengkap Kontak"
                                                    value={formData.pic}
                                                    onChange={e => setFormData({...formData, pic: e.target.value})}
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
                                                    value={formData.phone}
                                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Email Korespondensi</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><Mail className="w-4 h-4" /></span>
                                                <input 
                                                    type="email"
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                                                    placeholder="supplier@email.com (Opsional)"
                                                    value={formData.email}
                                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Alamat Kantor / Gudang</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-5 text-gray-400"><MapPin className="w-4 h-4" /></span>
                                        <textarea 
                                            required rows={3}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-3xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800 text-sm"
                                            placeholder="Alamat lengkap supplier..."
                                            value={formData.address}
                                            onChange={e => setFormData({...formData, address: e.target.value})}
                                        />
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
                                            className="flex-[2] md:flex-none px-10 py-3.5 bg-blue-600 text-white font-black text-[11px] uppercase tracking-widest rounded-full shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                        >
                                            Simpan Supplier <ChevronRight className="w-4 h-4" />
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
