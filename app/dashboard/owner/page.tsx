import { cookies } from 'next/headers';
import OwnerCharts from '../../components/OwnerCharts';

const stats = [
    { label: 'Total Penjualan', value: 'Rp 328.5 Jt', sub: 'Bulan ini', color: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-500/30' },
    { label: 'Total Transaksi', value: '1,247', sub: 'Bulan ini', color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/30' },
    { label: 'Total Produk', value: '342', sub: 'Produk aktif', color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/30' },
    { label: 'Pelanggan Aktif', value: '892', sub: 'Bulan ini', color: 'from-violet-500 to-violet-600', shadow: 'shadow-violet-500/30' },
];

const activities = [
    { text: 'Penjualan baru #1247 - Semen Portland (50 sak)', time: '5 menit yang lalu', alert: false },
    { text: 'Pembelian stok - Besi Beton 10mm (2000 kg)', time: '1 jam yang lalu', alert: false },
    { text: 'Penjualan baru #1246 - Cat Tembok (15 kaleng)', time: '2 jam yang lalu', alert: false },
    { text: 'Stok menipis - Genteng Keramik (tersisa 50 buah)', time: '3 jam yang lalu', alert: true },
    { text: 'Penjualan baru #1245 - Bata Merah (5000 buah)', time: '4 jam yang lalu', alert: false },
];

export default async function OwnerDashboard() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    const user = session ? JSON.parse(session.value) : { name: 'Pemilik' };

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <>
            {/* Content */}
            <div className="px-8 py-8 pb-16">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg ${stat.shadow} relative overflow-hidden group`}>
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl backdrop-blur-md"></div>
                                <div className="w-16 h-6 bg-white/20 rounded-md backdrop-blur-md"></div>
                            </div>
                            <p className="text-white/80 text-sm font-medium mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold tracking-tight mb-2">{stat.value}</h3>
                            <p className="text-white/70 text-[11px]">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <OwnerCharts />

                {/* Aktivitas Terbaru */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-bold text-sm text-gray-800 mb-5">Aktivitas Terbaru</h4>
                    <div className="space-y-3">
                        {activities.map((act, i) => (
                            <div key={i} className={`bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow flex items-start ${act.alert ? 'relative pl-8' : ''}`}>
                                {act.alert && (
                                    <div className="absolute left-4 top-[24px] w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                                )}
                                <div className="flex-1">
                                    <p className="text-[13px] text-gray-700 font-medium">{act.text}</p>
                                    <p className="text-[11px] text-gray-400 mt-1">{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
