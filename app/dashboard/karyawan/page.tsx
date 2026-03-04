import { cookies } from 'next/headers';

const stockItems = [
    { name: 'Semen Portland Tiga Roda 40kg', category: 'Semen', stock: 320, unit: 'sak', status: 'ok' },
    { name: 'Besi Beton Ulir 10mm', category: 'Besi', stock: 150, unit: 'batang', status: 'ok' },
    { name: 'Cat Tembok Dulux 5kg', category: 'Cat', stock: 45, unit: 'kaleng', status: 'low' },
    { name: 'Genteng Keramik KIA', category: 'Genteng', stock: 50, unit: 'buah', status: 'low' },
    { name: 'Pipa PVC Wavin 3"', category: 'Pipa', stock: 200, unit: 'batang', status: 'ok' },
    { name: 'Bata Merah Lokal', category: 'Bata', stock: 5000, unit: 'buah', status: 'ok' },
];

const todayActivity = [
    { type: 'masuk', item: 'Semen Portland 40kg', qty: 100, unit: 'sak', time: '08:15' },
    { type: 'keluar', item: 'Cat Tembok Dulux 5kg', qty: 10, unit: 'kaleng', time: '09:30' },
    { type: 'keluar', item: 'Besi Beton Ulir 10mm', qty: 30, unit: 'batang', time: '11:00' },
    { type: 'masuk', item: 'Pipa PVC Wavin 3"', qty: 50, unit: 'batang', time: '13:45' },
    { type: 'keluar', item: 'Genteng Keramik KIA', qty: 200, unit: 'buah', time: '14:20' },
];

export default async function KaryawanDashboard() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    const user = session ? JSON.parse(session.value) : { name: 'Karyawan' };

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const lowStock = stockItems.filter(i => i.status === 'low').length;
    const totalItems = stockItems.length;

    return (
        <>


            <div className="px-8 py-8 pb-16">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/30 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-white/80 text-sm font-medium mb-1">Total Jenis Barang</p>
                        <h3 className="text-3xl font-bold tracking-tight mb-2">{totalItems}</h3>
                        <p className="text-white/70 text-[11px]">Barang terdaftar</p>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg shadow-red-500/30 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-white/80 text-sm font-medium mb-1">Stok Menipis</p>
                        <h3 className="text-3xl font-bold tracking-tight mb-2">{lowStock}</h3>
                        <p className="text-white/70 text-[11px]">Perlu restock segera</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Stok Barang Table */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h4 className="font-bold text-sm text-gray-800 mb-5">Status Stok Barang</h4>
                        <div className="space-y-3">
                            {stockItems.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                                        <p className="text-[11px] text-gray-400">{item.category}</p>
                                    </div>
                                    <div className="ml-4 text-right flex-shrink-0">
                                        <p className="text-sm font-bold text-gray-700">{item.stock.toLocaleString('id-ID')} {item.unit}</p>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.status === 'low' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                            }`}>
                                            {item.status === 'low' ? 'Stok Menipis' : 'Normal'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Aktivitas Hari Ini */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h4 className="font-bold text-sm text-gray-800 mb-5">Aktivitas Barang Hari Ini</h4>
                        <div className="space-y-3">
                            {todayActivity.map((act, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                                    <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${act.type === 'masuk' ? 'bg-green-100' : 'bg-orange-100'
                                        }`}>
                                        <svg className={`w-3.5 h-3.5 ${act.type === 'masuk' ? 'text-green-600' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {act.type === 'masuk'
                                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            }
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-medium text-gray-800">
                                            <span className={`font-bold ${act.type === 'masuk' ? 'text-green-600' : 'text-orange-600'}`}>
                                                {act.type === 'masuk' ? 'Masuk' : 'Keluar'}
                                            </span>{' '}
                                            {act.item}
                                        </p>
                                        <p className="text-[11px] text-gray-400">{act.qty} {act.unit} · {act.time} WIB</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
