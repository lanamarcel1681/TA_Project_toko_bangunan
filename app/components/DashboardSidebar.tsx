"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
    userName: string;
    role: 'owner' | 'employee';
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
}

const ownerNav = [
    {
        href: '/dashboard/owner',
        label: 'Overview',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
    },
    {
        href: '/dashboard/owner/transaksi',
        label: 'Penjualan & Pembelian',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    },
    {
        href: '/dashboard/owner/barang',
        label: 'Pencatatan Barang',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
    },
    {
        href: '/dashboard/owner/karyawan',
        label: 'Daftar Karyawan',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    },
];

const employeeNav = [
    {
        href: '/dashboard/karyawan',
        label: 'Overview',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
    },
    {
        href: '/dashboard/karyawan/barang',
        label: 'Pencatatan Barang',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
    },
];

export default function DashboardSidebar({ userName, role, isExpanded, setIsExpanded }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const navItems = role === 'owner' ? ownerNav : employeeNav;

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
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
            <nav className="flex-1 pt-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
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
                            <svg className={`w-5 h-5 flex-shrink-0 ${isActive ? 'opacity-90' : 'text-gray-400 group-hover:text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {item.icon}
                            </svg>
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
                    <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {isExpanded && <span className="text-sm font-medium">Keluar</span>}
                </button>
            </div>
        </aside>
    );
}
