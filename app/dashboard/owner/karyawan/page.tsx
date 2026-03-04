const karyawan = [
    { inisial: 'BS', nama: 'Budi Santoso', posisi: 'Manager Toko', status: 'aktif', email: 'budi.santoso@bangunanku.com', telp: '08123456789', bergabung: '15 Januari 2020' },
    { inisial: 'SR', nama: 'Siti Rahayu', posisi: 'Kasir', status: 'aktif', email: 'siti.rahayu@bangunanku.com', telp: '08129876543', bergabung: '20 Maret 2021' },
    { inisial: 'AF', nama: 'Ahmad Fauzi', posisi: 'Gudang', status: 'aktif', email: 'ahmad.fauzi@bangunanku.com', telp: '08134567890', bergabung: '10 Juni 2021' },
    { inisial: 'RK', nama: 'Rina Kusuma', posisi: 'Sales', status: 'aktif', email: 'rina.kusuma@bangunanku.com', telp: '08145678901', bergabung: '5 Februari 2022' },
    { inisial: 'DK', nama: 'Dedi Kurniawan', posisi: 'Driver', status: 'aktif', email: 'dedi.kurniawan@bangunanku.com', telp: '08156789012', bergabung: '12 Agustus 2022' },
    { inisial: 'MS', nama: 'Maya Sari', posisi: 'Admin', status: 'aktif', email: 'maya.sari@bangunanku.com', telp: '08167890123', bergabung: '8 Januari 2023' },
];

export default function KaryawanPage() {
    return (
        <div className="px-8 py-8 w-full max-w-[1400px] mx-auto pb-16">

            {/* Page Heading & Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Daftar Karyawan</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola data karyawan dan tim</p>
                </div>
                <button type="button" className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 shadow-sm transition-colors">
                    <svg className="w-4 h-4 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Tambah Karyawan
                </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Karyawan */}
                <div className="bg-blue-50 rounded-2xl px-6 py-5 border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium mb-2">Total Karyawan</p>
                    <h3 className="text-3xl font-bold text-blue-700">24</h3>
                </div>
                {/* Aktif */}
                <div className="bg-green-50 rounded-2xl px-6 py-5 border border-green-100">
                    <p className="text-xs text-green-600 font-medium mb-2">Aktif</p>
                    <h3 className="text-3xl font-bold text-green-600">22</h3>
                </div>
                {/* Cuti */}
                <div className="bg-yellow-50 rounded-2xl px-6 py-5 border border-yellow-100">
                    <p className="text-xs text-yellow-600 font-medium mb-2">Cuti</p>
                    <h3 className="text-3xl font-bold text-yellow-600">2</h3>
                </div>
                {/* Bergabung Bulan Ini */}
                <div className="bg-purple-50 rounded-2xl px-6 py-5 border border-purple-100">
                    <p className="text-xs text-purple-600 font-medium mb-2">Bergabung Bulan Ini</p>
                    <h3 className="text-3xl font-bold text-purple-600">1</h3>
                </div>
            </div>

            {/* Search */}
            <div className="mb-8">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input type="text" className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-colors" placeholder="Cari nama atau posisi..." />
                </div>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {karyawan.map((k, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                        {/* Header avatar + nama */}
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-orange-500/20">
                                {k.inisial}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-bold text-gray-900 text-sm">{k.nama}</h3>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${k.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {k.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{k.posisi}</p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-50 mb-4"></div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                {k.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                {k.telp}
                            </div>
                        </div>

                        {/* Joined Date */}
                        <p className="text-[11px] text-gray-400 mb-4">Bergabung: {k.bergabung}</p>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                Edit
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Hapus
                            </button>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}
