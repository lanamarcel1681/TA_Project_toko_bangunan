import { cookies } from 'next/headers';
import Link from 'next/link';
import AddProductClient from './AddProductClient';
import { Package, ShieldCheck, AlertTriangle, XCircle, Search, Eye, Edit3, Trash2, ChevronRight, LayoutGrid } from 'lucide-react';

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
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            {/* Page Heading & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Inventory System</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Manajemen Produk</h1>
                    <p className="text-gray-500 font-medium mt-3">Monitoring stok, klasifikasi kategori, dan kontrol inventaris gudang secara akurat.</p>
                </div>
                <AddProductClient />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">Total Produk</p>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{summaryData.totalProduk}</h3>
                    <div className="w-10 h-1 bg-orange-600 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none text-green-600">Stok Aman</p>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{summaryData.stokAman}</h3>
                    <div className="w-10 h-1 bg-green-500 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none text-yellow-600">Stok Menipis</p>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{summaryData.stokMenipis}</h3>
                    <div className="w-10 h-1 bg-yellow-500 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none text-red-600">Stok Habis</p>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{summaryData.stokHabis}</h3>
                    <div className="w-10 h-1 bg-red-500 rounded-full"></div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8 group">
                <div className="relative w-full shadow-lg shadow-gray-200/40 rounded-full overflow-hidden border border-gray-100 group-hover:border-orange-200 transition-all duration-300">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <input type="text" className="block w-full pl-14 pr-6 py-5 bg-white placeholder-gray-400 focus:outline-none sm:text-sm font-medium text-gray-900" placeholder="Cari berdasarkan SKU atau Nama Produk bangunan..." />
                </div>
            </div>

            {/* Produk Table */}
            <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative group/table">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/20 -mr-32 -mt-32 rounded-full blur-3xl opacity-0 group-hover/table:opacity-100 transition-opacity duration-1000"></div>
                
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">SKU ID</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] min-w-[200px]">Detail Produk</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Kategori</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Harga Satuan</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Sisa Stok</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] text-right">Integrasi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((product, i) => (
                                <tr key={i} className="hover:bg-orange-50/30 transition-all duration-300 group/row">
                                    <td className="px-8 py-8 font-black text-gray-400 text-xs tracking-wider group-hover/row:text-orange-600 transition-colors">
                                        #{product.sku}
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0 group-hover/row:scale-110 transition-transform">
                                                <Package className="w-6 h-6 text-gray-300 group-hover/row:text-orange-500 transition-colors" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-base tracking-tight leading-none group-hover/row:text-orange-600 transition-colors mb-1">{product.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.unit}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-500 border border-gray-100 group-hover/row:bg-orange-100 group-hover/row:text-orange-600 group-hover/row:border-orange-200 transition-all">
                                            <LayoutGrid className="w-3 h-3" /> {product.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <p className="font-black text-gray-900 text-base tracking-tight leading-none">{product.price}</p>
                                    </td>
                                    <td className="px-8 py-8">
                                        <p className={`font-black text-base tracking-tight leading-none ${product.statusColor === 'yellow' ? 'text-yellow-600 animate-pulse' : 'text-gray-900'}`}>{product.stock}</p>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                            product.statusColor === 'green' ? 'bg-green-50 text-green-700 border-green-100' :
                                            product.statusColor === 'yellow' ? 'bg-yellow-50 text-yellow-700 border-yellow-100 outline outline-4 outline-yellow-100/30' :
                                            'bg-gray-50 text-gray-700 border-gray-100'
                                        }`}>
                                            {product.statusColor === 'green' ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2 translate-x-4 opacity-0 group-hover/row:translate-x-0 group-hover/row:opacity-100 transition-all duration-300">
                                            <Link href={`/dashboard/owner/barang/${product.sku}`} className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:border-orange-200 active:scale-90 transition-all" title="Detail">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 active:scale-90 transition-all" title="Edit">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-200 active:scale-90 transition-all" title="Hapus">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="bg-gray-50/50 p-6 border-t border-gray-100 flex items-center justify-between relative z-10">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Menampilkan 8 dari 342 Produk Terdaftar</p>
                    <button className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">Muat Lebih Banyak <ChevronRight className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    );
}

