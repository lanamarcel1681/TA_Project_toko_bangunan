import Link from 'next/link';

export default function FeaturedProducts() {
    const products = [
        {
            id: 1,
            name: "Bor Listrik Impact Drill",
            brand: "Bosch",
            price: "Rp 450.000",
            image: "https://jendela360.com/info/wp-content/uploads/2023/05/makita-df-331.jpg"
        },
        {
            id: 2,
            name: "Cat Tembok Interior (25kg)",
            brand: "Dulux",
            price: "Rp 850.000",
            image: "https://atlanticoceanpaint.com/wp-content/uploads/2019/03/Naturetone-Topcoat.jpg"
        },
        {
            id: 3,
            name: "Semen PCC (40kg)",
            brand: "Tiga Roda",
            price: "Rp 65.000",
            image: "https://www.tokotigaroda.com/images-data/product/4/pcc-bag-50kg.jpg"
        },
        {
            id: 4,
            name: "Palu Baja",
            brand: "Tekiro",
            price: "Rp 85.000",
            image: "https://superbangunan.co.id/wp-content/uploads/2025/06/CMART-CG0005-12-PALU-KAMBING-12-OZ.webp"
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
