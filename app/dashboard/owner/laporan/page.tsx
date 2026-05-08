'use client';
import React, { useState, useEffect } from 'react';
import {
    BarChart3, PieChart as PieChartIcon, TrendingUp, Download, DollarSign, Package, ChevronRight, LayoutGrid, FileText, Activity, ArrowRight, X, Loader2
} from 'lucide-react';
import OwnerCharts from '../../../components/OwnerCharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#ea580c', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e'];

export default function LaporanOwnerPage() {
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<{
        salesData: any[];
        stockData: any[];
        categoryData: any[];
        productData: any[];
        dailyData: any[];
    }>({
        salesData: [],
        stockData: [],
        categoryData: [],
        productData: [],
        dailyData: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/owner/laporan');
                const data = await response.json();
                if (data && !data.error) {
                    setReportData(data);
                }
            } catch (error) {
                console.error("Failed to fetch report data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const handlePrintPDF = (type: string) => {
        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString('id-ID');

        // Header
        doc.setFontSize(20);
        doc.text('TB. LUMBUNG JAYA', 105, 15, { align: 'center' });
        doc.setFontSize(14);
        doc.text(`Laporan ${type}`, 105, 25, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Dicetak pada: ${timestamp}`, 105, 32, { align: 'center' });
        doc.line(20, 35, 190, 35);

        if (type === 'Keuangan' || type === 'Lengkap') {
            autoTable(doc, {
                startY: 45,
                head: [['Bulan', 'Total Pembelian', 'Total Penjualan', 'Laba Kotor']],
                body: reportData.salesData.map(d => [
                    d.name,
                    formatCurrency(d.Pembelian),
                    formatCurrency(d.Penjualan),
                    formatCurrency(d.Penjualan - d.Pembelian)
                ]),
                theme: 'striped',
                headStyles: { fillColor: [234, 88, 12] }
            });
        }

        if (type === 'Stok Barang' || type === 'Lengkap') {
            const startY = (doc as any).lastAutoTable?.finalY + 10 || 45;
            if (type === 'Lengkap') doc.text('Detail Stok Barang', 14, startY - 2);
            autoTable(doc, {
                startY: startY,
                head: [['SKU', 'Nama Barang', 'Kategori', 'Stok', 'Satuan', 'Status']],
                body: reportData.stockData.map(d => [d.sku, d.name, d.category, d.stock, d.unit, d.status]),
                theme: 'striped',
                headStyles: { fillColor: [17, 24, 39] }
            });
        }

        if (type === 'Kategori' || type === 'Lengkap') {
            const startY = (doc as any).lastAutoTable?.finalY + 10 || 45;
            if (type === 'Lengkap') doc.text('Distribusi Penjualan per Kategori', 14, startY - 2);
            autoTable(doc, {
                startY: startY,
                head: [['Nama Kategori', 'Jumlah Transaksi', 'Total Revenue']],
                body: reportData.categoryData.map(d => [d.name, d.value, formatCurrency(d.revenue)]),
                theme: 'striped',
                headStyles: { fillColor: [17, 24, 39] }
            });
        }

        if (type === 'Produk Terlaris' || type === 'Lengkap') {
            const startY = (doc as any).lastAutoTable?.finalY + 10 || 45;
            if (type === 'Lengkap') doc.text('Top 10 Produk Terlaris', 14, startY - 2);
            autoTable(doc, {
                startY: startY,
                head: [['Peringkat', 'Nama Produk', 'Qty Terjual', 'Nilai Penjualan']],
                body: reportData.productData.map((d, i) => [i + 1, d.name, d.qty, formatCurrency(d.value)]),
                theme: 'striped',
                headStyles: { fillColor: [17, 24, 39] }
            });
        }

        doc.save(`Laporan_${type.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
                <p className="text-sm font-black text-gray-400 uppercase tracking-[.3em]">Menyiapkan Intelligence Data...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto pb-20 text-left">
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
                    <p className="text-gray-500 font-medium mt-3">Monitoring performa toko TB. Lumbung Jaya dalam satu panel dashboard analitik.</p>
                </div>
                <button
                    onClick={() => handlePrintPDF('Lengkap')}
                    className="inline-flex items-center justify-center px-10 py-5 bg-orange-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/40 transition-all active:scale-95 group"
                >
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
                    <div
                        onClick={() => setSelectedReport('Keuangan')}
                        className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl hover:shadow-2xl hover:border-orange-100 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
                    >
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
                    <div
                        onClick={() => setSelectedReport('Stok Barang')}
                        className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl hover:shadow-2xl hover:border-orange-100 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
                    >
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
                    <div
                        onClick={() => setSelectedReport('Kategori')}
                        className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl hover:shadow-2xl hover:border-orange-100 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gray-900 text-white rounded-[24px] flex items-center justify-center mb-8 shadow-lg shadow-gray-900/20 group-hover:scale-110 transition-transform">
                                <PieChartIcon className="w-8 h-8" />
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
                    <div
                        onClick={() => setSelectedReport('Produk Terlaris')}
                        className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl hover:shadow-2xl hover:border-orange-100 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
                    >
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
                    <OwnerCharts externalData={reportData} />
                </div>
            </div>

            {/* Report Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Laporan {selectedReport}</h3>
                                <p className="text-sm text-gray-500 font-medium mt-1">Preview grafik dan detail data laporan dari database</p>
                            </div>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="w-12 h-12 bg-white text-gray-400 rounded-full flex items-center justify-center shadow-sm hover:text-orange-600 hover:rotate-90 transition-all duration-300 border border-gray-100"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto flex-1">
                            <div className="mb-8 bg-gray-50/30 rounded-3xl p-8 border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em]">Visualisasi Data Database</h4>
                                    <div className="h-px bg-gray-200 flex-1 mx-4"></div>
                                </div>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {selectedReport === 'Keuangan' ? (
                                            <BarChart data={reportData.salesData.slice(-6)}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `Rp ${v / 1000000}M`} />
                                                <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                                <Bar dataKey="Penjualan" fill="#ea580c" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="Pembelian" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        ) : selectedReport === 'Stok Barang' ? (
                                            <BarChart data={reportData.stockData.slice(0, 10)}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#94a3b8' }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                                <Bar dataKey="stock" fill="#111827" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        ) : selectedReport === 'Kategori' ? (
                                            <PieChart>
                                                <Pie data={reportData.categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                    {reportData.categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                            </PieChart>
                                        ) : (
                                            <BarChart data={reportData.productData.slice(0, 5)} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `Rp ${v / 1000000}M`} />
                                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#4b5563' }} width={80} />
                                                <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                                <Bar dataKey="value" fill="#ea580c" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        )}
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em]">Format Laporan</h4>
                                    <div className="h-px bg-gray-200 flex-1 mx-4"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">Dokumen PDF</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Format Tabel Standar</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handlePrintPDF(selectedReport)}
                                            className="px-6 py-3 bg-gray-900 text-white rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg shadow-gray-900/10"
                                        >
                                            Cetak PDF
                                        </button>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between opacity-50 cursor-not-allowed">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                                                <LayoutGrid className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">Excel Spreadsheet</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Raw Data Export</p>
                                            </div>
                                        </div>
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Coming Soon</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="px-10 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-black text-[10px] uppercase tracking-[.2em] hover:bg-gray-100 transition-all active:scale-95 shadow-sm"
                            >
                                Tutup Panel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
