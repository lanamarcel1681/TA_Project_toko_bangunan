import { cookies } from 'next/headers';
import Link from 'next/link';

const summaryData = {
    totalProduk: "342",
    stokAman: "298",
    stokMenipis: "32",
    stokHabis: "12"
};

const products = [
    {
        sku: "SEM-001",
        name: "Semen Portland",
        category: "Semen",
        price: "Rp 65.000",
        unit: "/sak",
        stock: "500 sak",
        status: "Tersedia",
        statusColor: "green"
    },
    {
        sku: "BES-001",
        name: "Besi Beton 10mm",
        category: "Besi",
        price: "Rp 12.500",
        unit: "/kg",
        stock: "2.000 kg",
        status: "Tersedia",
        statusColor: "green"
    },
    {
        sku: "CAT-001",
        name: "Cat Tembok Exterior",
        category: "Cat",
        price: "Rp 180.000",
        unit: "/kaleng",
        stock: "150 kaleng",
        status: "Tersedia",
        statusColor: "green"
    },
    {
        sku: "BAT-001",
        name: "Bata Merah Press",
        category: "Bata",
        price: "Rp 950",
        unit: "/buah",
        stock: "10.000 buah",
        status: "Tersedia",
        statusColor: "green"
    },
    {
        sku: "KYU-001",
        name: "Triplek 12mm",
        category: "Kayu",
        price: "Rp 125.000",
        unit: "/lembar",
        stock: "300 lembar",
        status: "Tersedia",
        statusColor: "green"
    },
    {
        sku: "GEN-001",
        name: "Genteng Keramik",
        category: "Genteng",
        price: "Rp 8.500",
        unit: "/buah",
        stock: "5.000 buah",
        status: "Tersedia",
        statusColor: "green"
    },
    {
        sku: "PIP-001",
        name: "Pipa PVC 3\"",
        category: "Pipa",
        price: "Rp 35.000",
        unit: "/batang",
        stock: "800 batang",
        status: "Tersedia",
        statusColor: "green"
    },
    {
        sku: "PAS-001",
        name: "Pasir Beton",
        category: "Pasir",
        price: "Rp 250.000",
        unit: "/m³",
        stock: "100 m³",
        status: "Menipis",
        statusColor: "yellow"
    }
];

export default async function BarangPage() {
    return (
        <div className="px-8 py-8 md:max-w-[1400px] w-full mx-auto relative pb-16">

            {/* Page Heading & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Pencatatan Barang</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola data produk dan stok barang</p>
                </div>
                <button type="button" className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#ea580c] hover:bg-[#c2410c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                    <svg className="w-4 h-4 mr-2 -ml-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Tambah Produk
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Produk */}
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 flex items-center justify-between">
                    <div>
                        <p className="text-[12px] font-medium text-gray-500 mb-1">Total<br />Produk</p>
                        <h3 className="text-3xl font-bold text-gray-900">{summaryData.totalProduk}</h3>
                    </div>
                    <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-orange-500/30">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    </div>
                </div>

                {/* Stok Aman */}
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100 flex items-center justify-between">
                    <div>
                        <p className="text-[12px] font-medium text-gray-500 mb-1">Stok Aman</p>
                        <h3 className="text-3xl font-bold text-gray-900">{summaryData.stokAman}</h3>
                    </div>
                    <div className="w-14 h-14 bg-[#10b981] rounded-xl flex items-center justify-center text-white shadow-sm shadow-green-500/30">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    </div>
                </div>

                {/* Stok Menipis */}
                <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100 flex items-center justify-between">
                    <div>
                        <p className="text-[12px] font-medium text-gray-500 mb-1">Stok<br />Menipis</p>
                        <h3 className="text-3xl font-bold text-gray-900">{summaryData.stokMenipis}</h3>
                    </div>
                    <div className="w-14 h-14 bg-[#d97706] rounded-xl flex items-center justify-center text-white shadow-sm shadow-yellow-500/30">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    </div>
                </div>

                {/* Stok Habis */}
                <div className="bg-red-50 rounded-2xl p-6 border border-red-100 flex items-center justify-between">
                    <div>
                        <p className="text-[12px] font-medium text-gray-500 mb-1">Stok Habis</p>
                        <h3 className="text-3xl font-bold text-gray-900">{summaryData.stokHabis}</h3>
                    </div>
                    <div className="w-14 h-14 bg-[#ef4444] rounded-xl flex items-center justify-center text-white shadow-sm shadow-red-500/30">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input type="text" className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors shadow-sm" placeholder="Cari produk atau SKU..." />
                </div>
            </div>

            {/* Produk Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                {/* Divider top */}
                <div className="w-full border-t border-gray-100"></div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4 border-b border-gray-100">SKU</th>
                                <th scope="col" className="px-6 py-4 border-b border-gray-100 min-w-[200px]">Nama Produk</th>
                                <th scope="col" className="px-6 py-4 border-b border-gray-100">Kategori</th>
                                <th scope="col" className="px-6 py-4 border-b border-gray-100">Harga</th>
                                <th scope="col" className="px-6 py-4 border-b border-gray-100">Stok</th>
                                <th scope="col" className="px-6 py-4 border-b border-gray-100">Status</th>
                                <th scope="col" className="px-6 py-4 border-b border-gray-100 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 border-b border-gray-100 text-gray-700">
                            {products.map((product, i) => (
                                <tr key={i} className={`hover:bg-gray-50/50 transition-colors ${product.statusColor === 'yellow' ? 'bg-yellow-50/30' : ''}`}>
                                    <td className="px-6 py-5 text-gray-400 font-medium">
                                        {product.sku.split('-').map((part, index) => (
                                            <span key={index}>{part}{index === 0 ? <><br />-</> : ''}</span>
                                        ))}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="font-bold text-gray-800 flex flex-col">
                                            {product.name.split(' ').map((part, index, arr) => (
                                                <span key={index}>{part}{index === 0 && arr.length > 2 ? <br /> : ' '}</span>
                                            ))}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="font-bold text-gray-800 flex flex-col">
                                            {product.price.split(' ').map((part, index) => (
                                                <span key={index}>{part}{index === 0 ? <br /> : ''}</span>
                                            ))}
                                            <span className="text-[10px] text-gray-400 font-normal">{product.unit}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-gray-600 flex flex-col ${product.statusColor === 'yellow' ? 'font-bold' : ''}`}>
                                            {product.stock.split(' ')[0]}<br />{product.stock.split(' ')[1]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${product.statusColor === 'green' ? 'bg-green-100 text-green-700' :
                                            product.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <Link href={`/dashboard/owner/barang/${product.sku}`} className="text-gray-400 hover:text-orange-600 transition-colors" title="Lihat Detail">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            </Link>
                                            <button className="text-blue-500 hover:text-blue-700 transition-colors" title="Edit">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                            </button>
                                            <button className="text-red-500 hover:text-red-700 transition-colors" title="Hapus">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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
