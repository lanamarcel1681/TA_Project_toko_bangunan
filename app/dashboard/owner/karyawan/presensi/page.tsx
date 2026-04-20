'use client';
import React, { useState, useEffect } from 'react';
import { 
    Users, Clock, CalendarCheck, CalendarX2, CheckCircle, 
    XCircle, Info, RefreshCw, ChevronRight, UserCheck, 
    Search, Filter
} from 'lucide-react';
import { useToast } from '@/app/components/Toast';

export default function OwnerPresensiMonitoring() {
    const { showToast } = useToast();
    const [presensi, setPresensi] = useState<any[]>([]);
    const [izin, setIzin] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [presRes, izinRes] = await Promise.all([
                fetch('/api/presensi'),
                fetch('/api/izin')
            ]);
            
            if (presRes.ok) setPresensi(await presRes.json());
            if (izinRes.ok) setIzin(await izinRes.json());
        } catch (error) {
            console.error('Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateIzinStatus = async (id: number, status: string, name: string) => {
        setActionLoading(id);
        try {
            const res = await fetch(`/api/izin/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                showToast(`Pengajuan izin ${name} telah ${status.toLowerCase()}`, 'success');
                fetchData();
            } else {
                showToast('Gagal memperbarui status', 'error');
            }
        } catch (error) {
            showToast('Kesalahan jaringan', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const presentCount = presensi.length;
    const leaveCount = izin.filter(i => i.status_izin === 'Disetujui').length;
    const pendingIzinCount = izin.filter(i => i.status_izin === 'Pending').length;

    if (loading && presensi.length === 0) {
        return (
            <div className="p-8 w-full max-w-[1400px] mx-auto flex items-center justify-center min-h-[60vh]">
                <RefreshCw className="w-10 h-10 text-orange-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                            <CalendarCheck className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Monitoring Presence</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Kehadiran & Perizinan</h1>
                    <p className="text-gray-500 font-medium mt-3">Pantau kehadiran harian tim dan kelola pengajuan izin secara terpusat.</p>
                </div>
                <button 
                    onClick={fetchData}
                    className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-600 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest px-2">Refresh Data</span>
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                            <UserCheck className="w-7 h-7" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 lead-none">Hadir Hari Ini</p>
                        <h3 className="text-5xl font-black text-gray-900 tracking-tight leading-none">{presentCount} <span className="text-sm font-bold text-gray-400">PERSONEL</span></h3>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center border border-orange-100 shadow-sm">
                            <CalendarX2 className="w-7 h-7" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 lead-none">Sedang Izin / Cuti</p>
                        <h3 className="text-5xl font-black text-gray-900 tracking-tight leading-none">{leaveCount} <span className="text-sm font-bold text-gray-400">PERSONEL</span></h3>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">
                            <Clock className="w-7 h-7" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 lead-none">Menunggu Persetujuan</p>
                        <h3 className="text-5xl font-black text-gray-900 tracking-tight leading-none">{pendingIzinCount} <span className="text-sm font-bold text-gray-400">PENGAJUAN</span></h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Attendance List */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden flex flex-col h-full">
                    <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h4 className="font-black text-gray-900 tracking-tight">Presensi Hari Ini</h4>
                        </div>
                    </div>
                    <div className="p-8 space-y-4 overflow-y-auto max-h-[600px]">
                        {presensi.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-6 rounded-[28px] bg-gray-50/50 hover:bg-white hover:border-orange-100 border border-transparent hover:shadow-md transition-all group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition-colors">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-800 tracking-tight leading-none mb-1.5">{p.pegawai.nama_pegawai}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(p.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Masuk</p>
                                            <p className="text-xs font-black text-gray-900">{new Date(p.waktu_masuk).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        <div className="w-px h-8 bg-gray-200"></div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Pulang</p>
                                            <p className="text-xs font-black text-gray-900">{p.waktu_keluar ? new Date(p.waktu_keluar).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {presensi.length === 0 && <p className="text-center py-20 text-gray-400 font-black uppercase tracking-widest text-xs">Belum ada karyawan yang hadir hari ini</p>}
                    </div>
                </div>

                {/* Leave Requests Management */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden flex flex-col h-full">
                    <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white text-orange-600 rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                                <CalendarX2 className="w-5 h-5" />
                            </div>
                            <h4 className="font-black text-gray-900 tracking-tight">Kelola Pengajuan Izin</h4>
                        </div>
                    </div>
                    <div className="p-8 space-y-4 overflow-y-auto max-h-[600px]">
                        {izin.map((iz, i) => (
                            <div key={i} className={`p-8 rounded-[32px] border ${iz.status_izin === 'Pending' ? 'border-orange-100 bg-orange-50/30' : 'border-gray-50 bg-gray-50/50'} transition-all hover:bg-white hover:shadow-lg group`}>
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-orange-600 transition-colors">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-gray-900 tracking-tight leading-none mb-1.5">{iz.pegawai.nama_pegawai}</p>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                                iz.status_izin === 'Pending' ? 'bg-orange-600 text-white' : 
                                                iz.status_izin === 'Disetujui' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                            }`}>
                                                {iz.status_izin}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Durasi Izin</p>
                                        <p className="text-xs font-black text-gray-900">
                                            {new Date(iz.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(iz.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white/50 border border-gray-100/50 rounded-2xl p-4 mb-8 text-sm font-medium text-gray-600 leading-relaxed italic group-hover:bg-white transition-colors">
                                    "{iz.keterangan}"
                                </div>
                                
                                {iz.status_izin === 'Pending' && (
                                    <div className="flex items-center gap-3">
                                        <button 
                                            disabled={!!actionLoading}
                                            onClick={() => updateIzinStatus(iz.id_izin, 'Disetujui', iz.pegawai.nama_pegawai)}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-95 transition-all disabled:opacity-60"
                                        >
                                            {actionLoading === iz.id_izin ? <RefreshCw className="w-4 h-4 animate-spin"/> : <CheckCircle className="w-4 h-4"/>}
                                            Setujui Izin
                                        </button>
                                        <button 
                                            disabled={!!actionLoading}
                                            onClick={() => updateIzinStatus(iz.id_izin, 'Ditolak', iz.pegawai.nama_pegawai)}
                                            className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-100 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-60"
                                        >
                                            {actionLoading === iz.id_izin ? <RefreshCw className="w-4 h-4 animate-spin"/> : <XCircle className="w-4 h-4"/>}
                                            Tolak
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {izin.length === 0 && <p className="text-center py-20 text-gray-400 font-black uppercase tracking-widest text-xs">Belum ada pengajuan izin terdaftar</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
