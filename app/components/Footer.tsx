import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-800">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 xl:col-span-1">
                        <Link href="/" className="flex items-center">
                            <svg className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="ml-2 text-xl font-bold text-gray-100">TB. Lumbung <span className="text-orange-500">Jaya</span></span>
                        </Link>
                        <p className="text-gray-400 text-base">
                            Menyediakan material bangunan berkualitas tinggi untuk mewujudkan hunian impian Anda. Berdiri sejak 2020.
                        </p>
                        <div className="flex space-x-6">
                            <Link href="#" className="text-gray-400 hover:text-gray-300">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-gray-300">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.484 2h.231zm-5.838 3.696c-1.32 0-2.392 1.072-2.392 2.392v10.645c0 1.32 1.072 2.392 2.392 2.392h10.645c1.32 0 2.392-1.072 2.392-2.392V8.088c0-1.32-1.072-2.392-2.392-2.392H6.477zm8.47 1.942a1.296 1.296 0 110 2.592 1.296 1.296 0 010-2.592zm-2.585 1.571a3.565 3.565 0 110 7.13 3.565 3.565 0 010-7.13zm0 1.62a1.945 1.945 0 100 3.89 1.945 1.945 0 000-3.89z" clipRule="evenodd" /></svg>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Belanja</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><Link href="#" className="text-base text-gray-300 hover:text-white">Semua Produk</Link></li>
                                    <li><Link href="#" className="text-base text-gray-300 hover:text-white">Promo Minggu Ini</Link></li>
                                    <li><Link href="#" className="text-base text-gray-300 hover:text-white">Kategori Populer</Link></li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Bantuan</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><Link href="/hubungi-kami#faq" className="text-base text-gray-300 hover:text-white">FAQ (Tanya Jawab)</Link></li>
                                    <li><Link href="#" className="text-base text-gray-300 hover:text-white">Cara Pemesanan</Link></li>
                                    <li><Link href="#" className="text-base text-gray-300 hover:text-white">Konfirmasi Pembayaran</Link></li>
                                    <li><Link href="#" className="text-base text-gray-300 hover:text-white">Pengiriman</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Perusahaan</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><Link href="#" className="text-base text-gray-300 hover:text-white">Tentang Kami</Link></li>
                                    <li><Link href="#" className="text-base text-gray-300 hover:text-white">Karir</Link></li>
                                    <li><Link href="#" className="text-base text-gray-300 hover:text-white">Hubungi Kami</Link></li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><Link href="#" className="text-base text-gray-300 hover:text-white">Kebijakan Privasi</Link></li>
                                    <li><Link href="#" className="text-base text-gray-300 hover:text-white">Syarat & Ketentuan</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-700 pt-8">
                    <p className="text-base text-gray-400 xl:text-center">&copy; {new Date().getFullYear()} Toko TB. Lumbung Jaya. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
