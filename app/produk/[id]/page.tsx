import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Dummy data matching the one from /produk/page.tsx
const allProducts = [
    {
        id: 1, name: "Semen Portland Tiga Roda 40kg", brand: "Tiga Roda", price: 65000, originalPrice: 75000,
        rating: 4.8, reviewCount: 4360, location: "Jakarta Timur", sold: "1rb+",
        image: "https://www.tokotigaroda.com/images-data/product/4/pcc-bag-50kg.jpg",
        category: "Semen", badge: "Hot",
        description: "Semen Portland tipe 1 dari Tiga Roda yang dirancang dengan mutu teruji untuk berbagai kebutuhan bangunan mulai dari plesteran, acian, hingga pengecoran umum. Lebih kuat dan cepat kering dengan daya tahan tinggi terhadap retak.",
        specs: [
            { label: "Berat Bersih", value: "40 kg" },
            { label: "Tipe", value: "PCC (Portland Composite Cement)" },
            { label: "SNI", value: "Tersertifikasi SNI 7064:2014" },
            { label: "Warna", value: "Abu-abu" }
        ]
    },
    {
        id: 2, name: "Besi Beton Ulir 12mm (6m)", brand: "Krakatau Steel", price: 132500,
        rating: 4.5, reviewCount: 4923, location: "Jakarta Pusat", sold: "2rb+",
        image: "https://jualbesi.com/wp-content/uploads/2021/04/besi-beton-ulir-U_.jpg",
        category: "Besi",
        description: "Besi beton tulangan ulir 12mm yang memberikan daya rekat maksimal pada coran beton. Sangat cocok digunakan untuk tulangan utama struktur seperti tiang pancang, balok beton, lantai tingkat, dan pondasi ekstra kokoh.",
        specs: [
            { label: "Panjang", value: "6 Meter" },
            { label: "Diameter", value: "12 mm" },
            { label: "Bentuk", value: "Sirip / Ulir" },
            { label: "Standar", value: "SNI (BjTS - Baja Tulangan Sirip)" }
        ]
    },
    {
        id: 3, name: "Cat Tembok Eksterior Dulux Warna 5kg", brand: "Dulux", price: 185000, originalPrice: 210000,
        rating: 4.7, reviewCount: 1874, location: "Jakarta Barat", sold: "900+",
        image: "https://msp.images.akzonobel.com/prd/dh/aiddlx/packshots/80/7f/99/e5/packshot_medium.png",
        category: "Cat", badge: "Sale",
        description: "Cat Dulux Weathershield adalah cat eksterior bermutu tinggi yang dilengkapi teknologi Keep Cool untuk memantulkan panas. Melindungi rumah Anda dari segala cuaca ekstrem, serangan jamur, dan lumut.",
        specs: [
            { label: "Berat", value: "5 kg / Galon" },
            { label: "Penggunaan", value: "Dinding Eksterior" },
            { label: "Daya Sebar", value: "12-13 m² / Kg" },
            { label: "Tampilan", value: "Matt / Tidak Mengkilap" }
        ]
    },
    {
        id: 4, name: "Bata Merah Press", brand: "Bata Merah Lokal", price: 900,
        rating: 4.3, reviewCount: 4928, location: "Bekasi", sold: "5rb+",
        image: "https://www.udsinarsejahtera.com/images/produk_gambar/gambar-4-93.jpeg",
        category: "Bata",
        description: "Bata merah kualitas super dari tanah liat pilihan yang di-press padat. Memiliki ukuran presisi dan tingkat kekerasan maksimal yang sangat baik untuk menjaga kekokohan struktur dinding.",
        specs: [
            { label: "Dimensi", value: "19 x 9 x 4 cm" },
            { label: "Tipe", value: "Press Mesin" },
            { label: "Pembakaran", value: "Sempurna (Warna Merah Merata)" }
        ]
    },
    {
        id: 5, name: "Triplek 12mm", brand: "Kayu Jati Indah", price: 105000, originalPrice: 125000,
        rating: 4.6, reviewCount: 3899, location: "Jakarta Utara", sold: "1rb+",
        image: "https://image1ws.indotrading.com/s3/productimages/webp/co194168/p769083/w600-h600/0f7bdca4-751c-4329-ba7c-55b0b75053df.jpg",
        category: "Kayu", badge: "Promo",
        description: "Triplek atau Plywood ketebalan 12mm berkualitas ekspor dengan permukaan rata. Ideal untuk bahan cor dinding, lantai sementara, pembuatan furnitur, hingga partisi ruangan indoor maupun semi-outdoor.",
        specs: [
            { label: "Ketebalan", value: "12 mm" },
            { label: "Ukuran", value: "122 x 244 cm (Triplek Standar 4x8)" },
            { label: "Material Dasar", value: "Kayu Meranti Campur" }
        ]
    },
    {
        id: 6, name: "Genteng Keramik", brand: "KIA Keramik", price: 8500,
        rating: 4.1, reviewCount: 4748, location: "Jakarta Selatan", sold: "800+",
        image: "https://image-apac.archify.com/blog/l/zys4t6qw.jpg",
        category: "Genteng"
    },
    {
        id: 7, name: "Pipa PVC 3\"", brand: "Wavin", price: 39000, originalPrice: 46000,
        rating: 4.7, reviewCount: 7384, location: "Tangerang", sold: "3rb+",
        image: "https://storage.googleapis.com/eezee-product-images/pipa-pvc-aw-rucika-jis-3-wr0l_600.png",
        category: "Pipa", badge: "Hot"
    },
    {
        id: 8, name: "Pasir Beton", brand: "Material Tama", price: 250000, originalPrice: 300000,
        rating: 4.4, reviewCount: 4480, location: "Depok", sold: "700+",
        image: "https://readymix.co.id/wp-content/uploads/2020/07/mengenal-jenis-dan-ciri-pasir-yang-bermutu.jpg",
        category: "Pasir", badge: "Sale"
    },
    {
        id: 9, name: "Keramik Lantai 40x40", brand: "Roman Ceramic", price: 45000,
        rating: 4.6, reviewCount: 2067, location: "Bogor", sold: "2rb+",
        image: "https://smb-padiumkm-images-public-prod.oss-ap-southeast-5.aliyuncs.com/product/image/20032024/631a5d63aa3096cbda2614ce/65f30e2ac6360da5e98b621a/f6f8d58320f60814313bdf7fb70a47.jpg?x-oss-process=image/resize,m_pad,w_432,h_432/quality,Q_70",
        category: "Keramik"
    }
];

