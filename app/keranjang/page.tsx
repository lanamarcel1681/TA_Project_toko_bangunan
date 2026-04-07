import Link from 'next/link';
import Navbar from '../components/Navbar';

// Dummy data for cart items
const cartItems = [
    {
        id: 1,
        name: 'Semen Padang 50kg',
        price: 65000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        category: 'Material Dasar'
    },
    {
        id: 2,
        name: 'Cat Tembok Putih 5kg',
        price: 150000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1562259929-b7e181d8d007?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        category: 'Cat & Pelapis'
    },
];

export default function KeranjangPage() {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.11; // 11% PPN
    const total = subtotal + tax;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Keranjang Belanja</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Daftar Barang */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-semibold text-gray-900">Pesanan Anda ({cartItems.length} barang)</h2>
                            </div>

                            <ul className="divide-y divide-gray-100 p-6">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="py-6 flex flex-col sm:flex-row gap-6 first:pt-0 last:pb-0">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100 relative">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3 className="line-clamp-2">{item.name}</h3>
                                                    <p className="ml-4 whitespace-nowrap">Rp {item.price.toLocaleString('id-ID')}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                                            </div>

                                            <div className="flex flex-1 items-end justify-between text-sm mt-4">
                                                <div className="flex items-center border border-gray-300 rounded-md">
                                                    <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition">-</button>
                                                    <span className="px-3 py-1 text-gray-900 font-medium border-x border-gray-300">{item.quantity}</span>
                                                    <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition">+</button>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="font-medium text-red-600 hover:text-red-500 transition flex items-center gap-1"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Ringkasan Belanja */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Ringkasan Belanja</h2>

                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <p>Total Harga ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} barang)</p>
                                    <p className="font-medium text-gray-900">Rp {subtotal.toLocaleString('id-ID')}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>PPN (11%)</p>
                                    <p className="font-medium text-gray-900">Rp {tax.toLocaleString('id-ID')}</p>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center bg-orange-50 p-4 rounded-lg border border-orange-100">
                                        <p className="text-base font-bold text-gray-900">Total Belanja</p>
                                        <p className="text-lg font-bold text-orange-600">Rp {total.toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Link
                                    href="/pembayaran"
                                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 transition"
                                >
                                    Lanjut ke Pembayaran
                                </Link>
                                <div className="mt-4 text-center">
                                    <Link href="/produk" className="text-sm font-medium text-orange-600 hover:text-orange-500 transition">
                                        atau Lanjutkan Belanja
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
