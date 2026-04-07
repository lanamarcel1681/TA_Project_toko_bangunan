import AddEmployeeClient from './AddEmployeeClient';
import { Users, UserCheck, CalendarDays, UserPlus, Search, Mail, Phone, Calendar, Edit3, Trash2, ShieldCheck, Clock, ChevronRight } from 'lucide-react';

const karyawan = [
    { inisial: 'BS', nama: 'Budi Santoso', posisi: 'Manager Toko', status: 'aktif', email: 'budi.santoso@bangunanku.com', telp: '08123456789', bergabung: '15 Januari 2020' },
    { inisial: 'SR', nama: 'Siti Rahayu', posisi: 'Kasir', status: 'aktif', email: 'siti.rahayu@bangunanku.com', telp: '08129876543', bergabung: '20 Maret 2021' },
    { inisial: 'AF', nama: 'Ahmad Fauzi', posisi: 'Gudang', status: 'aktif', email: 'ahmad.fauzi@bangunanku.com', telp: '08134567890', bergabung: '10 Juni 2021' },
    { inisial: 'RK', nama: 'Rina Kusuma', posisi: 'Sales', status: 'aktif', email: 'rina.kumasa@bangunanku.com', telp: '08145678901', bergabung: '5 Februari 2022' },
    { inisial: 'DK', nama: 'Dedi Kurniawan', posisi: 'Driver', status: 'aktif', email: 'dedi.kurniawan@bangunanku.com', telp: '08156789012', bergabung: '12 Agustus 2022' },
    { inisial: 'MS', nama: 'Maya Sari', posisi: 'Admin', status: 'aktif', email: 'maya.sari@bangunanku.com', telp: '08167890123', bergabung: '8 Januari 2023' },
];

export default function KaryawanPage() {
    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            {/* Page Heading & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Human Resources</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Manajemen Karyawan</h1>
                    <p className="text-gray-500 font-medium mt-3">Pantau produktivitas, kelola hak akses, dan administrasi database tim Anda.</p>
                </div>
                <AddEmployeeClient />
            </div>

            {/* Metric Cards Portfolio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="w-5 h-5 text-blue-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Karyawan</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">24 <span className="text-sm font-bold text-gray-400">Team Members</span></h3>
                    <div className="w-10 h-1 bg-blue-600 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <UserCheck className="w-5 h-5 text-green-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-green-600">Status Aktif</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">22 <span className="text-sm font-bold text-gray-400">On Duty</span></h3>
                    <div className="w-10 h-1 bg-green-500 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-yellow-600">Sedang Cuti</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">2 <span className="text-sm font-bold text-gray-400">Personnel</span></h3>
                    <div className="w-10 h-1 bg-yellow-500 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <CalendarDays className="w-5 h-5 text-purple-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-purple-600">New Hires</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">1 <span className="text-sm font-bold text-gray-400">This Month</span></h3>
                    <div className="w-10 h-1 bg-purple-500 rounded-full"></div>
                </div>
            </div>

            {/* Search Navigation */}
            <div className="mb-10 group">
                <div className="relative w-full shadow-lg shadow-gray-200/40 rounded-full overflow-hidden border border-gray-100 group-hover:border-orange-200 transition-all duration-300">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <input type="text" className="block w-full pl-14 pr-6 py-5 bg-white placeholder-gray-400 focus:outline-none sm:text-sm font-medium text-gray-900" placeholder="Cari nama karyawan atau spesialisasi posisi..." />
                </div>
            </div>

            {/* Employee Grid Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {karyawan.map((k, i) => (
                    <div key={i} className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-xl hover:shadow-2xl hover:border-orange-100 transition-all duration-300 relative overflow-hidden group/card text-left flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/30 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                        
                        {/* Profile Header */}
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-[24px] bg-orange-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-orange-600/30 shrink-0 group-hover/card:scale-110 transition-transform">
                                    {k.inisial}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-black text-xl text-gray-900 tracking-tight leading-none mb-2 group-hover/card:text-orange-600 transition-colors">{k.nama}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            k.status === 'aktif' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                        }`}>
                                            <div className={`w-1 h-1 rounded-full ${k.status === 'aktif' ? 'bg-green-600' : 'bg-yellow-600'}`}></div>
                                            {k.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{k.posisi}</span>
                            </div>
                        </div>

                        {/* Contact Data */}
                        <div className="space-y-4 mb-8 relative z-10 flex-1">
                            <div className="flex items-center gap-4 px-5 py-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 group-hover/card:bg-white transition-colors">
                                <Mail className="w-4 h-4 text-gray-400 group-hover/card:text-orange-500" />
                                <p className="text-sm font-bold text-gray-600 truncate">{k.email}</p>
                            </div>
                            <div className="flex items-center gap-4 px-5 py-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 group-hover/card:bg-white transition-colors">
                                <Phone className="w-4 h-4 text-gray-400 group-hover/card:text-orange-500" />
                                <p className="text-sm font-bold text-gray-600">{k.telp}</p>
                            </div>
                            <div className="flex items-center gap-4 px-5 py-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 group-hover/card:bg-white transition-colors">
                                <Calendar className="w-4 h-4 text-gray-400 group-hover/card:text-orange-500" />
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Join Date</p>
                                    <p className="text-sm font-bold text-gray-600 leading-none">{k.bergabung}</p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Actions */}
                        <div className="flex items-center gap-3 relative z-10 opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0 transition-all duration-300">
                            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-full transition-all border border-blue-100 active:scale-95">
                                <Edit3 className="w-3.5 h-3.5" /> Profil Lengkap &rarr;
                            </button>
                            <button className="w-14 h-14 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-[20px] transition-all border border-red-100 active:scale-95 shadow-sm" title="Nonaktifkan Karyawan">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
