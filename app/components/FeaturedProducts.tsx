import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function FeaturedProducts() {
    // Fetch real products from the database
    const products = await prisma.barang.findMany({
        take: 4,
        orderBy: {
            id_barang: 'desc' // Newest products first as "Featured"
        },
        include: {
            kategori: true
        }
    });

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    return (
        <div id="produk" className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6 text-left">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Produk Unggulan</h2>
                    <Link href="/produk" className="text-orange-600 hover:text-orange-700 font-medium">Lihat Semua &rarr;</Link>
                </div>

                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8 text-left">
                    {products.map(product => (
                        <div key={product.id_barang} className="group relative flex flex-col">
                            <Link href={`/produk/${product.id_barang}`} className="w-full min-h-80 bg-gray-100 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                                <img 
                                    src={product.foto_barang || "https://placehold.co/600x400?text=No+Image"} 
                                    alt={product.nama_barang} 
                                    className="w-full h-full object-center object-cover lg:w-full lg:h-full" 
                                />
                            </Link>
                            <div className="mt-4 flex justify-between flex-grow">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700">
                                        <Link href={`/produk/${product.id_barang}`}>
                                            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[80%]"></span>
                                            {product.nama_barang}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-500">{product.merk_barang || product.kategori?.nama_kategori || 'Material'}</p>
                                </div>
                                <p className="text-sm font-bold text-orange-600 ml-2">{formatPrice(product.harga_barang)}</p>
                            </div>
                            <button className="mt-4 w-full bg-orange-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-sm transition-colors">
                                Tambah ke Keranjang
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
