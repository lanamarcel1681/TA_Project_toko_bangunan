import Link from 'next/link';

export default function FeaturedProducts() {
    const products = [
        {
            id: 1,
            name: "Bor Listrik Impact Drill",
            brand: "Bosch",
            price: "Rp 450.000",
            image: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 2,
            name: "Cat Tembok Interior (25kg)",
            brand: "Dulux",
            price: "Rp 850.000",
            image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 3,
            name: "Semen PCC (40kg)",
            brand: "Tiga Roda",
            price: "Rp 65.000",
            image: "https://plus.unsplash.com/premium_photo-1664302152990-23919da60641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 4,
            name: "Palu Kambing Baja",
            brand: "Tekiro",
            price: "Rp 85.000",
            image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
    ];

    return (
        <div id="produk" className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Produk Unggulan</h2>
                    <Link href="#" className="text-orange-600 hover:text-orange-700 font-medium">Lihat Semua &rarr;</Link>
                </div>

                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                    {products.map(product => (
                        <div key={product.id} className="group relative">
                            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                                <img src={product.image} alt={product.name} className="w-full h-full object-center object-cover lg:w-full lg:h-full" />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700">
                                        <Link href="#">
                                            <span aria-hidden="true" className="absolute inset-0"></span>
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{product.price}</p>
                            </div>
                            <button className="mt-4 w-full bg-orange-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                Tambah ke Keranjang
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
