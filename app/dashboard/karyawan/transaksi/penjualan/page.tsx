'use client';
import React, { useState } from 'react';
import {
    ShoppingCart, Printer, CalendarClock, PackageCheck, AlertTriangle,
    X, Truck, User, Calendar, Clock, MapPin, CheckCircle2, ChevronRight,
    Store, ClipboardCheck, Timer
} from 'lucide-react';

const initialPendingDeliveries = [
    {
        id: "INV-DIANTAR-001",
        customer: "Agung Wijaya",
        date: "12 April 2026",
        address: "Jl. Pahlawan No. 45, Kecamatan Suka Maju, Kota Cerdas.",
        status: "Menunggu Pengantaran"
    },
    {
        id: "INV-DIANTAR-003",
        customer: "Hendri Pratama",
        date: "13 April 2026",
        address: "Perumahan Indah Permai Block C-12, Gading Serpong.",
        status: "Menunggu Pengantaran"
    }
];

const initialPickups = [
    {
        id: "INV-AMBIL-002",
        customer: "Rina Suryani",
        date: "12 April 2026",
        area: "Area Pickup Gudang A"
    }
];

export default function TransaksiPenjualanKaryawanPage() {
    const [deliveries, setDeliveries] = useState(initialPendingDeliveries);
    const [pickups, setPickups] = useState(initialPickups);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Modal Form State
    const [assignment, setAssignment] = useState({
        driver: '',
        vehicle: '',
        date: '',
        time: '',
        note: ''
    });

    const openAssignmentModal = (id: string) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Berhasil! Pesanan ${selectedId} telah ditugaskan ke ${assignment.driver} untuk pengiriman tanggal ${assignment.date}`);
        setDeliveries(deliveries.filter(d => d.id !== selectedId));
        setIsModalOpen(false);
        setAssignment({ driver: '', vehicle: '', date: '', time: '', note: '' });
    };

    const handlePickup = (id: string) => {
        alert(`Konfirmasi penyerahan untuk ${id} berhasil diselesaikan!`);
        setPickups(pickups.filter(p => p.id !== id));
    };

    const selectedOrder = deliveries.find(d => d.id === selectedId);

    return (
        <div className="p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Monitoring Penjualan</h1>
                <p className="text-gray-500 font-medium">Monitoring pengiriman barang ke pelanggan dan verifikasi pengambilan pesanan di toko.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Kolom Pengiriman (Diantar) */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                                <Truck className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Antar Alamat</h2>
                        </div>
                        <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">{deliveries.length} PESANAN</span>
                    </div>

                    <div className="space-y-6">
                        {deliveries.length === 0 ? (
                            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 font-bold">
                                Tidak ada pengiriman yang tertunda.
                            </div>
                        ) : (
                            deliveries.map((delivery) => (
                                <div key={delivery.id} className="bg-white rounded-[40px] p-10 shadow-xl border border-gray-100 relative group overflow-hidden transition-all hover:border-blue-200">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-700"></div>

                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-gray-50 text-blue-600 rounded-2xl border border-gray-100">
                                                    <ShoppingCart className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-gray-900 leading-tight mb-1">{delivery.id}</h3>
                                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                                                        {delivery.customer} <span className="text-gray-300 font-normal">·</span> {delivery.date}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 mb-8 text-left">
                                            <div className="flex items-center gap-3 mb-3">
                                                <MapPin className="w-4 h-4 text-blue-600" />
                                                <span className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Alamat Tujuan Pengiriman:</span>
                                            </div>
                                            <p className="text-sm font-black text-gray-800 leading-relaxed pl-7">{delivery.address}</p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => openAssignmentModal(delivery.id)}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.15em] flex justify-center items-center gap-3 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                                            >
                                                <CalendarClock className="w-4 h-4" /> Tugaskan Driver &rarr;
                                            </button>
                                            <button onClick={() => alert('Mencetak surat jalan / resi...')} className="w-14 h-14 bg-white border border-gray-100 text-gray-400 rounded-2xl flex items-center justify-center hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm active:scale-95">
                                                <Printer className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Kolom Pengambilan (Ambil Sendiri) */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center border border-green-100">
                                <Store className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Ambil di Toko</h2>
                        </div>
                        <span className="bg-green-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-600/20">{pickups.length} PESANAN</span>
                    </div>

                    {pickups.length === 0 ? (
                        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 font-bold">
                            Semua pesanan ambil di toko telah selesai!
                        </div>
                    ) : (
                        pickups.map((pickup) => (
                            <div key={pickup.id} className="bg-white rounded-[40px] p-10 shadow-xl border border-gray-100 relative group overflow-hidden transition-all hover:border-green-200">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="relative text-left">
                                    <div className="flex items-center gap-4 mb-8 text-left">
                                        <div className="p-4 bg-gray-50 text-green-600 rounded-2xl border border-gray-100">
                                            <PackageCheck className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-black text-gray-900 leading-tight mb-1">{pickup.id}</h3>
                                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
                                                {pickup.customer} <span className="text-gray-300 font-normal">·</span> {pickup.date}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-green-50/30 rounded-3xl p-6 border border-green-100/50 mb-8 text-left relative overflow-hidden">
                                        <div className="flex items-center gap-3 mb-3">
                                            <ClipboardCheck className="w-4 h-4 text-green-600" />
                                            <span className="font-black text-[10px] text-green-600/60 uppercase tracking-widest">Status Persiapan Barang:</span>
                                        </div>
                                        <p className="text-sm font-black text-green-900 leading-relaxed pl-7">Barang sudah di-staging di <span className="text-green-600">{pickup.area}</span>. Lakukan verifikasi identitas saat pelanggan tiba.</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 text-left">
                                        <button 
                                            onClick={() => handlePickup(pickup.id)} 
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.15em] flex justify-center items-center gap-3 shadow-lg shadow-green-600/20 active:scale-95 transition-all outline-none"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Konfirmasi Penyerahan &rarr;
                                        </button>
                                        <button onClick={() => alert('Mencetak struk serah terima...')} className="w-14 h-14 bg-white border border-gray-100 text-gray-400 rounded-2xl flex items-center justify-center hover:text-green-600 hover:bg-green-50 transition-all shadow-sm active:scale-95">
                                            <Printer className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>

            {/* Modal Assignment (Penugasan Supir) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] text-left">
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-50 bg-gray-50/30">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4 tracking-tight">
                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                        <Truck className="w-6 h-6" />
                                    </div>
                                    Penugasan Kurir
                                </h3>
                                <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mt-3 ml-[60px]">Invoice Ref: {selectedOrder?.id}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto">
                            <form onSubmit={handleAssign} className="space-y-10 focus:outline-none">
                                <div className="space-y-8">
                                    <div className="text-left">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Personel Driver / Supir</label>
                                        <div className="relative group/input">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-blue-600 transition-colors pointer-events-none"><User className="w-5 h-5" /></span>
                                            <input
                                                type="text" required
                                                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-[28px] focus:border-blue-500 focus:bg-white outline-none transition-all font-black text-gray-800 shadow-inner"
                                                placeholder="Ketik Nama Supir Toko..."
                                                value={assignment.driver}
                                                onChange={e => setAssignment({ ...assignment, driver: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 text-left">
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tanggal Distribusi</label>
                                            <div className="relative group/input">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-blue-600 transition-colors pointer-events-none"><Calendar className="w-5 h-5" /></span>
                                                <input
                                                    type="date" required
                                                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-[28px] focus:border-blue-500 focus:bg-white outline-none transition-all font-black text-gray-800 shadow-inner"
                                                    value={assignment.date}
                                                    onChange={e => setAssignment({ ...assignment, date: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Waktu Keberangkatan</label>
                                            <div className="relative group/input">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-blue-600 transition-colors pointer-events-none"><Clock className="w-5 h-5" /></span>
                                                <input
                                                    type="time" required
                                                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-[28px] focus:border-blue-500 focus:bg-white outline-none transition-all font-black text-gray-800 shadow-inner font-mono"
                                                    value={assignment.time}
                                                    onChange={e => setAssignment({ ...assignment, time: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 flex flex-col sm:flex-row gap-4 border-t border-gray-50">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-5 text-gray-400 font-black text-[10px] uppercase tracking-widest bg-gray-50 rounded-full hover:bg-gray-100 transition-all text-center border border-gray-100"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-5 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.15em] rounded-full shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] text-center"
                                    >
                                        Konfirmasi & Tugaskan &rarr;
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