export default async function PublicProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Find matching product
    const product = allProducts.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="bg-gray-50 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Produk Tidak Ditemukan</h2>
                    <p className="text-gray-500 mb-6">Barang dengan ID '{id}' tidak ada atau sudah dihapus.</p>
                    <Link href="/produk" className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold">
                        Kembali ke Katalog Produk
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    return (
        <div className="bg-gray-50 text-gray-800 antialiased font-sans flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-20">
                {/* Breadcrumb */}
                <nav className="text-sm font-medium text-gray-500 mb-6">
                    <ol className="list-none inline-flex items-center space-x-2">
                        <li><Link href="/" className="hover:text-orange-600 transition-colors">Beranda</Link></li>
                        <li><span className="text-gray-400">/</span></li>
                        <li><Link href="/produk" className="hover:text-orange-600 transition-colors">Katalog Produk</Link></li>
                        <li><span className="text-gray-400">/</span></li>
                        <li><span className="text-gray-900 line-clamp-1">{product.name}</span></li>
                    </ol>
                </nav>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="lg:flex lg:flex-row p-6 md:p-8 gap-10">
                        {/* Column 1: Product Images */}
                        <div className="lg:w-[45%] mb-8 lg:mb-0 shrink-0 relative">
                            <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square border border-gray-100 relative group">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {product.badge && (
                                    <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-md">
                                        {product.badge}
                                    </span>
                                )}
                            </div>
                            {/* Thumbnails placeholder */}
                            <div className="grid grid-cols-4 gap-3 mt-4">
                                <div className="aspect-square bg-gray-100 rounded-lg border-2 border-orange-500 overflow-hidden">
                                    <img src={product.image} alt="Thumb 1" className="w-full h-full object-cover" />
                                </div>
                                <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                                    <img src={product.image} alt="Thumb 2" className="w-full h-full object-cover grayscale" />
                                </div>
                                <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Product Info & Actions */}
                        <div className="lg:w-[55%] flex flex-col pt-1">
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wider">{product.category}</span>
                                </div>

                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>

                                <div className="flex items-center gap-3 text-sm mb-6 pb-6 border-b border-gray-100">
                                    <div className="flex items-center text-yellow-400">
                                        <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        <span className="font-bold text-gray-700 mr-1">{product.rating}</span>
                                        <span className="text-gray-400">({product.reviewCount} ulasan)</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                    <div className="text-gray-500 font-medium">Terjual <span className="text-gray-800">{product.sold}</span></div>
                                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                    <div className="flex items-center text-gray-500">
                                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        Dikirim dari <span className="font-medium text-gray-800 ml-1">{product.location}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-end gap-3 mb-1">
                                        <span className="text-4xl font-extrabold text-orange-600 tracking-tight">{formatPrice(product.price)}</span>
                                        {discountPercentage && (
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-sm font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">-{discountPercentage}%</span>
                                            </div>
                                        )}
                                    </div>
                                    {product.originalPrice && (
                                        <p className="text-sm font-medium text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                                    )}
                                </div>

                                <div className="space-y-4 text-sm mb-8 bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">
                                    <p className="flex text-gray-600"><span className="w-24 font-medium text-gray-500">Merek:</span><span className="font-bold text-gray-900">{product.brand}</span></p>
                                    <p className="flex text-gray-600"><span className="w-24 font-medium text-gray-500">Kondisi:</span>Baru</p>
                                    <p className="flex text-gray-600"><span className="w-24 font-medium text-gray-500">Minimum:</span>1 Pembelian</p>
                                </div>

                            </div>

                            {/* Sticky Buy Actions (Bottom Desktop / Fixed Bottom Mobile via CSS) */}
                            <div className="mt-auto border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center gap-3">
                                {/* Quantity Selector */}
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white w-full sm:w-auto shrink-0 h-12">
                                    <button className="px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-orange-600 transition-colors focus:outline-none">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                    </button>
                                    <input type="number" value="1" readOnly className="w-12 text-center text-sm font-bold text-gray-800 border-x border-gray-100 focus:outline-none py-3" />
                                    <button className="px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-orange-600 transition-colors focus:outline-none">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    </button>
                                </div>

                                <button className="w-full sm:flex-1 h-12 flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-bold rounded-lg transition-colors px-6">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    Keranjang
                                </button>

                                <button className="w-full sm:flex-1 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-[0_4px_14px_0_rgba(234,88,12,0.39)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.23)] hover:-translate-y-0.5 transition-all px-6">
                                    Beli Sekarang
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs / Description Area */}
                    <div className="border-t border-gray-100 p-8 pt-0">
                        {/* Tab Headers */}
                        <div className="flex border-b border-gray-100 w-full mb-6 pt-6">
                            <button className="px-6 py-3 border-b-2 border-orange-600 text-orange-600 font-bold text-sm tracking-wide">
                                Detail Produk
                            </button>
                            <button className="px-6 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-bold text-sm tracking-wide transition-colors">
                                Spesifikasi
                            </button>
                            <button className="px-6 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-bold text-sm tracking-wide transition-colors">
                                Ulasan ({product.reviewCount})
                            </button>
                        </div>

                        {/* Description Content */}
                        <div className="max-w-3xl">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Deskripsi Produk</h3>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                {product.description || "Deskripsi produk belum tersedia saat ini. Silakan hubungi toko untuk pertanyaan teknis terkait penggunaan produk ini."}
                            </p>

                            {product.specs && (
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-sm max-w-lg mb-4">
                                    {product.specs.map((spec, i) => (
                                        <div key={i} className={`flex p-4 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                                            <span className="w-1/3 font-semibold text-gray-500">{spec.label}</span>
                                            <span className="w-2/3 font-medium text-gray-900">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
