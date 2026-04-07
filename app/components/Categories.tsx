import Link from 'next/link';

export default function Categories() {
    return (
        <div id="kategori" className="bg-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Kategori Populer</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Link href="/produk?category=Cat" className="group relative block overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1">
                        <img src="https://banamitra.com/wp-content/uploads/2020/04/cat-tembok-terbaik-768x511.jpg.webp" alt="Cat Tembok" className="object-cover w-full h-48 transform group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                            <h3 className="text-xl font-bold text-white">Cat & Pelapis</h3>
                        </div>
                    </Link>
                    <Link href="/produk?category=Perkakas" className="group relative block overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1">
                        <img src="https://hioshitools.co.id/wp-content/uploads/2022/10/istockphoto-1131773027-612x612-1.jpg" alt="Tools" className="object-cover w-full h-48 transform group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                            <h3 className="text-xl font-bold text-white">Perkakas</h3>
                        </div>
                    </Link>
                    <Link href="/produk?category=Semen" className="group relative block overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1">
                        <img src="https://www.rumpuntekno.com/assets/mitra/11/2025/07/foto-berita-5-merek-semen-terbaik-di-indonesia-2025-kualitas-tangguh-harga--150725122117.webp" alt="Semen" className="object-cover w-full h-48 transform group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                            <h3 className="text-xl font-bold text-white">Semen & Pasir</h3>
                        </div>
                    </Link>
                    <Link href="/produk?category=Kayu" className="group relative block overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1">
                        <img src="https://images.unsplash.com/photo-1629976828074-c248d94c82ea?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Kayu" className="object-cover w-full h-48 transform group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                            <h3 className="text-xl font-bold text-white">Kayu & Triplek</h3>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
