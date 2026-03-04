import Link from 'next/link';

interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    location: string;
    sold: string;
    image: string;
    category: string;
    isNew?: boolean;
    badge?: string;
}

export default function ProductCard({ product }: { product: Product }) {
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow duration-200 flex flex-col">
            {/* Image */}
            <Link href={`/produk/${product.id}`} className="relative overflow-hidden h-44 block">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase z-10">
                        {product.badge}
                    </span>
                )}
                {discount && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                        -{discount}%
                    </span>
                )}
            </Link>

            {/* Content */}
            <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 leading-snug">
                    <Link href={`/produk/${product.id}`} className="hover:text-orange-600 transition-colors">
                        {product.name}
                    </Link>
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="mb-1">
                    <span className="text-base font-bold text-orange-600">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                        <span className="ml-2 text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                </div>

                {/* Brand & Sold */}
                <p className="text-[11px] text-gray-500 mb-0.5">{product.brand}</p>
                <p className="text-[11px] text-gray-400 mb-3">Terjual {product.sold}</p>

                {/* Add to Cart Button */}
                <button className="mt-auto w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Keranjang
                </button>
            </div>
        </div>
    );
}

export type { Product };
