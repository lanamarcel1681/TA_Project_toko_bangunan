"use client";

import { useState } from 'react';
import { Search, Mail, Phone, Calendar, Edit3, Trash2, ShieldCheck, Mail as MailIcon, Activity, X } from 'lucide-react';
import EditEmployeeModal from './EditEmployeeModal';

export default function EmployeeListWrapper({ initialEmployees = [] }: { initialEmployees: any[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState(initialEmployees);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const handleSuccess = (msg: string) => {
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
    };

    const filteredEmployees = initialEmployees.filter(e => 
        e.nama_pegawai.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.jabatan?.nama_jabatan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (employee: any) => {
        setSelectedEmployee(employee);
        setIsEditOpen(true);
    };

    return (
        <>
            {/* Custom Global Toast */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-[24px] shadow-2xl flex items-center gap-4 text-white">
                        <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-0.5">Selesai</p>
                            <p className="text-sm font-bold text-gray-100">{toastMsg}</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="ml-4 p-2 hover:bg-white/5 rounded-xl transition-colors">
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            )}

            {/* Search Navigation */}
            <div className="mb-10 group">
                <div className="relative w-full shadow-lg shadow-gray-200/40 rounded-full overflow-hidden border border-gray-100 group-hover:border-orange-200 transition-all duration-300">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-14 pr-6 py-5 bg-white placeholder-gray-400 focus:outline-none sm:text-sm font-medium text-gray-900 border-none" 
                        placeholder="Cari nama karyawan atau spesialisasi posisi..." 
                    />
                </div>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEmployees.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold">Tidak ada karyawan yang ditemukan.</p>
                    </div>
                ) : filteredEmployees.map((k, i) => (
                    <div key={k.id_pegawai} className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-xl hover:shadow-2xl hover:border-orange-100 transition-all duration-300 relative overflow-hidden group/card text-left flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/30 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                        
                        {/* Profile Header */}
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-[24px] bg-orange-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-orange-600/30 shrink-0 group-hover/card:scale-110 transition-transform overflow-hidden">
                                    {k.foto_profil ? (
                                        <img src={k.foto_profil} alt={k.nama_pegawai} className="w-full h-full object-cover" />
                                    ) : (
                                        k.nama_pegawai.substring(0, 2).toUpperCase()
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-black text-xl text-gray-900 tracking-tight leading-none mb-2 group-hover/card:text-orange-600 transition-colors truncate pr-2">{k.nama_pegawai}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            k.status_pegawai === 'Aktif' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                        }`}>
                                            <div className={`w-1 h-1 rounded-full ${k.status_pegawai === 'Aktif' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                            {k.status_pegawai || 'Aktif'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{k.jabatan?.nama_jabatan || 'Personel'}</span>
                            </div>
                        </div>

                        {/* Contact Data */}
                        <div className="space-y-4 mb-8 relative z-10 flex-1">
                            <div className="flex items-center gap-4 px-5 py-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 group-hover/card:bg-white transition-colors">
                                <MailIcon className="w-4 h-4 text-gray-400 group-hover/card:text-orange-500" />
                                <p className="text-sm font-bold text-gray-600 truncate">{k.email_pegawai}</p>
                            </div>
                            <div className="flex items-center gap-4 px-5 py-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 group-hover/card:bg-white transition-colors">
                                <Phone className="w-4 h-4 text-gray-400 group-hover/card:text-orange-500" />
                                <p className="text-sm font-bold text-gray-600">{k.nomor_telepon || '-'}</p>
                            </div>
                            <div className="flex items-center gap-4 px-5 py-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 group-hover/card:bg-white transition-colors">
                                <Calendar className="w-4 h-4 text-gray-400 group-hover/card:text-orange-500" />
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Tanggal Lahir</p>
                                    <p className="text-sm font-bold text-gray-600 leading-none">{k.tanggal_lahir || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Actions */}
                        <div className="flex items-center gap-3 relative z-10 opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0 transition-all duration-300">
                            <button 
                                onClick={() => handleEditClick(k)}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 hover:bg-orange-600 hover:text-white rounded-full transition-all border border-orange-100 active:scale-95"
                            >
                                <Edit3 className="w-3.5 h-3.5" /> Edit & Kelola Profil &rarr;
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <EditEmployeeModal 
                isOpen={isEditOpen} 
                onClose={() => setIsEditOpen(false)} 
                employee={selectedEmployee} 
                onSuccess={handleSuccess}
            />
        </>
    );
}
