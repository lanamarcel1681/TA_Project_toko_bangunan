import Link from 'next/link';

export default function Categories() {
    return (
        <div id="kategori" className="bg-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Kategori Populer</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Link href="#" className="group relative block overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1">
                        <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Cat Tembok" className="object-cover w-full h-48 transform group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                            <h3 className="text-xl font-bold text-white">Cat & Pelapis</h3>
                        </div>
                    </Link>
                    <Link href="#" className="group relative block overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1">
                        <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Tools" className="object-cover w-full h-48 transform group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                            <h3 className="text-xl font-bold text-white">Perkakas</h3>
                        </div>
                    </Link>
                    <Link href="#" className="group relative block overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1">
                        <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Semen" className="object-cover w-full h-48 transform group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                            <h3 className="text-xl font-bold text-white">Semen & Pasir</h3>
                        </div>
                    </Link>
                    <Link href="#" className="group relative block overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1">
                        <img src="https://plus.unsplash.com/premium_photo-1678837265261-758c0df61445?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Kayu" className="object-cover w-full h-48 transform group-hover:scale-110 transition-transform duration-500" />
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
