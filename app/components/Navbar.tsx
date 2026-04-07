"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const [user, setUser] = useState<{ email: string; role: string } | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Read session from cookie
        const sessionCookie = document.cookie.split('; ').find(row => row.startsWith('session='));
        if (sessionCookie) {
            try {
                const sessionValue = decodeURIComponent(sessionCookie.split('=')[1]);
                const parsedUser = JSON.parse(sessionValue);
                setUser(parsedUser);
            } catch (e) {
                console.error("Failed to parse session", e);
            }
        }

        // Handle outside click for dropdown
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.reload();
    };

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
                        <Link href="/keranjang" className="p-2 text-gray-400 hover:text-gray-500 relative">
                            <span className="sr-only">Keranjang</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">3</span>
                        </Link>
                        <div className="ml-4 flex items-center space-x-2">
                            {user ? (
                                <div className="relative ml-3" ref={dropdownRef}>
                                    <button 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                                            {user.email.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate capitalize">{user.email.split('@')[0]}</span>
                                        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transform origin-top-right transition-all">
                                            <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                                <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                                                <p className="text-xs text-gray-500 capitalize mt-0.5">Role: {user.role}</p>
                                            </div>

                                            {user.role === 'owner' || user.role === 'karyawan' ? (
                                                <Link href={`/dashboard/${user.role}`} className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors w-full">
                                                    Dashboard {user.role === 'owner' ? 'Owner' : 'Karyawan'}
                                                </Link>
                                            ) : null}
                                            
                                            <Link href={user.role === 'owner' ? '/dashboard/owner/profil' : user.role === 'karyawan' ? '/dashboard/karyawan/profil' : '/profil'} className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors w-full">
                                                Profil Saya
                                            </Link>
                                            
                                            <Link href="/history-transaksi" className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors w-full">
                                                History Transaksi
                                            </Link>
                                            
                                            <div className="border-t border-gray-100 my-2"></div>
                                            
                                            <button 
                                                onClick={handleLogout}
                                                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                Keluar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link href="/login" className="px-5 py-2 rounded-xl text-sm font-bold text-orange-600 border-2 border-orange-600 hover:bg-orange-50 transition-colors">
                                        Masuk
                                    </Link>
                                    <Link href="/register" className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-md shadow-orange-500/20">
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}