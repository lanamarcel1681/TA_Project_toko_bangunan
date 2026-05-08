'use client';
import React, { useState, useEffect } from 'react';
import { 
    Package, AlertTriangle, TrendingUp, Clock, 
    ArrowUpRight, ArrowDownRight, Box, LayoutGrid, RefreshCw 
} from 'lucide-react';

export default function KaryawanDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/dashboard/stats');
            const result = await res.json();
            setData(result.karyawan);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading && !data) {
        return (
            <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto flex items-center justify-center min-h-[60vh]">
                <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    const lowStock = data?.lowStockCount || 0;
    const totalItems = data?.totalItems || 0;
    const stockItems = data?.stockItems || [];
    const todayActivity = data?.todayActivity || [];

    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20 text-left animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4 md:gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-none mb-2 md:mb-3">Ringkasan Operasional</h1>
                    <p className="text-gray-500 font-medium">Selamat datang kembali! Berikut status inventaris dan aktivitas gudang hari ini.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={fetchData}
                        className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="flex bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">Waktu Sistem</p>
                            <p className="text-sm font-black text-gray-800 leading-tight mt-0.5">
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
                <div className="bg-blue-600 rounded-[24px] md:rounded-[40px] p-6 md:p-10 text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-start justify-between mb-4 md:mb-8">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[20px] flex items-center justify-center shadow-lg border border-white/20">
                            <Box className="w-8 h-8 text-white" />
                        </div>
                        <div className="px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                            Inventaris Aktif
                        </div>
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm font-black uppercase tracking-widest mb-1">Total Jenis Barang</p>
                        <div className="flex items-end gap-3">
                            <h3 className="text-4xl md:text-6xl font-black tracking-tighter">{totalItems}</h3>
                            <p className="text-blue-100 font-black text-sm mb-2">SKU TERDAFTAR</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] md:rounded-[40px] p-6 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-red-50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-start justify-between mb-4 md:mb-8">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-[20px] flex items-center justify-center shadow-sm border border-red-100">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <div className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
                            Status Kritis
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm font-black uppercase tracking-widest mb-1">Stok Menipis / Habis</p>
                        <div className="flex items-end gap-3">
                            <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900">{lowStock}</h3>
                            <p className="text-red-500 font-black text-sm mb-2">PERLU RESTOCK SEGERA</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-8">
                {/* Stok Barang Table */}
                <div className="lg:col-span-3 bg-white rounded-[24px] md:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 md:px-10 py-5 md:py-8 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center">
                                <LayoutGrid className="w-5 h-5" />
                            </div>
                            <h4 className="font-black text-gray-900 tracking-tight">Status Stok Inventaris</h4>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="space-y-2">
                            {stockItems.map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-3 md:p-5 rounded-[16px] md:rounded-[24px] bg-gray-50/50 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                                            item.status === 'low' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-600'
                                        }`}>
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-black text-gray-800 leading-tight mb-0.5">{item.name}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.category}</p>
                                        </div>
                                    </div>
                                    <div className="ml-3 md:ml-6 text-right flex-shrink-0">
                                        <p className="text-sm font-black text-gray-900 mb-1">{item.stock.toLocaleString('id-ID')} <span className="text-gray-400 text-[10px] uppercase">{item.unit}</span></p>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                                            item.status === 'low' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                                        }`}>
                                            {item.status === 'low' ? 'Low Stock' : 'Optimized'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {!stockItems.length && (
                                <div className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                    Belum ada data barang
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Aktivitas Hari Ini */}
                <div className="lg:col-span-2 bg-white rounded-[24px] md:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden text-left">
                    <div className="px-5 md:px-10 py-5 md:py-8 border-b border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h4 className="font-black text-gray-900 tracking-tight">Log Aktivitas Barang</h4>
                        </div>
                    </div>
                    <div className="p-4 md:p-8">
                        <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                            {todayActivity.map((act: any, i: number) => (
                                <div key={i} className="relative flex items-start gap-6 group">
                                    <div className={`mt-0.5 relative z-10 flex-shrink-0 w-10 h-10 rounded-2xl border-4 border-white shadow-sm flex items-center justify-center transition-all group-hover:scale-110 ${
                                        act.type === 'masuk' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                                    }`}>
                                        {act.type === 'masuk' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-4 mb-1">
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${
                                                act.type === 'masuk' ? 'text-green-600' : 'text-orange-600'
                                            }`}>
                                                {act.type === 'masuk' ? 'Barang Masuk' : 'Barang Keluar'}
                                            </p>
                                            <span className="text-[10px] font-black text-gray-300 font-mono tracking-tighter">{act.time}</span>
                                        </div>
                                        <p className="text-sm font-black text-gray-800 leading-tight mb-1">{act.item}</p>
                                        <p className="text-[11px] font-bold text-gray-400">{act.qty} {act.unit} telah diolah sistem</p>
                                    </div>
                                </div>
                            ))}
                            {!todayActivity.length && (
                                <div className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                    Belum ada aktivitas hari ini
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
