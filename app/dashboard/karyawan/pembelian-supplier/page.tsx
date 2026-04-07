'use client';
import React, { useState, useEffect } from 'react';
import { 
    FilePlus2, Search, Filter, Printer, Mail, XCircle, 
    X, Plus, Trash2, Calendar, User, FileText, ShoppingCart, 
    ChevronRight, CheckCircle2, AlertCircle, Package
} from 'lucide-react';

interface POItem {
    id: string;
    productName: string;
    qty: number;
    price: number;
}

export default function TransaksiPembelianSupplierPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState<POItem[]>([{ id: '1', productName: '', qty: 1, price: 0 }]);
    const [supplier, setSupplier] = useState('');
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');

    const addItem = () => {
        setItems([...items, { id: Date.now().toString(), productName: '', qty: 1, price: 0 }]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id: string, field: keyof POItem, value: string | number) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`PO Berhasil Dibuat untuk ${supplier}!\nTotal: Rp ${calculateTotal().toLocaleString()}`);
        setIsModalOpen(false);
        // Reset form
        setItems([{ id: '1', productName: '', qty: 1, price: 0 }]);
        setSupplier('');
    };

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Pesanan Supplier</h1>
                    <p className="text-gray-500 font-medium">Manajemen Purchase Order (PO) dan pengadaan stok barang toko.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.1em] shadow-lg shadow-blue-600/20 active:scale-95 transition-all outline-none whitespace-nowrap"
                >
                    <FilePlus2 className="w-4 h-4" /> Buat PO Baru &rarr;
                </button>
            </div>
            
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-10 border-b border-gray-50">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors"/>
                            <input 
                                type="text" 
                                placeholder="Cari PO, Barang, atau Supplier..." 
                                className="w-full pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-full focus:border-blue-500 outline-none font-bold text-sm text-gray-800 transition-all shadow-sm" 
                            />
                        </div>
                        <button className="px-6 py-3 bg-gray-50 text-gray-400 rounded-full flex items-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100">
                            <Filter className="w-4 h-4" /> Filter Status
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest">No. PO & Tanggal</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-left">Supplier Penerima</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-left">Total Estimasi</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-center">Status Alur</th>
                                <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-right">Manajemen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <tr className="hover:bg-gray-50/50 transition-all group">
                                <td className="px-8 py-6">
                                    <div className="font-black text-blue-600 text-sm mb-1">PO-2026/03/012</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-tight font-mono">28 MAR 2026</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                            <Package className="w-5 h-5"/>
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-800 text-sm leading-none mb-1">PT Bangun Cipta Sentosa</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Distributor Utama</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-left">
                                    <div className="font-black text-gray-900 text-lg tracking-tighter">Rp 12.450.000</div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-amber-100 inline-flex items-center gap-2">
                                        <AlertCircle className="w-3 h-3"/> DRAFT / BELUM DIKIRIM
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm" title="Print PO">
                                            <Printer className="w-4 h-4" />
                                        </button>
                                        <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm" title="Kirim ke Supplier">
                                            <Mail className="w-4 h-4" />
                                        </button>
                                        <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm" title="Batalkan PO">
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 p-8 bg-blue-50/50 border-t border-blue-100/50 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-center">
                            <AlertCircle className="w-6 h-6"/>
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-blue-700 uppercase tracking-widest mb-0.5 leading-none">Butuh Bantuan Pengadaan?</p>
                            <p className="text-xs font-bold text-blue-900/60 leading-none">Cek riwayat pembelian sebelumnya untuk membandingkan harga supplier.</p>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-white text-blue-600 rounded-full font-black text-[10px] uppercase tracking-widest border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        Lihat Riwayat &rarr;
                    </button>
                </div>
            </div>

            {/* Modal Create PO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[95vh] text-left">
                        {/* Modal Header */}
                        <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
                                    <FilePlus2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">Buat Purchase Order</h3>
                                    <p className="text-xs font-black text-gray-400 tracking-widest uppercase mt-1">Estimasi Pengadaan Stok Barang Utama</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-10">
                            <form onSubmit={handleSubmit} className="space-y-10 focus:outline-none">
                                {/* Supplier & Date */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tujuan Supplier</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><User className="w-4 h-4" /></span>
                                            <input 
                                                type="text" required
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                                                placeholder="Pilih atau Ketik Nama Supplier"
                                                value={supplier}
                                                onChange={e => setSupplier(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tanggal Pesanan</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><Calendar className="w-4 h-4" /></span>
                                            <input 
                                                type="date" required
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
                                                value={orderDate}
                                                onChange={e => setOrderDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Items Management */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Daftar Barang Pengadaan</h4>
                                        <div className="h-px bg-gray-100 flex-1 ml-4"></div>
                                    </div>

                                    <div className="space-y-4">
                                        {items.map((item, index) => (
                                            <div key={item.id} className="grid grid-cols-12 gap-6 items-end bg-gray-50/50 p-8 rounded-[32px] border border-gray-100 group transition-all hover:bg-white hover:shadow-md">
                                                <div className="col-span-5 text-left">
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nama Produk / Stock</label>
                                                    <input 
                                                        type="text" required
                                                        className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-gray-800"
                                                        placeholder="Contoh: Semen Gresik 50kg"
                                                        value={item.productName}
                                                        onChange={e => updateItem(item.id, 'productName', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-2 text-left">
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 text-center">Jumlah</label>
                                                    <input 
                                                        type="number" required min="1"
                                                        className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-gray-800 text-center"
                                                        value={item.qty}
                                                        onChange={e => updateItem(item.id, 'qty', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div className="col-span-3 text-left">
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 text-right">Harga Satuan (Rp)</label>
                                                    <input 
                                                        type="number" required min="0" step="1000"
                                                        className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-gray-800 text-right font-mono"
                                                        placeholder="0"
                                                        value={item.price}
                                                        onChange={e => updateItem(item.id, 'price', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div className="col-span-2 flex items-center justify-between pb-2 pl-4">
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Total</span>
                                                        <span className="font-black text-gray-900">Rp {(item.qty * item.price / 1000).toFixed(1)}k</span>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        disabled={items.length === 1}
                                                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-0"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button 
                                            type="button"
                                            onClick={addItem}
                                            className="w-full py-5 border-2 border-dashed border-gray-200 rounded-[30px] text-gray-400 font-black text-[10px] uppercase tracking-widest hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 mt-4"
                                        >
                                            <Plus className="w-5 h-5" /> Tambah Produk Baru
                                        </button>
                                    </div>
                                </div>

                                {/* Summary & Actions */}
                                <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                                    <div className="flex items-center gap-8">
                                        <div className="bg-gray-50 px-10 py-5 rounded-[32px] border border-gray-100">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1 leading-none">Grand Total Estimasi</span>
                                            <span className="text-4xl font-black text-gray-900 tracking-tighter leading-tight">Rp {calculateTotal().toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <button 
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 md:flex-none px-8 py-4 text-gray-500 font-bold text-[11px] uppercase tracking-widest bg-gray-100 rounded-full hover:bg-gray-200 transition-all active:scale-[0.98]"
                                        >
                                            Batal
                                        </button>
                                        <button 
                                            type="submit"
                                            className="flex-[2] md:flex-none px-12 py-4 bg-blue-600 text-white font-black text-[11px] uppercase tracking-widest rounded-full shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                        >
                                            Proses Buat PO <ChevronRight className="w-4 h-4" />
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

