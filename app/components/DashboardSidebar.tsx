'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, BarChart3, PackageCheck, PackageSearch, Users, ShoppingCart, ShoppingBag, UserCog, SendToBack, Truck, CalendarCheck, Tags, LogOut, FileText
} from 'lucide-react';

interface SidebarProps {
    userName: string;
    role: 'owner' | 'employee' | 'karyawan';
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
}

const ownerNav = [
    { href: '/dashboard/owner', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/owner/laporan', label: 'Laporan & Statistik', icon: BarChart3 },
    { href: '/dashboard/owner/transaksi', label: 'Penjualan & Pembelian', icon: ShoppingCart },
    { href: '/dashboard/owner/pembelian', label: 'Beli ke Supplier', icon: ShoppingBag },
    { href: '/dashboard/owner/barang', label: 'Manajemen Barang', icon: PackageSearch },
    { href: '/dashboard/owner/barang/persetujuan', label: 'Persetujuan Barang', icon: PackageCheck },
    { href: '/dashboard/owner/stok', label: 'Manajemen Stok dan Opname', icon: PackageSearch },
    { href: '/dashboard/owner/karyawan', label: 'Daftar Karyawan', icon: Users }
];

const employeeNav = [
    { href: '/dashboard/karyawan', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/karyawan/transaksi/penjualan', label: 'Transaksi Penjualan', icon: ShoppingCart },
    { href: '/dashboard/karyawan/transaksi/verifikasi', label: 'Verifikasi Bayar', icon: PackageCheck },
    { href: '/dashboard/karyawan/transaksi/retur', label: 'Retur/Refund', icon: PackageCheck },
    { href: '/dashboard/karyawan/pengantaran', label: 'Pengantaran', icon: Truck },
    { href: '/dashboard/karyawan/pembelian-supplier', label: 'Beli ke Supplier', icon: ShoppingCart },
    { href: '/dashboard/karyawan/supplier', label: 'Data Supplier', icon: Truck },
    { href: '/dashboard/karyawan/barang', label: 'Data Barang', icon: ShoppingBag },
    { href: '/dashboard/karyawan/kategori', label: 'Kategori Barang', icon: Tags },
    { href: '/dashboard/karyawan/barang/usulan', label: 'Usulan Barang', icon: SendToBack },
    { href: '/dashboard/karyawan/stok', label: 'Stock Opname', icon: PackageSearch },
    { href: '/dashboard/karyawan/presensi', label: 'Presensi', icon: CalendarCheck }
];

export default function DashboardSidebar({ userName, role, isExpanded, setIsExpanded }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    // Support both 'employee' and 'karyawan' depending on middleware
    const navItems = role === 'owner' ? ownerNav : employeeNav;

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/login';
    }

    return (
        <aside className={`${isExpanded ? 'w-64' : 'w-20'} transition-all duration-300 bg-white border-r border-gray-100 flex flex-col hidden md:flex h-screen sticky top-0 shrink-0 shadow-sm z-20`}>
            {/* Logo */}
            <div className={`px-6 py-5 border-b border-gray-50 flex items-center ${isExpanded ? '' : 'justify-center px-0'}`}>
                <Link href="/" className="text-orange-600 font-bold text-xl tracking-wide flex items-center justify-center">
                    {isExpanded ? (
                        <>Bangunan<span className="text-gray-800">Jaya</span></>
                    ) : (
                        <span className="text-2xl">B<span className="text-gray-800">J</span></span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isExpanded ? undefined : item.label}
                            className={`flex items-center ${isExpanded ? 'gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-lg transition-colors group ${isActive
                                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                                : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                }`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'opacity-90' : 'text-gray-400 group-hover:text-orange-600'}`} />
                            {isExpanded && <span className="text-sm font-medium whitespace-nowrap overflow-hidden">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-gray-50">
                <button
                    onClick={handleLogout}
                    title={isExpanded ? undefined : "Keluar"}
                    className={`flex items-center ${isExpanded ? 'gap-3 px-3 text-left' : 'justify-center px-0'} py-2.5 text-red-600 hover:bg-red-50 rounded-lg group transition-colors w-full`}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0 text-red-500" />
                    {isExpanded && <span className="text-sm font-medium">Keluar</span>}
                </button>
            </div>
        </aside>
    );
}
