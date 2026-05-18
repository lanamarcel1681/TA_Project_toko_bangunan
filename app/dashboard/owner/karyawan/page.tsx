import AddEmployeeClient from './AddEmployeeClient';
import EmployeeListWrapper from './EmployeeListWrapper';
import { Users, UserCheck, Clock, CalendarDays } from 'lucide-react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function KaryawanPage() {
    // Fetch real data from DB
    const employeesData = await prisma.pegawai.findMany({
        include: {
            jabatan: true
        },
        orderBy: {
            id_pegawai: 'desc'
        }
    });

    // Calculate metrics
    const totalKaryawan = employeesData.length;
    const aktifKaryawan = employeesData.filter(e => e.status_pegawai === 'Aktif').length;
    const nonAktifKaryawan = totalKaryawan - aktifKaryawan;
    const newHires = employeesData.filter(e => {
        // Simple logic for new hires (e.g., added in the last 30 days)
        // But since we don't have createdAt, we just show a static number or logic based on ID
        return e.id_pegawai > (totalKaryawan - 2); 
    }).length;

    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
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
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="w-5 h-5 text-orange-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Karyawan</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{totalKaryawan} <span className="text-sm font-bold text-gray-400">Team Members</span></h3>
                    <div className="w-10 h-1 bg-orange-600 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <UserCheck className="w-5 h-5 text-green-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-green-600">Status Aktif</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{aktifKaryawan} <span className="text-sm font-bold text-gray-400">On Duty</span></h3>
                    <div className="w-10 h-1 bg-green-500 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-yellow-600">Non-aktif</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{nonAktifKaryawan} <span className="text-sm font-bold text-gray-400">Personnel</span></h3>
                    <div className="w-10 h-1 bg-yellow-500 rounded-full"></div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 -mr-12 -mt-12 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <CalendarDays className="w-5 h-5 text-purple-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-purple-600">New Potential</p>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{newHires} <span className="text-sm font-bold text-gray-400">Recent</span></h3>
                    <div className="w-10 h-1 bg-purple-500 rounded-full"></div>
                </div>
            </div>

            <EmployeeListWrapper initialEmployees={employeesData} />
        </div>
    );
}

