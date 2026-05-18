'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, BarChart3, PackageCheck, PackageSearch, Users, ShoppingCart, ShoppingBag, UserCog, SendToBack, Truck, CalendarCheck, Tags, LogOut, FileText
} from 'lucide-react';
import { useToast } from './Toast';

interface SidebarProps {
    userName: string;
    role: 'owner' | 'employee' | 'karyawan';
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}

const ownerNav = [
    { href: '/dashboard/owner', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/owner/laporan', label: 'Laporan & Statistik', icon: BarChart3 },
    { href: '/dashboard/owner/transaksi', label: 'Penjualan & Pembelian', icon: ShoppingCart },
    { href: '/dashboard/owner/pembelian', label: 'Beli ke Supplier', icon: ShoppingBag },
    { href: '/dashboard/owner/barang', label: 'Manajemen Barang', icon: PackageSearch },
    { href: '/dashboard/owner/barang/persetujuan', label: 'Persetujuan Barang', icon: PackageCheck },
    { href: '/dashboard/owner/stok', label: 'Manajemen Stok dan Opname', icon: PackageSearch },
    { href: '/dashboard/owner/karyawan', label: 'Daftar Karyawan', icon: Users },
    { href: '/dashboard/owner/karyawan/presensi', label: 'Presensi & Izin', icon: CalendarCheck }
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

export default function DashboardSidebar({ userName, role, isExpanded, setIsExpanded, isMobileOpen = false, onMobileClose }: SidebarProps) {
    const pathname = usePathname();
    const { showToast } = useToast();
    // Support both 'employee' and 'karyawan' depending on middleware
    const navItems = role === 'owner' ? ownerNav : employeeNav;

    async function handleLogout() {
        showToast('Berhasil logout. Sampai jumpa kembali!', 'success');
        await fetch('/api/auth/logout', { method: 'POST' });
        setTimeout(() => {
            window.location.href = '/login';
        }, 500);
    }

    const sidebarContent = (isMobile: boolean) => (
        <>
            {/* Logo */}
            <div className={`px-6 py-5 border-b border-gray-50 flex items-center ${!isMobile && !isExpanded ? 'justify-center px-0' : ''}`}>
                <Link href="/" className="text-orange-600 font-bold text-xl tracking-wide flex items-center justify-center gap-2" onClick={isMobile ? onMobileClose : undefined}>
                    <img src="/Logo.png" alt="Logo" className="w-8 h-8" />
                    {(isMobile || isExpanded) && (
                        <>Bangunan<span className="text-gray-800">Jaya</span></>
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
                            onClick={isMobile ? onMobileClose : undefined}
                            title={!isMobile && !isExpanded ? item.label : undefined}
                            className={`flex items-center ${!isMobile && !isExpanded ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group ${isActive
                                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                                : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                }`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'opacity-90' : 'text-gray-400 group-hover:text-orange-600'}`} />
                            {(isMobile || isExpanded) && <span className="text-sm font-medium whitespace-nowrap overflow-hidden">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-gray-50">
                <button
                    onClick={handleLogout}
                    title={!isMobile && !isExpanded ? "Keluar" : undefined}
                    className={`flex items-center ${!isMobile && !isExpanded ? 'justify-center px-0' : 'gap-3 px-3 text-left'} py-2.5 text-red-600 hover:bg-red-50 rounded-lg group transition-colors w-full`}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0 text-red-500" />
                    {(isMobile || isExpanded) && <span className="text-sm font-medium">Keluar</span>}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`${isExpanded ? 'w-64' : 'w-20'} transition-all duration-300 bg-white border-r border-gray-100 flex-col hidden md:flex h-screen sticky top-0 shrink-0 shadow-sm z-20`}>
                {sidebarContent(false)}
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-[70] md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onMobileClose}
                    />
                    {/* Sidebar Drawer */}
                    <aside className="absolute top-0 left-0 w-72 h-full bg-white shadow-2xl flex flex-col animate-fadeIn overflow-hidden">
                        {sidebarContent(true)}
                    </aside>
                </div>
            )}
        </>
    );
}
