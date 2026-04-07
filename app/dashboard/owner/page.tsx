import { cookies } from 'next/headers';
import { ShoppingCart, Activity, Package, Users, TrendingUp, ArrowUpRight, Bell, Calendar, ChevronRight } from 'lucide-react';

const stats = [
    { label: 'Total Penjualan', value: 'Rp 328.5 Jt', sub: 'Bulan ini', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    { label: 'Total Transaksi', value: '1,247', sub: 'Bulan ini', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Total Produk', value: '342', sub: 'Produk aktif', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Pelanggan Aktif', value: '892', sub: 'Bulan ini', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
];

const activities = [
    { text: 'Penjualan baru #1247 - Semen Portland (50 sak)', time: '5 Mnt yang lalu', alert: false, category: 'SALES' },
    { text: 'Pembelian stok - Besi Beton 10mm (2000 kg)', time: '1 Jam yang lalu', alert: false, category: 'STOCK' },
    { text: 'Penjualan baru #1246 - Cat Tembok (15 kaleng)', time: '2 Jam yang lalu', alert: false, category: 'SALES' },
    { text: 'Stok menipis - Genteng Keramik (tersisa 50 buah)', time: '3 Jam yang lalu', alert: true, category: 'ALERT' },
    { text: 'Penjualan baru #1245 - Bata Merah (5000 buah)', time: '4 Jam yang lalu', alert: false, category: 'SALES' },
];

export default async function OwnerDashboard() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    const user = session ? JSON.parse(session.value) : null;
    const userName = user?.name || 'Pemilik';

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-orange-600/20">Executive Overview</span>
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <Calendar className="w-3 h-3" /> {dateStr}
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Selamat Datang, {userName}</h1>
                    <p className="text-gray-500 font-medium mt-3">Ringkasan performa operasional dan metrik utama toko bangunan Anda hari ini.</p>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl relative overflow-hidden group hover:border-orange-200 transition-all duration-500">
                        <div className={`absolute -top-10 -right-10 w-32 h-32 ${stat.bg} rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700`}></div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center border ${stat.border} shadow-sm group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
                        </div>

                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 leading-none">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">{stat.value}</h3>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${stat.bg} ${stat.color} border ${stat.border}`}>+12.5%</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.sub}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Activities Section */}
            <div className="bg-white border border-gray-100 rounded-[40px] p-12 shadow-xl shadow-gray-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/30 -mr-32 -mt-32 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>

                <div className="flex items-center justify-between mb-10 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm text-gray-500">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-gray-900 tracking-tight">Timeline Aktivitas</h4>
                            <p className="text-gray-400 font-medium text-sm">Update operasional toko secara real-time</p>
                        </div>
                    </div>
                    <button className="text-[10px] font-black text-orange-600 uppercase tracking-[0.22em] bg-orange-50 px-6 py-3 rounded-full border border-orange-100 hover:bg-orange-600 hover:text-white transition-all active:scale-95 whitespace-nowrap">Lihat Seluruh Log &rarr;</button>
                </div>

                <div className="space-y-4 relative z-10">
                    {activities.map((act, i) => (
                        <div key={i} className={`bg-gray-50/50 rounded-3xl p-6 border border-gray-100/50 hover:bg-white hover:border-orange-100 hover:shadow-md transition-all flex items-center justify-between group/item cursor-default ${act.alert ? 'border-orange-200 bg-orange-50/30' : ''}`}>
                            <div className="flex items-center gap-6">
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
                </div>
            </div>
        </div>
    );
}

