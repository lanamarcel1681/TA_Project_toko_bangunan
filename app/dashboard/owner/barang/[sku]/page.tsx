import Link from 'next/link';

// Dummy products database for demo purposes
const productsData = [
    {
        sku: "SEM-001",
        name: "Semen Portland",
        category: "Semen",
        price: "Rp 65.000",
        unit: "/sak",
        stock: "500",
        status: "Tersedia",
        statusColor: "green",
        description: "Semen Portland berkualitas tinggi cocok untuk berbagai kebutuhan konstruksi umum seperti pengecoran, plesteran, dan pemasangan bata. Memiliki daya rekat yang kuat dan waktu pengeringan yang optimal.",
        lastRestock: "12 Januari 2026",
        supplier: "PT. Semen Indonesia",
        location: "Gudang Utama - Rak A1"
    },
    {
        sku: "BES-001",
        name: "Besi Beton 10mm",
        category: "Besi",
        price: "Rp 12.500",
        unit: "/kg",
        stock: "2.000",
        status: "Tersedia",
        statusColor: "green",
        description: "Besi beton polos ukuran 10mm berstandar SNI. Ideal untuk penulangan konstruksi beton seperti sloof, kolom, dan ring balk.",
        lastRestock: "20 Januari 2026",
        supplier: "Baja Perkasa Corp",
        location: "Area Terbuka - Sektor B"
    },
    {
        sku: "CAT-001",
        name: "Cat Tembok Exterior",
        category: "Cat",
        price: "Rp 180.000",
        unit: "/kaleng",
        stock: "150",
        status: "Tersedia",
        statusColor: "green",
        description: "Cat tembok khusus eksterior dengan perlindungan cuaca ekstrem (Weather Shield). Tahan terhadap jamur, lumut, dan sinar UV sehingga warna tidak mudah pudar.",
        lastRestock: "5 Februari 2026",
        supplier: "CV. Warna Agung",
        location: "Gudang B - Rak C3"
    },
    {
        sku: "BAT-001",
        name: "Bata Merah Press",
        category: "Bata",
        price: "Rp 950",
        unit: "/buah",
        stock: "10.000",
        status: "Tersedia",
        statusColor: "green",
        description: "Bata merah hasil cetak mesin press dengan presisi ukuran yang baik dan tingkat kekerasan maksimal. Sangat cocok untuk dinding bangunan yang kokoh.",
        lastRestock: "10 Februari 2026",
        supplier: "Lokal (Pengrajin Bata)",
        location: "Area Terbuka - Sektor A"
    },
    {
        sku: "PAS-001",
        name: "Pasir Beton",
        category: "Pasir",
        price: "Rp 250.000",
        unit: "/m³",
        stock: "100",
        status: "Menipis",
        statusColor: "yellow",
        description: "Pasir cor atau pasir beton dengan butiran kasar dan bebas lumpur, sangat ideal untuk campuran adukan cor beton struktural.",
        lastRestock: "15 Desember 2025",
        supplier: "Tambang Pasir Lestari",
        location: "Area Pasir & Batu"
    }
];

export default async function ProductDetailPage({ params }: { params: Promise<{ sku: string }> }) {
    const { sku } = await params;

    // Find matching product or return undefined/fallback
    const product = productsData.find(p => p.sku === sku);

    if (!product) {
        return (
            <div className="px-8 py-12 flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Produk Tidak Ditemukan</h2>
                <p className="text-gray-500 mb-6">SKU produk '{sku}' tidak terdaftar di sistem.</p>
                <Link href="/dashboard/owner/barang" className="px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                    Kembali ke Pencatatan Barang
                </Link>
            </div>
        );
    }

    return (
        <div className="px-8 py-8 md:max-w-5xl w-full mx-auto pb-16">

            {/* Header / Back Navigation */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/owner/barang" className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors group">
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">Detail Produk</h2>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                        <Link href="/dashboard/owner/barang" className="hover:text-orange-600 transition-colors">Barang</Link>
                        <span>&bull;</span>
                        <span className="text-gray-900 font-medium">{product.sku}</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Image & Quick Actions */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Placeholder Image */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center aspect-square text-center">
                        <div className="w-24 h-24 mb-4 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                        <p className="text-sm font-medium text-gray-500">{product.sku}</p>

                        <div className="mt-4 flex items-center gap-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${product.statusColor === 'green' ? 'bg-green-100 text-green-700' :
                                    product.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {product.status}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                {product.category}
                            </span>
                        </div>
                    </div>

                    {/* Stock Alert Warning (if applicable) */}
                    {product.statusColor === 'yellow' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                            <svg className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <div>
                                <h4 className="text-sm font-bold text-yellow-800">Perhatian Stok Menipis</h4>
                                <p className="text-xs text-yellow-700 mt-1">Stok produk ini hampir habis. Segera lakukan pemesanan ulang ke supplier.</p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            Edit Item
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-red-100 text-red-600 rounded-xl font-medium text-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            Hapus
                        </button>
                    </div>
                </div>

                {/* Right Column: Detailed Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Specs */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Informasi Detail
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Harga Jual / Satuan</p>
                                <p className="text-lg font-bold text-gray-900">{product.price} <span className="text-sm font-medium text-gray-500">{product.unit}</span></p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Stok Tersedia</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {product.stock} <span className="text-sm font-medium text-gray-500">{product.unit.replace('/', '')}</span>
                                </p>
                            </div>
                            <div className="sm:col-span-2 pt-2">
                                <p className="text-xs font-medium text-gray-500 mb-2">Deskripsi Produk</p>
                                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Inventory & Logistics Info */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
                            Informasi Logistik
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Supplier Utama</p>
                                    <p className="text-sm font-bold text-gray-900">{product.supplier}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Lokasi Penyimpanan</p>
                                    <p className="text-sm font-bold text-gray-900">{product.location}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Pemilik Terakhir Restock</p>
                                    <p className="text-sm font-bold text-gray-900">{product.lastRestock}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
