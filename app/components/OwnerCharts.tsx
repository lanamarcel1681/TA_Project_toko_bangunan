"use client";

import { useState } from 'react';

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';

export const salesData = [
    { name: 'Jan', Pembelian: 9000000, Penjualan: 15000000 },
    { name: 'Feb', Pembelian: 11000000, Penjualan: 17000000 },
    { name: 'Mar', Pembelian: 9500000, Penjualan: 15500000 },
    { name: 'Apr', Pembelian: 13000000, Penjualan: 18500000 },
    { name: 'Mei', Pembelian: 11500000, Penjualan: 16500000 },
    { name: 'Jun', Pembelian: 15000000, Penjualan: 21500000 },
    { name: 'Jul', Pembelian: 14000000, Penjualan: 20000000 },
    { name: 'Agu', Pembelian: 12500000, Penjualan: 18500000 },
    { name: 'Sep', Pembelian: 16500000, Penjualan: 23500000 },
    { name: 'Okt', Pembelian: 15800000, Penjualan: 22500000 },
    { name: 'Nov', Pembelian: 17500000, Penjualan: 25000000 },
    { name: 'Des', Pembelian: 19500000, Penjualan: 29000000 },
];

export const productData = [
    { name: 'Semen Portland', value: 90000000 },
    { name: 'Besi Beton 10mm', value: 75000000 },
    { name: 'Cat Tembok 5kg', value: 62000000 },
    { name: 'Bata Merah Press', value: 45000000 },
    { name: 'Genteng Keramik', value: 35000000 },
    { name: 'Paku Kayu 5cm', value: 25000000 },
    { name: 'Triplek 12mm', value: 20000000 },
    { name: 'Pipa PVC 3"', value: 18000000 },
];

export const categoryData = [
    { name: 'Semen', value: 145 },
    { name: 'Besi', value: 92 },
    { name: 'Cat', value: 78 },
    { name: 'Bata', value: 165 },
    { name: 'Kayu', value: 55 },
    { name: 'Pipa', value: 42 },
    { name: 'Lainnya', value: 30 },
];
const COLORS = ['#ea580c', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e'];

export const stockData = [
    { sku: 'SEM-001', name: 'Semen Portland Tiga Roda', category: 'Semen', stock: 500, unit: 'sak', status: 'Aman' },
    { sku: 'BES-001', name: 'Besi Beton Ulir 10mm', category: 'Besi', stock: 2000, unit: 'kg', status: 'Aman' },
    { sku: 'CAT-001', name: 'Cat Tembok Dulux 5kg', category: 'Cat', stock: 150, unit: 'kaleng', status: 'Aman' },
    { sku: 'BAT-001', name: 'Bata Merah Press', category: 'Bata', stock: 10000, unit: 'buah', status: 'Aman' },
    { sku: 'KYU-001', name: 'Triplek 12mm', category: 'Kayu', stock: 300, unit: 'lembar', status: 'Aman' },
    { sku: 'GEN-001', name: 'Genteng Keramik KIA', category: 'Genteng', stock: 50, unit: 'buah', status: 'Menipis' },
    { sku: 'PIP-001', name: 'Pipa PVC Wavin 3"', category: 'Pipa', stock: 800, unit: 'batang', status: 'Aman' },
    { sku: 'PAS-001', name: 'Pasir Beton', category: 'Pasir', stock: 0, unit: 'm³', status: 'Habis' },
    { sku: 'PKU-001', name: 'Paku Kayu 5cm', category: 'Logam', stock: 25, unit: 'box', status: 'Menipis' },
    { sku: 'TRP-002', name: 'Triplek 9mm', category: 'Kayu', stock: 120, unit: 'lembar', status: 'Aman' },
];

const dailyData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    revenue: Math.floor(Math.random() * 5000000) + 2000000,
    purchases: Math.floor(Math.random() * 3000000) + 1000000
}));

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

