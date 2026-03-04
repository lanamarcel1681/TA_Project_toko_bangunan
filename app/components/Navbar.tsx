"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="ml-2 text-xl font-bold text-gray-900">
                                Bangunan<span className="text-orange-600">Jaya</span>
                            </span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link href="/" className={`${pathname === '/' ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                                Beranda
                            </Link>
                            <Link href="/produk" className={`${pathname === '/produk' ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                                Produk
                            </Link>
                            <Link href="/tentang-kami" className={`${pathname === '/tentang-kami' ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                                Tentang Kami
                            </Link>
                            <Link href="/hubungi-kami" className={`${pathname === '/hubungi-kami' ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:flex ml-4 items-center">
                        <Link href="#" className="p-2 text-gray-400 hover:text-gray-500 relative">
                            <span className="sr-only">Keranjang</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">3</span>
                        </Link>
                        <div className="ml-4 flex items-center space-x-2">
                            <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium text-orange-600 border border-orange-600 hover:bg-orange-50">
                                Masuk
                            </Link>
                            <Link href="/register" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700">
                                Daftar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
