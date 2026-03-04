"use client";

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
} from 'recharts';

const salesData = [
    { name: 'Jan', Pembelian: 9000000, Penjualan: 15000000 },
    { name: 'Feb', Pembelian: 11000000, Penjualan: 17000000 },
    { name: 'Mar', Pembelian: 9000000, Penjualan: 15000000 },
    { name: 'Apr', Pembelian: 13000000, Penjualan: 18000000 },
    { name: 'Mei', Pembelian: 11000000, Penjualan: 16000000 },
    { name: 'Jun', Pembelian: 15000000, Penjualan: 21000000 },
];

const productData = [
    { name: 'Semen Portland', value: 90000000 },
    { name: 'Besi Beton 10mm', value: 70000000 },
    { name: 'Cat Tembok', value: 60000000 },
    { name: 'Bata Merah', value: 40000000 },
    { name: 'Genteng Keramik', value: 30000000 },
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export default function OwnerCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-3">
                <h4 className="font-bold text-sm text-gray-800 mb-6">Penjualan vs Pembelian (6 Bulan Terakhir)</h4>
                <div className="relative h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={salesData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value: number) => `Rp ${value / 1000000}M`}
                            />
                            <Tooltip
                                formatter={(value: any) => [formatCurrency(Number(value)), 'Nilai']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Line
                                type="monotone"
                                dataKey="Pembelian"
                                name="Pembelian"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Penjualan"
                                name="Penjualan"
                                stroke="#ea580c"
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                <h4 className="font-bold text-sm text-gray-800 mb-6">Produk Terlaris</h4>
                <div className="relative h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={productData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value: number) => `Rp ${value / 1000000}M`}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11 }}
                            />
                            <Tooltip
                                formatter={(value: any) => [formatCurrency(Number(value)), 'Nilai Penjualan']}
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar
                                dataKey="value"
                                name="Nilai Penjualan"
                                fill="#ea580c"
                                radius={[0, 4, 4, 0]}
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
