import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { notFound } from "next/navigation";
import ProductPurchaseActions from "../../components/ProductPurchaseActions";
import ImageLightbox from "../../../components/ImageLightbox";

const prisma = new PrismaClient();

export default async function PublicProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch matching product from database with reviews and transaction details
    const product = await prisma.barang.findUnique({
        where: { id_barang: parseInt(id) },
        include: {
            kategori: true,
            satuan: true,
            ulasan: {
                include: {
                    pembeli: {
                        select: {
                            nama_pembeli: true,
                            foto_profil: true
                        }
                    }
                },
                orderBy: {
                    tanggal_ulasan: 'desc'
                }
            },
            detail_jual: {
                select: {
                    jumlah_penjualan_barang: true
                }
            }
        }
    });

    if (!product) {
        return notFound();
    }

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    // Calculate real values
    const reviewCount = product.ulasan.length;
    const totalRating = product.ulasan.reduce((acc, curr) => acc + curr.rating, 0);
    const rating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : "0";

    const sold = product.detail_jual.reduce((acc, curr) => acc + curr.jumlah_penjualan_barang, 0);
    const location = "TB. Lumbung Jaya";

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
                        <li><span className="text-gray-900 line-clamp-1">{product.nama_barang}</span></li>
                    </ol>
                </nav>

                {/* Card 1: Main Product Info - Restored to original layout */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 text-poppins">
                    <div className="lg:flex lg:flex-row p-6 md:p-8 gap-10">
                        {/* Column 1: Product Images */}
                        <div className="lg:w-[45%] mb-8 lg:mb-0 shrink-0 relative">
                            <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square border border-gray-100 relative group">
                                <ImageLightbox src={product.foto_barang || "https://placehold.co/600x400?text=No+Image"} alt={product.nama_barang}>
                                    <img
                                        src={product.foto_barang || "https://placehold.co/600x400?text=No+Image"}
                                        alt={product.nama_barang}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </ImageLightbox>
                            </div>
                            {/* Thumbnails */}
                            <div className="grid grid-cols-4 gap-3 mt-4">
                                <div className="aspect-square bg-gray-100 rounded-lg border-2 border-orange-500 overflow-hidden">
                                    <ImageLightbox src={product.foto_barang || "https://placehold.co/600x400?text=No+Image"} alt="Thumb 1">
                                        <img src={product.foto_barang || "https://placehold.co/600x400?text=No+Image"} alt="Thumb 1" className="w-full h-full object-cover" />
                                    </ImageLightbox>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Product Info & Actions */}
                        <div className="lg:w-[55%] flex flex-col pt-1">
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wider">
                                        {product.kategori?.nama_kategori || "Material"}
                                    </span>
                                </div>

                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.nama_barang}</h1>

                                <div className="flex items-center gap-3 text-sm mb-6 pb-6 border-b border-gray-100">
                                    <div className="flex items-center text-yellow-400">
                                        <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        <span className="font-bold text-gray-700 mr-1">{rating}</span>
                                        <span className="text-gray-400">({reviewCount} ulasan)</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                    <div className="text-gray-500 font-medium">Terjual <span className="text-gray-800">{sold}</span></div>
                                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                    <div className="flex items-center text-gray-500">
                                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        Dikirim dari <span className="font-medium text-gray-800 ml-1">{location}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-end gap-3 mb-1">
                                        <span className="text-4xl font-extrabold text-orange-600 tracking-tight">{formatPrice(product.harga_barang)}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 text-sm mb-8 bg-orange-50/50 p-4 rounded-xl border border-orange-100/50">
                                    <p className="flex text-gray-600"><span className="w-24 font-medium text-gray-500">Merek:</span><span className="font-bold text-gray-900">{product.merk_barang || "-"}</span></p>
                                    <p className="flex text-gray-600"><span className="w-24 font-medium text-gray-500">Kondisi:</span>Baru</p>
                                    <p className="flex text-gray-600"><span className="w-24 font-medium text-gray-500">Stok:</span>{product.stok_barang} {product.satuan?.satuan_barang || "Unit"}</p>
                                </div>

                            </div>

                            <ProductPurchaseActions
                                productId={product.id_barang}
                                stock={product.stok_barang}
                            />
                        </div>
                    </div>
                </div>

                {/* Card 2: Product Specifications */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5 p-8">
                    <h3 className="text-md font-bold text-gray-900 mb-6 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1 h-4 bg-orange-600 rounded-full"></span>
                        Spesifikasi Produk
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl text-sm">
                        <div className="flex pt-2 pb-2 border-b border-gray-50">
                            <span className="w-32 text-gray-400 font-medium shrink-0">Kategori</span>
                            <span className="text-blue-600 font-bold hover:underline cursor-pointer">{product.kategori?.nama_kategori || "Material Bangunan"}</span>
                        </div>
                        <div className="flex pt-2 pb-2 border-b border-gray-50">
                            <span className="w-32 text-gray-400 font-medium shrink-0">Merek</span>
                            <span className="text-gray-800 font-bold uppercase tracking-tight">{product.merk_barang || "-"}</span>
                        </div>
                        <div className="flex pt-2 pb-2 border-b border-gray-50">
                            <span className="w-32 text-gray-400 font-medium shrink-0">Berat</span>
                            <span className="text-gray-800 font-bold">{product.berat_barang} kg</span>
                        </div>
                        <div className="flex pt-2 pb-2 border-b border-gray-50">
                            <span className="w-32 text-gray-400 font-medium shrink-0">Dimensi</span>
                            <span className="text-gray-800 font-bold uppercase tracking-tight">{product.dimensi_barang || "-"}</span>
                        </div>
                        <div className="flex pt-2 pb-2 border-b border-gray-50">
                            <span className="w-32 text-gray-400 font-medium shrink-0">Stok</span>
                            <span className="text-gray-800 font-bold">{product.stok_barang}</span>
                        </div>
                    </div>
                </div>

                {/* Card 3: Product Description */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5 p-8">
                    <h3 className="text-md font-bold text-gray-900 mb-6 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1 h-4 bg-orange-600 rounded-full"></span>
                        Deskripsi Produk
                    </h3>
                    <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-line max-w-4xl">
                        {product.deskripsi_barang || "Deskripsi produk belum tersedia saat ini. Silakan hubungi toko untuk pertanyaan teknis terkait penggunaan produk ini."}
                    </div>
                </div>

                {/* Card 4: Reviews Section */}
                <div id="ulasan" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8">
                    <h3 className="text-md font-bold text-gray-900 mb-8 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1 h-4 bg-orange-600 rounded-full"></span>
                        Penilaian Produk
                    </h3>

                    {reviewCount === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium text-sm">Belum ada penilaian untuk produk ini.</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {product.ulasan.map((rev) => (
                                <div key={rev.id_ulasan} className="flex flex-col md:flex-row gap-6 pb-10 border-b last:border-0 border-gray-50">
                                    {/* User Profil */}
                                    <div className="w-full md:w-48 shrink-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold overflow-hidden border-2 border-white shadow-sm">
                                                {rev.pembeli.foto_profil ? (
                                                    <img src={rev.pembeli.foto_profil} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span>{rev.pembeli.nama_pembeli.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{rev.pembeli.nama_pembeli}</h4>
                                                <p className="text-[10px] text-gray-400 font-medium">{new Date(rev.tanggal_ulasan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1 mb-3 text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            ))}
                                        </div>

                                        <p className="text-gray-700 text-sm leading-relaxed mb-4 font-medium italic">"{rev.komentar || "Pembeli tidak meninggalkan komentar."}"</p>

                                        {rev.foto_ulasan && (
                                            <div className="mt-4">
                                                <ImageLightbox src={rev.foto_ulasan} alt="Foto Ulasan">
                                                    <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-transform hover:scale-105 cursor-pointer">
                                                        <img src={rev.foto_ulasan} alt="Foto Ulasan" className="w-full h-full object-cover" />
                                                    </div>
                                                </ImageLightbox>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
            <Footer />
        </div>
    );
}
