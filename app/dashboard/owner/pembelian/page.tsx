'use client';
import React, { useState } from 'react';
import {
    FilePlus2, Search, Filter, Printer, Mail, XCircle,
    X, Plus, Trash2, Calendar, User, FileText, ShoppingCart,
    ChevronRight, CheckCircle2, AlertCircle, Package, Truck, ArrowRight, Save, DollarSign, Layers
} from 'lucide-react';

interface POItem {
    id: string;
    productName: string;
    qty: number;
    price: number;
}

export default function PembelianSupplierOwnerPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState<POItem[]>([{ id: '1', productName: '', qty: 1, price: 0 }]);
    const [supplier, setSupplier] = useState('');
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);

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
        alert(`PO Berhasil Dibuat (Owner Approval)!\nTotal: Rp ${calculateTotal().toLocaleString()}`);
        setIsModalOpen(false);
        setItems([{ id: '1', productName: '', qty: 1, price: 0 }]);
        setSupplier('');
    };

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            {/* Page Heading & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Procurement System</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Pesanan Supplier</h1>
                    <p className="text-gray-500 font-medium mt-3">Manajemen Purchase Order (PO) dan pengadaan stok barang toko dengan otorisasi penuh.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/40 transition-all active:scale-95 group"
                >
                    <FilePlus2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Buat PO Baru &rarr;
                </button>
            </div>

            {/* Content Container */}
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden group/table">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/20 -mr-32 -mt-32 rounded-full blur-3xl opacity-0 group-hover/table:opacity-100 transition-opacity duration-1000"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-10 gap-6 relative z-10">
                    <div>
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[.25em] mb-1">Daftar Pengajuan PO</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                            <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">Monitoring status & pengiriman aktif</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-10 relative z-10">
                    <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari PO, Barang, atau Supplier..."
                            className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-full focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all font-medium text-gray-900 shadow-lg shadow-gray-200/40"
                        />
                    </div>
                    <button className="px-8 py-5 bg-white text-gray-400 rounded-full flex items-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all border border-gray-100 shadow-md">
                        <Filter className="w-4 h-4" /> Filter Status
                    </button>
                </div>

                {/* List Transaksi Supplier */}
                <div className="w-full bg-gray-50/30 rounded-[32px] overflow-hidden border border-gray-100 relative z-10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">No. PO & Tanggal</th>
                                    <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] min-w-[250px]">Supplier Penerima</th>
                                    <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Total Estimasi</th>
                                    <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Status Alur</th>
                                    <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] text-right">Integrasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <tr className="hover:bg-orange-50/30 transition-all duration-300 group/row">
                                    <td className="px-10 py-8">
                                        <div className="font-black text-orange-600 text-base mb-1 group-hover/row:scale-105 origin-left transition-transform">PO-2026/03/012</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">28 MAR 2026</div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0 border border-gray-200 group-hover/row:border-orange-200 transition-colors">
                                                <Truck className="w-6 h-6 text-gray-400 group-hover/row:text-orange-500 transition-colors" />
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-800 text-base flex items-center gap-2 group-hover/row:text-orange-600 transition-colors">
                                                    PT Bangun Cipta Sentosa
                                                </div>
                                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">Distributor Utama Semen</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="font-black text-gray-900 text-lg tracking-tight">Rp 12.450.000</div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border border-amber-100 inline-flex items-center gap-2">
                                            <AlertCircle className="w-3 h-3" /> DRAFT / BELUM DIKIRIM
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-2 translate-x-4 opacity-0 group-hover/row:translate-x-0 group-hover/row:opacity-100 transition-all duration-300">
                                            <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl hover:bg-orange-50 hover:text-orange-600 text-gray-400 transition-all shadow-sm flex items-center justify-center animate-in fade-in" title="Print PO">
                                                <Printer className="w-4 h-4" />
                                            </button>
                                            <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl hover:bg-orange-50 hover:text-orange-600 text-gray-400 transition-all shadow-sm flex items-center justify-center animate-in fade-in" title="Kirim ke Supplier">
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl hover:bg-red-50 hover:text-red-600 text-gray-400 transition-all shadow-sm flex items-center justify-center animate-in fade-in" title="Batalkan PO">
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-10 p-10 bg-orange-50/50 rounded-[40px] border border-orange-100/50 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-[24px] shadow-sm text-orange-600 flex items-center justify-center shrink-0 border border-orange-100"><AlertCircle className="w-8 h-8" /></div>
                        <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-[11px] mb-2 leading-none">Butuh Bantuan Pengadaan?</h4>
                            <p className="text-sm text-gray-500 font-medium">Cek riwayat pembelian sebelumnya untuk membandikan harga supplier dan stabilitas stok.</p>
                        </div>
                    </div>
                    <button className="px-8 py-4 bg-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] text-orange-600 border border-orange-100 hover:bg-orange-600 hover:text-white transition-all shadow-md active:scale-95 shrink-0">Lihat Riwayat Analisis &rarr;</button>
                </div>
            </div>

            {/* Modal Create PO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-5xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[95vh] border border-white/20 animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="px-12 py-10 border-b border-gray-100 bg-gray-50/50 relative">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 rounded-full blur-3xl -mr-24 -mt-24 opacity-50"></div>
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <FilePlus2 className="w-4 h-4 text-orange-600" />
                                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.25em]">PO Creation Wizard</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">Buat Purchase Order</h3>
                                    <p className="text-sm font-medium text-gray-500">Estimasi pengadaan stok barang dengan approval owner langsung.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 bg-white text-gray-400 hover:text-orange-600 hover:border-orange-100 border border-transparent rounded-[20px] shadow-sm flex items-center justify-center transition-all active:scale-90">
                                    <X className="w-7 h-7" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto p-12 custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-12">
                                {/* Supplier & Date */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <User className="w-3 h-3" /> Tujuan Supplier Utama
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text" required
                                                className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[24px] text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 focus:bg-white transition-all shadow-inner"
                                                placeholder="Pilih atau Ketik Nama Supplier"
                                                value={supplier}
                                                onChange={e => setSupplier(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <Calendar className="w-3 h-3" /> Tanggal Perencanaan
                                        </label>
                                        <input
                                            type="date" required
                                            className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[24px] text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 focus:bg-white transition-all shadow-inner cursor-pointer"
                                            value={orderDate}
                                            onChange={e => setOrderDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Items Management */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Detail Daftar Item</h4>
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                    </div>

                                    <div className="space-y-6">
                                        {items.map((item, index) => (
                                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end bg-gray-50 px-8 py-8 rounded-[32px] border border-gray-100 group transition-all hover:bg-white hover:shadow-xl hover:border-orange-100 relative">
                                                <div className="md:col-span-1 flex items-center justify-center">
                                                    <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-[10px] font-black flex items-center justify-center">#{index + 1}</span>
                                                </div>
                                                <div className="md:col-span-5 space-y-2">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2 relative z-10"><Package className="w-3 h-3" /> SKU / Nama Produk</label>
                                                    <input
                                                        type="text" required
                                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                                                        placeholder="Contoh: Semen Gresik 50kg"
                                                        value={item.productName}
                                                        onChange={e => updateItem(item.id, 'productName', e.target.value)}
                                                    />
                                                </div>
                                                <div className="md:col-span-2 space-y-2 text-center">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2 relative z-10"><Layers className="w-3 h-3" /> Qty</label>
                                                    <input
                                                        type="number" required min="1"
                                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-center"
                                                        value={item.qty}
                                                        onChange={e => updateItem(item.id, 'qty', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div className="md:col-span-3 space-y-2">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2 relative z-10"><DollarSign className="w-3 h-3" /> Harga Satuan</label>
                                                    <input
                                                        type="number" required min="0" step="1000"
                                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-right"
                                                        placeholder="0"
                                                        value={item.price}
                                                        onChange={e => updateItem(item.id, 'price', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div className="md:col-span-1 flex justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        disabled={items.length === 1}
                                                        className="w-12 h-12 bg-white text-gray-300 hover:text-red-500 hover:bg-red-50 border border-gray-100 rounded-xl transition-all disabled:opacity-0 shadow-sm flex items-center justify-center"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="w-full py-6 border-2 border-dashed border-gray-200 rounded-[32px] text-gray-400 font-black text-[10px] uppercase tracking-[0.25em] hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50/50 transition-all flex items-center justify-center gap-3 mt-4 active:scale-[0.99]"
                                        >
                                            <Plus className="w-5 h-5" /> Tambah Item Pengadaan Baru
                                        </button>
                                    </div>
                                </div>

                                {/* Summary & Actions */}
                                <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-10">
                                    <div className="bg-orange-600 px-10 py-6 rounded-[32px] text-white shadow-xl shadow-orange-600/20 relative overflow-hidden group/total">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover/total:scale-150 transition-transform"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] block mb-1 opacity-70">Estimasi Grand Total</span>
                                        <span className="text-4xl font-black tracking-tighter tabular-nums leading-none">Rp {calculateTotal().toLocaleString()}</span>
                                    </div>
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            Batalkan PO
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 md:flex-none px-12 py-5 bg-orange-600 text-white font-black text-[10px] uppercase tracking-[0.25em] rounded-full shadow-2xl shadow-orange-600/30 hover:bg-orange-700 transition-all active:scale-95 flex items-center justify-center gap-3 group/save"
                                        >
                                            <Save className="w-4 h-4 group-hover:scale-110 transition-transform" /> Simpan & Finalisasi PO <ArrowRight className="w-4 h-4" />
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
