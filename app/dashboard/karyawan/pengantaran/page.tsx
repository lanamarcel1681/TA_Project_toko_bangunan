'use client';
import React, { useState } from 'react';
import { Truck, CheckCircle, Combine, Timer, MapPin, ChevronRight, Zap } from 'lucide-react';

const initialMissions = [
    { id: "MISI #01-A", customer: "Budi Santoso", address: "Jl. Merdeka Barat No. 44, Rute 1 (Arah pusat kota)", estimasi: "± 45 Menit" }
];

const initialProposals = [
    {
        id: "PROP-01", title: "Penggabungan Rute Barat", orders: [
            { id: 'INV-X001', name: 'Bpk Handoko', addr: 'Jl. Kamboja' },
            { id: 'INV-X005', name: 'Ibu Tati', addr: 'Jl. Melati' }
        ]
    }
];

export default function ManajemenPengantaranPage() {
    const [missions, setMissions] = useState(initialMissions);
    const [proposals, setProposals] = useState(initialProposals);

    const handleSelesai = (id: string) => {
        alert(`Pengiriman ${id} telah diselesaikan!`);
        setMissions(missions.filter(m => m.id !== id));
    };

    const handleSetujui = (id: string) => {
        alert(`Penggabungan rute ${id} berhasil disetujui! Tugas akan diperbarui.`);
        setProposals(proposals.filter(p => p.id !== id));
    };

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Monitoring Pengantaran</h1>
                <p className="text-gray-500 font-medium">Kelola tugas pengiriman aktif dan optimasi rute kurir operasional toko.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Aktivitas Pengantaran Aktif */}
                {missions.length === 0 ? (
                     <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 font-bold">
                         Tidak ada pengantaran aktif saat ini.
                     </div>
                ) : (
                    missions.map(mission => (
                        <div key={mission.id} className="bg-white rounded-[40px] p-10 shadow-xl border border-gray-100 relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50/50 px-3 py-1.5 rounded-full border border-blue-100">{mission.id}</span>
                                </div>
                                <span className="text-[10px] font-black text-gray-300 font-mono">AKTIF</span>
                            </div>

                            <div className="mb-6">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1 leading-none">Penerima Barang</p>
                                <h3 className="text-xl font-black text-gray-900 leading-tight">{mission.customer}</h3>
                                <div className="flex items-start gap-2 mt-2 text-gray-500">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm font-medium leading-relaxed">{mission.address}</p>
                                </div>
                            </div>
                            
                            <div className="mb-8 p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                                    <Timer className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Estimasi Tiba</p>
                                    <p className="text-sm font-black text-gray-800 leading-none">{mission.estimasi} <span className="text-[10px] text-blue-500 font-bold ml-1">SISTEM</span></p>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleSelesai(mission.id)}
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-full flex justify-center items-center gap-3 font-black text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-green-500/20 active:scale-95 transition-all outline-none"
                            >
                                <CheckCircle className="w-4 h-4" /> Selesaikan Pengiriman &rarr;
                            </button>
                        </div>
                    ))
                )}

                 {/* Penggabungan Pengiriman Suggestion */}
                 {proposals.length > 0 && proposals.map(proposal => (
                    <div key={proposal.id} className="bg-blue-600 rounded-[40px] p-10 shadow-2xl shadow-blue-600/30 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center border border-white/20">
                                    <Combine className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full border border-white/20">PROPOSAL RUTE</span>
                            </div>
                            <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
                        </div>

                        <div className="mb-8 text-white text-left">
                            <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1 leading-none">Rute Berdekatan Terdeteksi</p>
                            <h3 className="text-xl font-black leading-tight mb-4">{proposal.title}</h3>
                            <div className="space-y-3">
                                {proposal.orders.map((order, idx) => (
                                    <div key={idx} className="bg-white/10 p-4 rounded-2xl border border-white/10 flex items-center justify-between group/item hover:bg-white/20 transition-all cursor-default">
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-tight text-blue-200">{order.id} — {order.name}</p>
                                            <p className="text-xs font-bold text-white mt-0.5">{order.addr}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/40 group-hover/item:text-white transition-all"/>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={() => handleSetujui(proposal.id)}
                            className="w-full bg-white text-blue-600 py-4 rounded-full flex justify-center items-center gap-3 font-black text-[10px] uppercase tracking-[0.15em] shadow-xl hover:bg-blue-50 active:scale-95 transition-all outline-none"
                        >
                            <Combine className="w-4 h-4" /> Setujui Penggabungan &rarr;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