interface OwnerChartsProps {
    externalData?: {
        salesData: any[];
        productData: any[];
        categoryData: any[];
        stockData: any[];
        dailyData: any[];
    }
}

export default function OwnerCharts({ externalData }: OwnerChartsProps) {
    const [period, setPeriod] = useState('bulan_ini');

    // Dynamic data based on period or external source
    const getSalesData = () => {
        if (externalData) {
            const data = externalData.salesData;
            const currentIdx = data.length - 1;

            switch (period) {
                case 'bulan_ini':
                    // Current month in the middle of [Previous, Current, Next]
                    return [
                        data[currentIdx - 1],
                        data[currentIdx],
                        { name: 'Mendatang', Pembelian: null, Penjualan: null, isFuture: true }
                    ].filter(Boolean);
                case '3_bulan':
                    // Last 3 months ending now
                    return data.slice(-3);
                case 'tahun_ini':
                    return data;
                default: // 6_bulan
                    return data.slice(-6);
            }
        }
        switch (period) {
            case 'bulan_ini':
                return [
                    { name: 'Bulan Lalu', Pembelian: 11000000, Penjualan: 17000000 },
                    { name: 'Bulan Ini', Pembelian: 12500000, Penjualan: 18500000 },
                    { name: 'Mendatang', Pembelian: null, Penjualan: null, isFuture: true },
                ];
            case '3_bulan':
                return salesData.slice(-3);
            case 'tahun_ini':
                return salesData;
            default: // 6_bulan
                return salesData.slice(-6);
        }
    };

    const getProductData = () => {
        if (externalData) return externalData.productData.slice(0, 5);
        const multiplier = period === 'bulan_ini' ? 0.2 : period === '3_bulan' ? 0.6 : period === 'tahun_ini' ? 2.5 : 1;
        return productData.slice(0, 5).map(item => ({ ...item, value: item.value * multiplier }));
    };

    const getCategoryData = () => {
        if (externalData) return externalData.categoryData.slice(0, 6);
        const multiplier = period === 'bulan_ini' ? 0.2 : period === '3_bulan' ? 0.6 : period === 'tahun_ini' ? 2.5 : 1;
        return categoryData.slice(0, 6).map(item => ({ ...item, value: Math.round(item.value * multiplier) }));
    };

    const getDailyData = () => {
        if (externalData && externalData.dailyData) return externalData.dailyData;
        return dailyData;
    };

    const currentSalesData = getSalesData();
    const currentProductData = getProductData();
    const currentCategoryData = getCategoryData();
    const currentDailyData = getDailyData();

    // Summary Calculations (Decoupled from chart view range)
    const latestActualData = externalData ? externalData.salesData[externalData.salesData.length - 1] : salesData[salesData.length - 1];
    
    const totalPenjualan = period === 'bulan_ini' 
        ? latestActualData.Penjualan 
        : currentSalesData.reduce((acc, curr) => acc + (curr.Penjualan || 0), 0);
        
    const totalPembelian = period === 'bulan_ini' 
        ? latestActualData.Pembelian 
        : currentSalesData.reduce((acc, curr) => acc + (curr.Pembelian || 0), 0);
        
    const totalProfit = totalPenjualan - totalPembelian;
    const estimatedOperational = totalPenjualan * 0.1; // Placeholder 10% for salaries, electricity, etc.
    const netProfit = totalProfit - estimatedOperational;

    return (
        <div className="space-y-6 mb-8">
            {/* Filter & Badge */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">Terakhir diperbarui: {externalData ? 'Real-time Database' : 'Baru saja'}</span>
                </div>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5 shadow-sm min-w-40"
                >
                    <option value="bulan_ini">Bulan Ini</option>
                    <option value="3_bulan">3 Bulan Terakhir</option>
                    <option value="6_bulan">6 Bulan Terakhir</option>
                    <option value="tahun_ini">Tahun ini (Full)</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:border-orange-200 transition-colors">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Penjualan</p>
                        <h3 className="text-2xl font-black text-gray-800">{formatCurrency(totalPenjualan)}</h3>
                    </div>
                    <div className="mt-4 flex items-center text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md w-fit">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        +12.5% vs periode lalu
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:border-orange-200 transition-colors">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Pembelian</p>
                        <h3 className="text-2xl font-black text-gray-800">{formatCurrency(totalPembelian)}</h3>
                    </div>
                    <div className="mt-4 flex items-center text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md w-fit">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.272-9.272M19 7l-5 5M16 16l-5-5M13 13l-5-5" />
                        </svg>
                        Efisiensi Stok: Tinggi
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:border-green-200 transition-colors">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Laba Kotor</p>
                        <h3 className="text-2xl font-black text-emerald-600">{formatCurrency(totalProfit)}</h3>
                    </div>
                    <div className="mt-4 flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Gross: Terpantau
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:border-purple-200 transition-colors">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Estimasi Laba Bersih</p>
                        <h3 className="text-2xl font-black text-purple-600">{formatCurrency(netProfit)}</h3>
                    </div>
                    <div className="mt-4 flex items-center text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md w-fit">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Net: -10% Op.
                    </div>
                </div>
            </div>

            {/* Top Row: Line Chart & Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-3">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-sm text-gray-800">Tren Penjualan vs Pembelian</h4>
                        <div className="flex items-center gap-4 text-[11px]">
                            <div className="flex items-center gap-1.5 font-medium text-gray-600">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Penjualan
                            </div>
                            <div className="flex items-center gap-1.5 font-medium text-gray-600">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Pembelian
                            </div>
                        </div>
                    </div>
                    <div className="relative h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={currentSalesData}
                                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    tickFormatter={(value: number) => `Rp ${value / 1000000}M`}
                                />
                                <Tooltip
                                    formatter={(value: any) => [formatCurrency(Number(value))]}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Pembelian"
                                    name="Pembelian"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    strokeLinecap="round"
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Penjualan"
                                    name="Penjualan"
                                    stroke="#ea580c"
                                    strokeWidth={4}
                                    strokeLinecap="round"
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                    <h4 className="font-bold text-sm text-gray-800 mb-6">Produk Terlaris (Top 5)</h4>
                    <div className="relative h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={currentProductData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                <XAxis
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    tickFormatter={(value: number) => `Rp ${value / 1000000}M`}
                                />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#4b5563', fontWeight: 'medium' }}
                                    width={80}
                                />
                                <Tooltip
                                    formatter={(value: any) => [formatCurrency(Number(value))]}
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                />
                                <Bar
                                    dataKey="value"
                                    name="Nilai Penjualan"
                                    fill="#ea580c"
                                    radius={[0, 6, 6, 0]}
                                    barSize={24}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Pie Chart & Stock Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-1">
                    <h4 className="font-bold text-sm text-gray-800 mb-2">Kategori Populer</h4>
                    <p className="text-[11px] text-gray-500 mb-6">Distribusi produk {externalData ? 'berdasarkan database' : 'bulan ini'}</p>
                    <div className="relative h-64 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={currentCategoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {currentCategoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any) => [`${value} Transaksi`]}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Total</p>
                            <p className="text-xl font-black text-gray-800">{currentCategoryData.reduce((a, b) => a + b.value, 0)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden flex flex-col min-h-[400px]">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 text-sm">Preview Pendapatan Harian</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">30 Hari Terakhir</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Revenue</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-orange-200"></span>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cost</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-10 h-full min-h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentDailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }}
                                    tickFormatter={(value) => `Rp ${value / 1000000}M`}
                                />
                                <Tooltip
                                    formatter={(value: any) => [formatCurrency(Number(value))]}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="purchases"
                                    stroke="#bfdbfe"
                                    fill="transparent"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#2563eb"
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                    strokeWidth={4}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
