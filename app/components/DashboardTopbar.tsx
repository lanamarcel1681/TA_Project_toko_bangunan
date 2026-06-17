"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface DashboardTopbarProps {
    userName: string;
    role?: "owner" | "employee";
    isSidebarExpanded: boolean;
    toggleSidebar: () => void;
}

export default function DashboardTopbar({ userName, role = "employee", isSidebarExpanded, toggleSidebar }: DashboardTopbarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getPageTitle = () => {
        if (pathname === '/dashboard/owner' || pathname === '/dashboard/karyawan') return 'Overview';

        // --- Rute Owner ---
        if (pathname.startsWith('/dashboard/owner')) {
            if (pathname.includes('/laporan')) return 'Laporan & Statistik';
            if (pathname.includes('/transaksi')) return 'Penjualan & Pembelian';
            if (pathname.includes('/pembelian')) return 'Beli ke Supplier';
            if (pathname.includes('/barang/persetujuan')) return 'Persetujuan Barang';
            if (pathname.includes('/barang')) return 'Manajemen Barang';
            if (pathname.includes('/stok')) return 'Manajemen Stok dan Opname';
            if (pathname.includes('/karyawan')) return 'Daftar Karyawan';
        }

        // --- Rute Karyawan ---
        if (pathname.startsWith('/dashboard/karyawan')) {
            if (pathname.includes('/transaksi/penjualan')) return 'Transaksi Penjualan';
            if (pathname.includes('/transaksi/verifikasi')) return 'Verifikasi Bayar';
            if (pathname.includes('/transaksi/retur')) return 'Retur/Refund';
            if (pathname.includes('/pembelian-supplier')) return 'Beli ke Supplier';
            if (pathname.includes('/pengantaran')) return 'Pengantaran';
            if (pathname.includes('/supplier')) return 'Data Supplier';
            if (pathname.includes('/kategori')) return 'Kategori Barang';
            if (pathname.includes('/barang/usulan')) return 'Usulan Barang';
            if (pathname.includes('/barang')) return 'Data Barang';
            if (pathname.includes('/stok')) return 'Stock Opname';
            if (pathname.includes('/presensi')) return 'Presensi';
        }

        if (pathname.includes('/profil')) return 'Profil Saya';

        return 'Dashboard';
    };

    const dateStr = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <header className="bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 sticky top-0 z-30 shrink-0 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-1 md:-ml-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50 flex-shrink-0"
                    aria-label="Toggle Sidebar"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Mobile Logo visibility when sidebar is hidden/collapsed on small screens */}
                <div className="md:hidden flex items-center min-w-0">
                    <Link href="/" className="text-orange-600 font-bold text-base tracking-wide truncate">
                        Bangunan<span className="text-gray-800">Jaya</span>
                    </Link>
                </div>

                {/* Page Title - desktop */}
                <div className="hidden md:flex flex-col ml-2 border-l border-gray-200 pl-4">
                    <h1 className="text-xl font-bold text-[#002f5e]">{getPageTitle()}</h1>
                    <p className="text-[13px] text-gray-500 mt-0.5 capitalize">{dateStr}</p>
                </div>
            </div>

            {/* Mobile Page Title (compact) */}
            <div className="md:hidden flex-1 text-center px-2 min-w-0">
                <h1 className="text-sm font-bold text-gray-800 truncate">{getPageTitle()}</h1>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1 md:mx-2"></div>
                <div className="relative" ref={dropdownRef}>
                    <div
                        className="flex items-center gap-2 md:gap-3 cursor-pointer select-none group bg-gray-50/80 hover:bg-gray-100 px-2 md:px-3 py-1.5 md:py-2 rounded-xl transition-colors"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-orange-700 transition shrink-0 text-sm md:text-base">
                            {userName ? userName.charAt(0).toUpperCase() : 'P'}
                        </div>
                        <div className="hidden sm:flex flex-col pr-1">
                            <span className="text-sm font-bold text-[#002f5e] group-hover:text-orange-600 transition-colors leading-tight">{userName}</span>
                            <span className="text-xs text-gray-500 capitalize leading-tight mt-0.5">{role === 'owner' ? 'Pemilik Toko' : 'Karyawan'}</span>
                        </div>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>

                    {/* Profile Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transform origin-top-right transition-all">
                            {/* Dropdown Header */}
                            <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                                <p className="text-xs text-gray-500 capitalize mt-0.5">{role === 'owner' ? 'Pemilik Toko' : 'Karyawan'}</p>
                            </div>

                            <Link
                                href={role === 'owner' ? '/dashboard/owner/profil' : '/dashboard/karyawan/profil'}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors w-full"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                Profil Saya
                            </Link>

                            <button
                                onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; }}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Keluar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
