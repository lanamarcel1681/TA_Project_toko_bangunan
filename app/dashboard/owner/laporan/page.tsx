'use client';
import React from 'react';
import { 
    BarChart3, PieChart, TrendingUp, Download, DollarSign, Package, ChevronRight, LayoutGrid, FileText, Activity, ArrowRight
} from 'lucide-react';
import OwnerCharts from '../../../components/OwnerCharts';

export default function LaporanOwnerPage() {
    return (
        <div className="p-8 w-full max-w-[1600px] mx-auto pb-20 text-left">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Business Intelligence</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Laporan & Statistik</h1>
                    <p className="text-gray-500 font-medium mt-3">Monitoring performa toko Bangunan Jaya dalam satu panel dashboard analitik.</p>
                </div>
                <button className="inline-flex items-center justify-center px-10 py-5 bg-orange-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/40 transition-all active:scale-95 group">
                    <Download className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform duration-300" /> 
                    Cetak Laporan Lengkap &rarr;
                </button>
            </div>
            
            {/* Report Access Section */}
            <div className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[.25em]">Akses Laporan Cetak</h2>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Keuangan */}
                    <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl hover:shadow-2xl hover:border-orange-100 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-orange-600 text-white rounded-[24px] flex items-center justify-center mb-8 shadow-lg shadow-orange-600/20 group-hover:scale-110 transition-transform">
                                <DollarSign className="w-8 h-8" />
                            </div>
                            <h3 className="font-black text-gray-900 text-2xl mb-3 tracking-tight group-hover:text-orange-600 transition-colors">Keuangan</h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">Analisis laba rugi, omset penjualan, dan biaya operasional toko secara real-time.</p>
                        </div>
                        <div className="relative z-10 flex items-center justify-between group-hover:translate-x-2 transition-transform duration-300">
                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest border-b-2 border-orange-100 group-hover:border-orange-600 transition-all">
                                Buka Laporan &rarr;
                            </span>
                            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Stok */}
                    <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl hover:shadow-2xl hover:border-orange-100 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gray-900 text-white rounded-[24px] flex items-center justify-center mb-8 shadow-lg shadow-gray-900/20 group-hover:scale-110 transition-transform">
                                <Package className="w-8 h-8" />
                            </div>
                            <h3 className="font-black text-gray-900 text-2xl mb-3 tracking-tight group-hover:text-orange-600 transition-colors">Stok Barang</h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">Mutasi barang, stok opname, dan algoritma peringatan barang menipis.</p>
                        </div>
                        <div className="relative z-10 flex items-center justify-between group-hover:translate-x-2 transition-transform duration-300">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b-2 border-gray-100 group-hover:text-orange-600 group-hover:border-orange-600 transition-all">
                                Buka Laporan &rarr;
                            </span>
                            <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Kategori */}
                    <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl hover:shadow-2xl hover:border-orange-100 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gray-900 text-white rounded-[24px] flex items-center justify-center mb-8 shadow-lg shadow-gray-900/20 group-hover:scale-110 transition-transform">
                                <PieChart className="w-8 h-8" />
                            </div>
                            <h3 className="font-black text-gray-900 text-2xl mb-3 tracking-tight group-hover:text-orange-600 transition-colors">Kategori</h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">Distribusi revenue per kategori dan performa per item material bangunan.</p>
                        </div>
                        <div className="relative z-10 flex items-center justify-between group-hover:translate-x-2 transition-transform duration-300">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b-2 border-gray-100 group-hover:text-orange-600 group-hover:border-orange-600 transition-all">
                                Buka Laporan &rarr;
                            </span>
                            <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Produk Terlaris */}
                    <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl hover:shadow-2xl hover:border-orange-100 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gray-900 text-white rounded-[24px] flex items-center justify-center mb-8 shadow-lg shadow-gray-900/20 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <h3 className="font-black text-gray-900 text-2xl mb-3 tracking-tight group-hover:text-orange-600 transition-colors">Produk Terlaris</h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">Top 10 fast-moving items berdasarkan volume transaksi kumulatif.</p>
                        </div>
                        <div className="relative z-10 flex items-center justify-between group-hover:translate-x-2 transition-transform duration-300">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b-2 border-gray-100 group-hover:text-orange-600 group-hover:border-orange-600 transition-all">
                                Buka Laporan &rarr;
                            </span>
                            <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Dashboard Section */}
            <div className="relative">
                <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[.25em]">Dashboard Analitik Visual</h2>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </div>
                
                <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden group/chart-container">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-orange-400"></div>
                    <OwnerCharts />
                </div>
            </div>
        </div>
    );
}
