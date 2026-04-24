"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SidebarFilter from '../components/SidebarFilter';
import ProductCard, { Product } from '../components/ProductCard';

const sortOptions = [
    { value: 'recommended', label: 'Direkomendasikan' },
    { value: 'price-asc', label: 'Harga Terendah' },
    { value: 'price-desc', label: 'Harga Tertinggi' },
];

function ProdukContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>(['Semua']);
    const [isLoading, setIsLoading] = useState(true);
    
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recommended');
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [prodRes, catRes] = await Promise.all([
                    fetch('/api/barang'),
                    fetch('/api/kategori')
                ]);

                if (prodRes.ok) {
                    const data = await prodRes.json();
                    setProducts(data);
                }

                if (catRes.ok) {
                    const data = await catRes.json();
                    const catNames = data.map((c: any) => c.nama_kategori);
                    setCategories(['Semua', ...catNames]);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams]);

    const filtered = useMemo(() => {
        let result = [...products];

        if (selectedCategory !== 'Semua') {
            result = result.filter(p => p.kategori?.nama_kategori === selectedCategory);
        }

        if (selectedRating !== null) {
            result = result.filter(p => (p.rating || 0) >= selectedRating);
        }
        
        if (showAvailableOnly) {
            result = result.filter(p => p.stok_barang > 0);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.nama_barang.toLowerCase().includes(q) || 
                p.merk_barang?.toLowerCase().includes(q)
            );
        }

        if (sortBy === 'price-asc') result.sort((a, b) => a.harga_barang - b.harga_barang);
        else if (sortBy === 'price-desc') result.sort((a, b) => b.harga_barang - a.harga_barang);

        return result;
    }, [products, selectedCategory, selectedRating, searchQuery, sortBy, showAvailableOnly]);

    return (
        <div className="bg-gray-50 text-gray-800 antialiased font-sans flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Sidebar */}
                    <SidebarFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        selectedRating={selectedRating}
                        onRatingChange={setSelectedRating}
                        showAvailableOnly={showAvailableOnly}
                        onShowAvailableChange={setShowAvailableOnly}
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
                        {isLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-64"></div>
                                ))}
                            </div>
                        ) : filtered.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filtered.map(product => (
                                    <ProductCard 
                                        key={product.id_barang} 
                                        product={product} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <svg className="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <p className="text-gray-500 text-lg font-medium">Produk tidak ditemukan</p>
                                <p className="text-gray-400 text-sm mt-1">Coba gunakan kata kunci atau filter yang berbeda.</p>
                                <button 
                                    onClick={() => { setSelectedCategory('Semua'); setSelectedRating(null); setSearchQuery(''); setShowAvailableOnly(false); }}
                                    className="mt-6 px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function ProdukPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Merekam data...</div>}>
            <ProdukContent />
        </Suspense>
    );
}
