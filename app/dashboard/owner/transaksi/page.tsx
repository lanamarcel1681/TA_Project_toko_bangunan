import { cookies } from 'next/headers';

const summaryData = {
    totalPenjualan: "Rp 52.2 Jt",
    totalPembelian: "Rp 53 Jt",
    labaKotor: "Rp 15.8 Jt"
};

const transactions = [
    {
        id: "INV-2025-001",
        date: "22 Jan 2025",
        type: "Penjualan",
        client: "PT Karya Konstruksi",
        description: "Semen Portland (50 sak), Besi Beton (500 kg)",
        total: "Rp 38.750.000",
        status: "Lunas",
        statusColor: "green"
    },
    {
        id: "INV-2025-002",
        date: "22 Jan 2025",
        type: "Penjualan",
        client: "Toko Bangunan Jaya",
        description: "Cat Tembok (20 kaleng), Kuas (10 pcs)",
        total: "Rp 3.700.000",
        status: "Pending",
        statusColor: "yellow"
    },
    {
        id: "PO-2025-001",
        date: "21 Jan 2025",
        type: "Pembelian",
        client: "PT Semen Indonesia",
        description: "Semen Portland (500 sak)",
        total: "Rp 30.000.000",
        status: "Lunas",
        statusColor: "green"
    },
    {
        id: "INV-2025-003",
        date: "21 Jan 2025",
        type: "Penjualan",
        client: "Bapak Ahmad",
        description: "Bata Merah (5000 buah), Pasir (2 m³)",
        total: "Rp 5.250.000",
        status: "Lunas",
        statusColor: "green"
    },
    {
        id: "PO-2025-002",
        date: "20 Jan 2025",
        type: "Pembelian",
        client: "PT Baja Indonesia",
        description: "Besi Beton 10mm (2000 kg)",
        total: "Rp 23.000.000",
        status: "Pending",
        statusColor: "yellow"
    },
    {
        id: "INV-2025-004",
        date: "20 Jan 2025",
        type: "Penjualan",
        client: "CV Bangun Sejahtera",
        description: "Genteng Keramik (500 buah), Paku (20 kg)",
        total: "Rp 4.500.000",
        status: "Lunas",
        statusColor: "green"
    }
];

export default async function TransaksiPage() {
    return (
        <div className="px-8 py-8 md:max-w-[1400px] w-full mx-auto relative pb-16">

            {/* Page Heading & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Pencatatan Penjualan & Pembelian</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola transaksi penjualan dan pembelian</p>
                </div>
                <button type="button" className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                    <svg className="w-4 h-4 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Tambah Transaksi
                </button>
            </div>

            {/* Header Controls: Search & Date Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input type="text" className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors" placeholder="Cari invoice atau customer..." />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 text-gray-500 min-w-40">
                    <svg className="w-5 h-5 mx-2 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    <div className="relative w-full">
                        <select className="block w-full pl-3 pr-8 py-2.5 border border-gray-200 bg-white rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 appearance-none cursor-pointer">
                            <option>Semua Status</option>
                            <option>Lunas</option>
                            <option>Pending</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-gray-500 overflow-x-auto pb-2 sm:pb-0">
                    <svg className="w-5 h-5 mx-2 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <div className="flex items-center gap-2 min-w-max w-full">
                        <input type="date" className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white min-h-[42px]" title="Dari Tanggal" />
                        <span className="text-gray-400">-</span>
                        <input type="date" className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white min-h-[42px]" title="Sampai Tanggal" />
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Penjualan */}
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100 flex flex-col justify-center">
                    <p className="text-sm font-medium text-green-600 mb-2">Total Penjualan</p>
                    <h3 className="text-3xl font-bold text-green-600">{summaryData.totalPenjualan}</h3>
                    <p className="text-[11px] text-green-500 mt-2">Bulan ini</p>
                </div>

                {/* Total Pembelian */}
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col justify-center">
                    <p className="text-sm font-medium text-blue-600 mb-2">Total Pembelian</p>
                    <h3 className="text-3xl font-bold text-blue-600">{summaryData.totalPembelian}</h3>
                    <p className="text-[11px] text-blue-500 mt-2">Bulan ini</p>
                </div>

                {/* Laba Kotor */}
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 flex flex-col justify-center">
                    <p className="text-sm font-medium text-orange-600 mb-2">Laba Kotor</p>
                    <h3 className="text-3xl font-bold text-orange-600">{summaryData.labaKotor}</h3>
                    <p className="text-[11px] text-orange-500 mt-2">Margin 30%</p>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4">ID Invoice</th>
                                <th scope="col" className="px-6 py-4">Tanggal</th>
                                <th scope="col" className="px-6 py-4">Jenis</th>
                                <th scope="col" className="px-6 py-4 min-w-[200px]">Customer/Supplier</th>
                                <th scope="col" className="px-6 py-4">Total</th>
                                <th scope="col" className="px-6 py-4">Status</th>
                                <th scope="col" className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-gray-700">
                            {transactions.map((tx, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 leading-tight">
                                        {tx.id.split('-').map((part, index) => (
                                            <span key={index}>{part}{index < 2 ? <><br /></> : ''}{index === 0 || index === 1 ? '-' : ''}</span>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 leading-tight">
                                        {tx.date.split(' ').map((part, index) => (
                                            <span key={index}>{part}{index === 1 ? <><br /></> : ' '}</span>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${tx.type === 'Penjualan' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal">
                                        <p className="font-bold text-gray-900 mb-1">{tx.client}</p>
                                        <p className="text-[11px] text-gray-500 leading-tight">
                                            {tx.description.split(', ').map((desc, idx) => (
                                                <span key={idx}>{desc}{idx < tx.description.split(', ').length - 1 ? <>,<br /></> : ''}</span>
                                            ))}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-gray-900 leading-tight">Rp<br />{tx.total.replace('Rp ', '')}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${tx.statusColor === 'green' ? 'bg-green-100 text-green-700' :
                                                tx.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors" title="Lihat">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            </button>
                                            <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors" title="Unduh Invoice">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
