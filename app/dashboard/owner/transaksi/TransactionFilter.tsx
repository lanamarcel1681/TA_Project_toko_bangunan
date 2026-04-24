'use client';

import { Search, Filter, Calendar } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function TransactionFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [startDate, setStartDate] = useState(searchParams.get('start') || '');
    const [endDate, setEndDate] = useState(searchParams.get('end') || '');
    const [status, setStatus] = useState(searchParams.get('status') || 'Semua Status');

    const handleFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (search) params.set('q', search);
        else params.delete('q');
        
        if (startDate) params.set('start', startDate);
        else params.delete('start');
        
        if (endDate) params.set('end', endDate);
        else params.delete('end');
        
        if (status !== 'Semua Status') params.set('status', status);
        else params.delete('status');

        router.push(`${pathname}?${params.toString()}`);
    };

    // Auto filter when search or dates change (debounced for search)
    useEffect(() => {
        const timer = setTimeout(() => {
            handleFilter();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, startDate, endDate, status]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 mb-10 items-center justify-between">
            <div className="relative w-full lg:max-w-md group/search">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/search:text-orange-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Cari ID Invoice, Pelanggan, atau Produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 rounded-full border border-gray-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 outline-none text-sm font-medium transition-all shadow-lg shadow-gray-200/40 bg-white"
                />
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-gray-100 shadow-md">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest text-gray-700 focus:ring-0 outline-none cursor-pointer"
                    >
                        <option>Semua Status</option>
                        <option value="Selesai">Lunas Terverifikasi</option>
                        <option value="Pending">Pending Otorisasi</option>
                        <option value="Retur Selesai">Retur</option>
                        <option value="Dibatalkan (Refund Selesai)">Refund</option>
                    </select>
                </div>

                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-gray-100 shadow-md">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center gap-2">
                        <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-transparent border-none text-[11px] font-black text-gray-700 focus:ring-0 outline-none" 
                        />
                        <span className="text-gray-300">/</span>
                        <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-transparent border-none text-[11px] font-black text-gray-700 focus:ring-0 outline-none" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
