"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SidebarFilter from '../components/SidebarFilter';
import ProductCard, { Product } from '../components/ProductCard';

const allProducts: Product[] = [
    {
        id: 1, name: "Semen Portland Tiga Roda 40kg", brand: "Tiga Roda", price: 65000, originalPrice: 75000,
        rating: 4.8, reviewCount: 4360, location: "Jakarta Timur", sold: "1rb+",
        image: "https://www.tokotigaroda.com/images-data/product/4/pcc-bag-50kg.jpg",
        category: "Semen", badge: "Hot"
    },
    {
        id: 2, name: "Besi Beton Ulir 12mm (6m)", brand: "Krakatau Steel", price: 132500,
        rating: 4.5, reviewCount: 4923, location: "Jakarta Pusat", sold: "2rb+",
        image: "https://jualbesi.com/wp-content/uploads/2021/04/besi-beton-ulir-U_.jpg",
        category: "Besi"
    },
    {
        id: 3, name: "Cat Tembok Eksterior Dulux Warna 5kg", brand: "Dulux", price: 185000, originalPrice: 210000,
        rating: 4.7, reviewCount: 1874, location: "Jakarta Barat", sold: "900+",
        image: "https://msp.images.akzonobel.com/prd/dh/aiddlx/packshots/80/7f/99/e5/packshot_medium.png",
        category: "Cat", badge: "Sale"
    },
    {
        id: 4, name: "Bata Merah Press", brand: "Bata Merah Lokal", price: 900,
        rating: 4.3, reviewCount: 4928, location: "Bekasi", sold: "5rb+",
        image: "https://www.udsinarsejahtera.com/images/produk_gambar/gambar-4-93.jpeg",
        category: "Bata"
    },
    {
        id: 5, name: "Triplek 12mm", brand: "Kayu Jati Indah", price: 105000, originalPrice: 125000,
        rating: 4.6, reviewCount: 3899, location: "Jakarta Utara", sold: "1rb+",
        image: "https://image1ws.indotrading.com/s3/productimages/webp/co194168/p769083/w600-h600/0f7bdca4-751c-4329-ba7c-55b0b75053df.jpg",
        category: "Kayu", badge: "Promo"
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

const sortOptions = [
    { value: 'recommended', label: 'Direkomendasikan' },
    { value: 'price-asc', label: 'Harga Terendah' },
    { value: 'price-desc', label: 'Harga Tertinggi' },
    { value: 'rating', label: 'Rating Tertinggi' },
    { value: 'sold', label: 'Terlaris' },
];

export default function ProdukPage() {
    const searchParams = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recommended');

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams]);

    const filtered = useMemo(() => {
        let result = [...allProducts];

        if (selectedCategory !== 'Semua') {
            result = result.filter(p => p.category === selectedCategory);
        }
        if (selectedRating !== null) {
            result = result.filter(p => p.rating >= selectedRating);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
        }
        if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
        else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

        return result;
    }, [selectedCategory, selectedRating, searchQuery, sortBy]);

    return (
        <div className="bg-gray-50 text-gray-800 antialiased font-sans flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Sidebar */}
                    <SidebarFilter
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        selectedRating={selectedRating}
                        onRatingChange={setSelectedRating}
                    />

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Search & Sort Bar */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5 flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Cari produk bangunan..."
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 text-sm bg-gray-50 focus:bg-white"
                                />
                            </div>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
                            >
                                {sortOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Result Count */}
                        <p className="text-sm text-gray-500 mb-4">
                            Menampilkan <span className="font-semibold text-gray-800">{filtered.length}</span> produk
                            {selectedCategory !== 'Semua' && <> dalam kategori <span className="font-semibold text-orange-600">{selectedCategory}</span></>}
                        </p>

                        {/* Product Grid */}
                        {filtered.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filtered.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <svg className="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <p className="text-gray-500 text-lg font-medium">Produk tidak ditemukan</p>
                                <p className="text-gray-400 text-sm mt-1">Coba gunakan kata kunci atau filter yang berbeda.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
