import { PrismaClient } from '@prisma/client';
import AddProductClient from './AddProductClient';
import OwnerBarangTable from './OwnerBarangTable';
import { Package, Search } from 'lucide-react';

const prisma = new PrismaClient();

export default async function BarangPage() {
    // Fetch actual data
    const products = await prisma.barang.findMany({
        include: {
            kategori: true,
            satuan: true,
            barang_supplier: true
        },
        orderBy: {
            id_barang: 'desc'
        }
    });

    const categories = await prisma.kategoriBarang.findMany({
        orderBy: { nama_kategori: 'asc' }
    });

    const units = await prisma.satuanBarang.findMany({
        orderBy: { satuan_barang: 'asc' }
    });

    const suppliers = await prisma.supplier.findMany({
        orderBy: { nama_perusahaan_supplier: 'asc' }
    });

    // Calculate sumamry data
    const totalProduk = products.length;
    
    // Status depends on logic from DB (Tersedia, Menipis, Habis) or we strictly follow the strings.
    const stokAman = products.filter(p => !["Menipis", "Habis"].includes(p.status_barang) || p.status_barang === "Tersedia").length;
    const stokMenipis = products.filter(p => p.status_barang === "Menipis").length;
    const stokHabis = products.filter(p => p.status_barang === "Habis").length;

    const summaryData = {
        totalProduk: totalProduk.toString(),
        stokAman: stokAman.toString(),
        stokMenipis: stokMenipis.toString(),
        stokHabis: stokHabis.toString()
    };

    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
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
                <AddProductClient categories={categories} units={units} suppliers={suppliers} />
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
                    <input type="text" className="block w-full pl-14 pr-6 py-5 bg-white placeholder-gray-400 focus:outline-none sm:text-sm font-medium text-gray-900" placeholder="Cari berdasarkan Nama Produk bangunan..." />
                </div>
            </div>

            {/* Produk Table Component */}
            <OwnerBarangTable initialProducts={products} categories={categories} units={units} suppliers={suppliers} />
        </div>
    );
}

