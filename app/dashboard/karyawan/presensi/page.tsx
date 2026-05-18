'use client';
import React, { useState, useEffect } from 'react';
import { Camera, CalendarX2, CheckCircle, Clock, MapPin, ShieldCheck, Info, RefreshCw, LogIn, LogOut, Send } from 'lucide-react';
import { useToast } from '@/app/components/Toast';

export default function PresensiKaryawanPage() {
    const { showToast } = useToast();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [presensiStatus, setPresensiStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [lastDate, setLastDate] = useState(new Date().toDateString());
    const [mounted, setMounted] = useState(false);

    // Form Izin State
    const [izinForm, setIzinForm] = useState({
        tanggal_mulai: '',
        tanggal_selesai: '',
        jenis_izin: 'IZIN PENTING / KELUARGA',
        keterangan: ''
    });

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/presensi');
            if (res.ok) {
                const data = await res.json();
                setPresensiStatus(data);
            }
        } catch (error) {
            console.error("Fetch Status Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchStatus();
        
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);
            
            // Auto-refresh on date change
            const currentDate = now.toDateString();
            if (currentDate !== lastDate) {
                console.log("Date changed! Auto-refreshing status...");
                setLastDate(currentDate);
                fetchStatus();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [lastDate]);

    const handlePresensi = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/presensi', { method: 'POST' });
            if (res.ok) {
                const result = await res.json();
                console.log("Success:", result.message);
                showToast(result.message, 'success');
                await fetchStatus();
            } else {
                const err = await res.json();
                showToast(err.error || 'Gagal merekam presensi', 'error');
            }
        } catch (error) {
            showToast('Kesalahan jaringan: Periksa koneksi internet Anda.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleIzinSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/izin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(izinForm)
            });
            if (res.ok) {
                showToast('Pengajuan izin berhasil dikirim!', 'success');
                setIzinForm({
                    tanggal_mulai: '',
                    tanggal_selesai: '',
                    jenis_izin: 'IZIN PENTING / KELUARGA',
                    keterangan: ''
                });
            } else {
                const err = await res.json();
                showToast(err.error || 'Gagal mengirim pengajuan izin', 'error');
            }
        } catch (error) {
            showToast('Kesalahan jaringan', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDisplayTime = (dateTimeString: string | null) => {
        if (!dateTimeString) return '--:--';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
        } catch (e) {
            return '--:--';
        }
    };

    const formatFullTime = (date: Date) => date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const formatFullDate = (date: Date) => date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20 text-left animate-in fade-in duration-700">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Kepegawaian & Presensi</h1>
                <p className="text-gray-500 font-medium">Catat kehadiran harian Anda dan ajukan perizinan operasional secara digital.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Kamera Presensi (Updated to Status Card) */}
                <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl flex flex-col h-full group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 leading-tight">Absensi Harian</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Sistem Pencatatan Waktu Kerja</p>
                            </div>
                        </div>
                        <button 
                            onClick={fetchStatus}
                            className="p-3 bg-gray-50 hover:bg-orange-50 text-gray-400 hover:text-orange-600 rounded-xl transition-all"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    
                    <div className="w-full aspect-video bg-gray-50 rounded-[30px] mb-8 relative flex flex-col items-center justify-center border-4 border-gray-100/50 overflow-hidden group/status">
                        <div className="text-center z-10 p-8">
                            <div className="text-5xl font-black text-gray-900 font-mono tracking-tighter mb-4">
                                {mounted ? formatFullTime(currentTime) : '--.--.--'}
                            </div>
                            <div className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">
                                {mounted ? formatFullDate(currentTime) : 'Memuat Tanggal...'}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
                                <div className={`p-4 rounded-2xl border transition-all duration-500 ${presensiStatus?.waktu_masuk ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-gray-100 border-gray-200'}`}>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${presensiStatus?.waktu_masuk ? 'text-green-600' : 'text-gray-400'}`}>Masuk</p>
                                    <p className={`text-xl font-black ${presensiStatus?.waktu_masuk ? 'text-green-700' : 'text-gray-300'}`}>
                                        {formatDisplayTime(presensiStatus?.waktu_masuk)}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-2xl border transition-all duration-500 ${presensiStatus?.waktu_keluar ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-gray-100 border-gray-200'}`}>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${presensiStatus?.waktu_keluar ? 'text-orange-600' : 'text-gray-400'}`}>Pulang</p>
                                    <p className={`text-xl font-black ${presensiStatus?.waktu_keluar ? 'text-orange-700' : 'text-gray-300'}`}>
                                        {formatDisplayTime(presensiStatus?.waktu_keluar)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Decorative */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover/status:scale-150 transition-transform duration-1000"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-50/50 rounded-full blur-3xl -ml-16 -mb-16 group-hover/status:scale-150 transition-transform duration-1000"></div>
                    </div>
                    
                    {!presensiStatus?.onLeave ? (
                        <>
                            {!presensiStatus?.id_presensi ? (
                                <button 
                                    disabled={submitting || loading}
                                    onClick={handlePresensi}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-full font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-orange-600/20 active:scale-95 transition-all outline-none disabled:opacity-60"
                                >
                                    {submitting ? <RefreshCw className="w-5 h-5 animate-spin"/> : <LogIn className="w-5 h-5"/>}
                                    Rekam Absen Masuk &rarr;
                                </button>
                            ) : !presensiStatus.waktu_keluar ? (
                                <button 
                                    disabled={submitting || loading}
                                    onClick={handlePresensi}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-full font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-orange-600/20 active:scale-95 transition-all outline-none disabled:opacity-60"
                                >
                                    {submitting ? <RefreshCw className="w-5 h-5 animate-spin"/> : <LogOut className="w-5 h-5"/>}
                                    Rekam Absen Pulang &rarr;
                                </button>
                            ) : (
                                <div className="w-full bg-green-50 text-green-600 border-2 border-green-200 py-5 rounded-full font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-inner">
                                    <CheckCircle className="w-5 h-5"/>
                                    Presensi Hari Ini Selesai
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full bg-red-50 text-red-600 border-2 border-red-200 p-6 rounded-[30px] shadow-inner flex flex-col items-center gap-2 text-center animate-pulse">
                            <CalendarX2 className="w-10 h-10 mb-2"/>
                            <p className="font-black text-xs uppercase tracking-widest">Akses Presensi Dinonaktifkan</p>
                            <p className="text-[10px] font-bold text-red-400 max-w-[250px]">Anda sedang dalam masa izin/cuti ({presensiStatus.leaveInfo?.jenis}) yang telah disetujui Owner.</p>
                        </div>
                    )}
                    
                    <div className="mt-8 flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 group/info hover:bg-white hover:shadow-md transition-all">
                        <MapPin className="w-4 h-4 text-orange-500 group-hover/info:animate-bounce"/>
                        <p className="text-[10px] font-bold text-gray-400 group-hover/info:text-gray-600 uppercase tracking-tight transition-colors">AREA TOKO TB. LUMBUNG JAYA · STASIUN TERHUBUNG</p>
                    </div>
                </div>

                {/* Pengajuan Izin */}
                <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">
                            <CalendarX2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 leading-tight">Pengajuan Izin / Cuti</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Formulir Ketidakhadiran Resmi</p>
                        </div>
                    </div>
                    
                    <form onSubmit={handleIzinSubmit} className="space-y-8 flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tanggal Mulai</label>
                                <input 
                                    type="date" required
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800 shadow-inner" 
                                    value={izinForm.tanggal_mulai}
                                    onChange={e => setIzinForm({...izinForm, tanggal_mulai: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tanggal Selesai</label>
                                <input 
                                    type="date" required
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800 shadow-inner" 
                                    value={izinForm.tanggal_selesai}
                                    onChange={e => setIzinForm({...izinForm, tanggal_selesai: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="text-left">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Jenis Kepentingan</label>
                            <div className="relative group">
                                <select 
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800 appearance-none cursor-pointer shadow-inner"
                                    value={izinForm.jenis_izin}
                                    onChange={e => setIzinForm({...izinForm, jenis_izin: e.target.value})}
                                >
                                    <option value="SAKIT (DENGAN SURAT)">SAKIT (DENGAN SURAT)</option>
                                    <option value="IZIN PENTING / KELUARGA">IZIN PENTING / KELUARGA</option>
                                    <option value="CUTI TAHUNAN">CUTI TAHUNAN</option>
                                    <option value="KEPERLUAN MENDADAK">KEPERLUAN MENDADAK</option>
                                </select>
                                <Clock className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-red-500 transition-colors" />
                            </div>
                        </div>
                        <div className="text-left">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Keterangan / Deskripsi Alasan</label>
                            <textarea 
                                required
                                rows={3} 
                                className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-[28px] outline-none transition-all font-bold text-gray-800 resize-none shadow-inner" 
                                placeholder="Masukkan alasan lengkap pengajuan izin Anda di sini..."
                                value={izinForm.keterangan}
                                onChange={e => setIzinForm({...izinForm, keterangan: e.target.value})}
                            ></textarea>
                        </div>
                        
                        <button 
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-white hover:bg-red-50 text-red-600 border border-red-100 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-sm active:scale-95 disabled:opacity-60"
                        >
                            {submitting ? <RefreshCw className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5"/>}
                            Kirim Pengajuan ke Owner &rarr;
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
