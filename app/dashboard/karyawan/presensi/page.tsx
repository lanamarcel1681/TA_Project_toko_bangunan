'use client';
import React from 'react';
import { Camera, CalendarX2, CheckCircle, Clock, MapPin, ShieldCheck, Info } from 'lucide-react';

export default function PresensiKaryawanPage() {
    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Kepegawaian & Presensi</h1>
                <p className="text-gray-500 font-medium">Catat kehadiran harian Anda dan ajukan perizinan operasional secara digital.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Kamera Presensi */}
                <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl flex flex-col h-full group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 leading-tight">Absensi Harian</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Verifikasi Biometrik & Lokasi</p>
                            </div>
                        </div>
                        <div className="flex bg-gray-50 px-4 py-2 rounded-2xl items-center gap-2 border border-gray-100/50">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-black text-gray-700 font-mono tracking-tighter">07:45 AM</span>
                        </div>
                    </div>
                    
                    <div className="w-full aspect-video bg-gray-900 rounded-[30px] mb-8 relative flex flex-col items-center justify-center border-4 border-gray-50 overflow-hidden shadow-inner group/camera">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center mb-4 group-hover/camera:scale-110 transition-all duration-500">
                                <Camera className="w-10 h-10 text-white" />
                            </div>
                            <span className="text-white text-xs font-black uppercase tracking-widest opacity-80">Siap Untuk Pemindaian</span>
                        </div>
                        
                        {/* Scanning Effect UI */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400/50 shadow-[0_0_15px_blue] animate-[scan_3s_ease-in-out_infinite]"></div>
                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10 px-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest border-b border-blue-400/30 pb-0.5">AREA TOKO TERDETEKSI</span>
                            </div>
                        </div>
                    </div>
                    
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-black text-[10px] uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 active:scale-95 transition-all outline-none">
                        <CheckCircle className="w-4 h-4"/> Rekam Presensi Sekarang &rarr;
                    </button>
                    
                    <div className="mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                        <Info className="w-4 h-4 text-gray-400"/>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Status: Anda berada dalam radius aman (85m)</p>
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
                    
                    <form className="space-y-8 flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tanggal Mulai</label>
                                <input type="date" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Jenis Kepentingan</label>
                                <select className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-gray-800 bg-white">
                                    <option>SAKIT (DENGAN SURAT)</option>
                                    <option>IZIN PENTING / KELUARGA</option>
                                    <option>CUTI TAHUNAN</option>
                                    <option>KEPERLUAN MENDADAK</option>
                                </select>
                            </div>
                        </div>
                        <div className="text-left">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Keterangan / Deskripsi Alasan</label>
                            <textarea 
                                rows={4} 
                                className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-[28px] focus:border-red-500 focus:bg-white outline-none transition-all font-bold text-gray-800 resize-none shadow-inner" 
                                placeholder="Masukkan alasan lengkap pengajuan izin Anda di sini..."
                            ></textarea>
                        </div>
                    </form>
                    
                    <button className="mt-10 w-full bg-white hover:bg-red-50 text-red-600 border border-red-100 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.15em] flex items-center justify-center transition-all shadow-sm active:scale-95">
                        Kirim Pengajuan ke Owner &rarr;
                    </button>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes scan {
                    0%, 100% { top: 0; }
                    50% { top: 100%; }
                }
            `}</style>
        </div>
    );
}

