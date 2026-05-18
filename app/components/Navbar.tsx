"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useToast } from './Toast';

export default function Navbar() {
    const pathname = usePathname();
    const [user, setUser] = useState<{ id: number; email: string; role: string; avatar?: string } | null>(null);
    const [cartCount, setCartCount] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();

    const fetchCartCount = async () => {
        try {
            const res = await fetch('/api/keranjang');
            if (res.ok) {
                const data = await res.json();
                setCartCount(data.totalItems || 0);
            }
        } catch (error) {
            console.error("Failed to fetch cart count", error);
        }
    };

    useEffect(() => {
        // Fetch session from API since it's httpOnly now
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(parsedUser => {
                if (parsedUser) {
                    setUser(parsedUser);
                    fetch('/api/user/profile')
                        .then(res => res.json())
                        .then(data => {
                            if (data && data.avatar) {
                                setUser(prev => prev ? { ...prev, avatar: data.avatar } : prev);
                            }
                        })
                        .catch(e => console.error("Failed to fetch profile avatar", e));
                }
            })
            .catch(e => console.error("Failed to fetch session", e));

        // Handle outside click for dropdown
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        // Fetch cart count and listen for updates
        fetchCartCount();
        window.addEventListener('cart-updated', fetchCartCount);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener('cart-updated', fetchCartCount);
        };
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        showToast('Berhasil logout. Sampai jumpa kembali!', 'success');
        await fetch('/api/auth/logout', { method: 'POST' });
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    const navLinks = [
        { href: '/', label: 'Beranda' },
        { href: '/produk', label: 'Produk' },
        { href: '/tentang-kami', label: 'Tentang Kami' },
        { href: '/hubungi-kami', label: 'Hubungi Kami' },
    ];

    return (
        <>
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 flex items-center">
                                <img src="/Logo.png" alt="Logo TB Lumbung Jaya" className="h-12 w-auto" />
                                <span className="ml-2 text-xl font-bold text-gray-900">
                                    TB. Lumbung <span className="text-orange-600">Jaya</span>
                                </span>
                            </Link>
                            {/* Desktop Navigation Links */}
                            <div className="hidden md:ml-6 md:flex md:space-x-8">
                                {navLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`${pathname === link.href ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Right Side: Cart + User */}
                        <div className="hidden md:flex ml-4 items-center">
                            <Link href="/keranjang" className="p-2 text-gray-400 hover:text-gray-500 relative transition-colors group">
                                <span className="sr-only">Keranjang</span>
                                <svg className="h-6 w-6 group-hover:text-orange-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full ring-2 ring-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <div className="ml-4 flex items-center space-x-2">
                                {user ? (
                                    <div className="relative ml-3" ref={dropdownRef}>
                                        <button
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    user.email.charAt(0).toUpperCase()
                                                )}
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

                        {/* Mobile Right Side: Cart + Hamburger */}
                        <div className="flex md:hidden items-center gap-2">
                            <Link href="/keranjang" className="p-2 text-gray-400 hover:text-orange-600 relative transition-colors">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full ring-2 ring-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-gray-50 transition-colors focus:outline-none"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    {/* Drawer */}
                    <div className="absolute top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-2xl flex flex-col animate-fadeIn overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <span className="text-lg font-bold text-gray-900">Menu</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* User Info (if logged in) */}
                        {user && (
                            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden flex-shrink-0">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            user.email.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate capitalize">{user.email.split('@')[0]}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Links */}
                        <div className="flex-1 px-4 py-4 space-y-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${pathname === link.href
                                            ? 'bg-orange-50 text-orange-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Divider */}
                            <div className="border-t border-gray-100 my-3"></div>

                            {user ? (
                                <>
                                    {(user.role === 'owner' || user.role === 'karyawan') && (
                                        <Link
                                            href={`/dashboard/${user.role}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-orange-600 transition-colors"
                                        >
                                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                            Dashboard
                                        </Link>
                                    )}
                                    <Link
                                        href={user.role === 'owner' ? '/dashboard/owner/profil' : user.role === 'karyawan' ? '/dashboard/karyawan/profil' : '/profil'}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-orange-600 transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Profil Saya
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="flex items-center w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Keluar
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-3 px-4 pt-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full text-center px-5 py-3 rounded-xl text-sm font-bold text-orange-600 border-2 border-orange-600 hover:bg-orange-50 transition-colors"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full text-center px-5 py-3 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-md shadow-orange-500/20"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}