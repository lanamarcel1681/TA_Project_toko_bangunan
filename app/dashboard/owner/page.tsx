"use client";

import { useState, useEffect } from 'react';
import { ShoppingCart, Activity, Package, Users, TrendingUp, ArrowUpRight, Bell, Calendar, ChevronRight, RefreshCw } from 'lucide-react';

export default function OwnerDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Pemilik');

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/dashboard/stats');
            const result = await res.json();
            setData(result.owner);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(session => {
                if (session && session.name) {
                    setUserName(session.name);
                }
            })
            .catch(e => console.error(e));
        fetchStats();
    }, []);

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // Icons mapping
    const icons = [TrendingUp, ShoppingCart, Package, Users];
    const colors = ['text-orange-600', 'text-orange-600', 'text-emerald-600', 'text-violet-600'];
    const bgs = ['bg-orange-50', 'bg-orange-50', 'bg-emerald-50', 'bg-violet-50'];
    const borders = ['border-orange-100', 'border-orange-100', 'border-emerald-100', 'border-violet-100'];

    if (loading && !data) {
        return (
            <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto flex items-center justify-center min-h-[60vh]">
                <RefreshCw className="w-10 h-10 text-orange-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20 text-left animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                        <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-orange-600/20">Executive Overview</span>
                        <div className="hidden sm:flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <Calendar className="w-3 h-3" /> {dateStr}
                        </div>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight leading-none">Selamat Datang, {userName}</h1>
                    <p className="text-gray-500 font-medium mt-3">Ringkasan performa operasional dan metrik utama toko bangunan Anda hari ini.</p>
                </div>
                <button 
                    onClick={fetchStats}
                    className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-600 hover:border-orange-100 transition-all shadow-sm active:scale-95"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
                {data?.stats.map((stat: any, index: number) => {
                    const Icon = icons[index];
                    return (
                        <div key={stat.label} className="bg-white rounded-[24px] md:rounded-[40px] p-5 md:p-8 border border-gray-100 shadow-xl relative overflow-hidden group hover:border-orange-200 transition-all duration-500">
                            <div className={`absolute -top-10 -right-10 w-32 h-32 ${bgs[index]} rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700`}></div>

                            <div className="flex items-center justify-between mb-4 md:mb-8 relative z-10">
                                <div className={`w-14 h-14 ${bgs[index]} ${colors[index]} rounded-2xl flex items-center justify-center border ${borders[index]} shadow-sm group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
                            </div>

                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 leading-none">{stat.label}</p>
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">{stat.value}</h3>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${bgs[index]} ${colors[index]} border ${borders[index]}`}>
                                        {Number(stat.trend) > 0 ? `+${stat.trend}%` : `${stat.trend}%`}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.sub}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Activities Section */}
            <div className="bg-white border border-gray-100 rounded-[24px] md:rounded-[40px] p-5 md:p-12 shadow-xl shadow-gray-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/30 -mr-32 -mt-32 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>

                <div className="flex items-center justify-between mb-6 md:mb-10 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm text-gray-500">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight">Timeline Aktivitas</h4>
                            <p className="text-gray-400 font-medium text-sm">Update operasional toko secara real-time</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                    {data?.activities.map((act: any, i: number) => (
                        <div key={i} className={`bg-gray-50/50 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-100/50 hover:bg-white hover:border-orange-100 hover:shadow-md transition-all flex items-center justify-between group/item cursor-default ${act.alert ? 'border-orange-200 bg-orange-50/30' : ''}`}>
                            <div className="flex items-center gap-3 md:gap-6 min-w-0">
                                <div className={`w-3 h-3 rounded-full ${act.alert ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] animate-pulse' : 'bg-gray-200 group-hover/item:bg-orange-300'}`}></div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${act.alert ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500 group-hover/item:bg-orange-100 group-hover/item:text-orange-600'}`}>
                                            {act.category}
                                        </span>
                                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{act.time}</p>
                                    </div>
                                    <p className="text-sm font-black text-gray-800 tracking-tight leading-none mt-1.5">{act.text}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover/item:text-orange-500 group-hover/item:translate-x-1 transition-all" />
                        </div>
                    ))}
                    {!data?.activities.length && <p className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest text-xs">Belum ada aktivitas hari ini</p>}
                </div>
            </div>
        </div>
    );
}
