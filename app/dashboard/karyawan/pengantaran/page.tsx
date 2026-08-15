'use client'
import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle, Combine, Timer, MapPin, ChevronRight, Zap, AlertTriangle, Loader2, MessageCircle, CalendarClock, Calendar, Clock, X } from 'lucide-react';
import { useToast } from '@/app/components/Toast';

export default function ManajemenPengantaranPage() {
    const { showToast } = useToast();
    const [missions, setMissions] = useState<any[]>([]);
    const [proposals, setProposals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmType, setConfirmType] = useState<'COMPLETE_SINGLE' | 'COMPLETE_BATCH' | 'APPROVE_ROUTE' | null>(null);
    const [confirmTarget, setConfirmTarget] = useState<any>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const [batasWaktuPengantaran, setBatasWaktuPengantaran] = useState<string>('16:00');
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [rescheduleData, setRescheduleData] = useState<{ ids: string[], date: string, time: string, isBatch: boolean }>({ ids: [], date: '', time: '', isBatch: false });

    const isBeforeDeliveryDay = (departureTime: string | null) => {
        if (!departureTime) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deliveryDate = new Date(departureTime);
        deliveryDate.setHours(0, 0, 0, 0);
        return today < deliveryDate;
    };

    const fetchMissions = async () => {
        try {
            setLoading(true);

            // Ambil ID pegawai dari session API
            let pegawaiId: number | null = null;
            try {
                const sessionRes = await fetch('/api/auth/session');
                if (sessionRes.ok) {
                    const session = await sessionRes.json();
                    pegawaiId = session?.id || null;
                }
            } catch { }

            const url = pegawaiId
                ? `/api/karyawan/pengantaran?pegawaiId=${pegawaiId}`
                : '/api/karyawan/pengantaran';

            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setMissions(data.missions);
                setProposals(prevProposals => {
                    const newProposals = data.proposals || [];
                    return newProposals.map((newP: any) => {
                        const existing = prevProposals.find(p => p.id === newP.id);
                        return existing ? { ...newP, isApproved: existing.isApproved } : newP;
                    });
                });
            }
        } catch (error) {
            console.error("Fetch Missions Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPengaturan = async () => {
        try {
            const res = await fetch('/api/pengaturan');
            const data = await res.json();
            if (data.success && data.data) {
                setBatasWaktuPengantaran(data.data.batas_waktu_pengantaran || '16:00');
            }
        } catch (error) { }
    };

    React.useEffect(() => {
        fetchMissions();
        fetchPengaturan();
    }, []);

    const handleSelesai = (id: string) => {
        setConfirmType('COMPLETE_SINGLE');
        setConfirmTarget(id);
        setShowConfirmModal(true);
    };

    const handleSetujui = (proposal: any) => {
        setConfirmType('APPROVE_ROUTE');
        setConfirmTarget(proposal);
        setShowConfirmModal(true);
    };

    const handleCompleteBatch = (missionIds: string[], proposalId: string) => {
        setConfirmType('COMPLETE_BATCH');
        setConfirmTarget({ missionIds, proposalId });
        setShowConfirmModal(true);
    };

    const openRescheduleModal = (mission: any) => {
        const d = mission.departureTime ? new Date(mission.departureTime) : new Date();
        const dateStr = d.toISOString().split('T')[0];
        const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        setRescheduleData({ ids: [mission.id], date: dateStr, time: timeStr, isBatch: false });
        setShowRescheduleModal(true);
    };

    const openBatchRescheduleModal = (proposal: any) => {
        const firstMission = missions.find(m => m.id === proposal.orders[0].id);
        const d = firstMission?.departureTime ? new Date(firstMission.departureTime) : new Date();
        const dateStr = d.toISOString().split('T')[0];
        const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        setRescheduleData({ ids: proposal.orders.map((o: any) => o.id), date: dateStr, time: timeStr, isBatch: true });
        setShowRescheduleModal(true);
    };

    const handleRescheduleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const today = new Date();
        const selectedDate = new Date(rescheduleData.date);
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        // CONSTRAINT: Tidak bisa reschedule ke hari kemarin
        if (selectedDate.getTime() < today.getTime()) {
            showToast('Tidak dapat menjadwalkan pengiriman untuk tanggal yang sudah lewat.', 'error');
            return;
        }

        // CONSTRAINT: Tidak bisa reschedule ke hari yang sama kalau sudah lewat batas waktu
        if (selectedDate.getTime() === today.getTime()) {
            const currentHour = new Date().getHours();
            const currentMinute = new Date().getMinutes();
            const [batasJam, batasMenit] = batasWaktuPengantaran.split(':').map(Number);

            if (currentHour > batasJam || (currentHour === batasJam && currentMinute >= batasMenit)) {
                showToast(`Jadwal pengiriman hari yang sama tidak diperbolehkan setelah pukul ${batasWaktuPengantaran}.`, 'error');
                return;
            }
        }

        setIsActionLoading(true);
        try {
            const res = await fetch('/api/karyawan/pengantaran', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: rescheduleData.ids,
                    action: 'RESCHEDULE_DELIVERY',
                    newDate: rescheduleData.date,
                    newTime: rescheduleData.time
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast(rescheduleData.isBatch ? 'Rute gabungan berhasil dijadwalkan ulang!' : 'Pengiriman berhasil dijadwalkan ulang!', 'success');
                fetchMissions();
                setShowRescheduleModal(false);
            } else {
                showToast(data.error || 'Gagal menjadwalkan ulang pengiriman', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan sistem operasional', 'error');
        } finally {
            setIsActionLoading(false);
        }
    };

    const executeAction = async () => {
        if (!confirmType || !confirmTarget) return;
        setIsActionLoading(true);

        try {
            if (confirmType === 'APPROVE_ROUTE') {
                setProposals(prev => prev.map(p => p.id === confirmTarget.id ? { ...p, isApproved: true } : p));
                showToast('Rute gabungan telah disetujui untuk efisiensi!', 'success');
                setShowConfirmModal(false);
            } else if (confirmType === 'COMPLETE_SINGLE') {
                const res = await fetch('/api/karyawan/pengantaran', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: confirmTarget, action: 'COMPLETE_DELIVERY' })
                });
                const data = await res.json();
                if (data.success) {
                    showToast(`Tugas ${confirmTarget} telah diselesaikan!`, 'success');
                    fetchMissions();
                    setShowConfirmModal(false);
                } else {
                    showToast(data.error || 'Gagal menyelesaikan pengiriman', 'error');
                }
            } else if (confirmType === 'COMPLETE_BATCH') {
                const res = await fetch('/api/karyawan/pengantaran', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: confirmTarget.missionIds, action: 'COMPLETE_DELIVERY' })
                });
                const data = await res.json();
                if (data.success) {
                    showToast(`${confirmTarget.missionIds.length} pengiriman rute gabungan telah diselesaikan!`, 'success');
                    setProposals(prev => prev.filter(p => p.id !== confirmTarget.proposalId));
                    fetchMissions();
                    setShowConfirmModal(false);
                } else {
                    showToast(data.error || 'Gagal menyelesaikan pengiriman massal', 'error');
                }
            }
        } catch (error) {
            showToast('Terjadi kesalahan sistem operasional', 'error');
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Monitoring Pengantaran</h1>
                <p className="text-gray-500 font-medium">Kelola tugas pengiriman aktif dan optimasi rute kurir operasional toko.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Aktivitas Pengantaran Aktif */}
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                        <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
                        <p className="font-extrabold text-[10px] uppercase tracking-widest">Sedang memproses data tugas...</p>
                    </div>
                ) : missions.length === 0 ? (
                    <div className="col-span-full bg-white rounded-[40px] p-20 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-400 gap-4">
                        <Truck className="w-12 h-12 opacity-20" />
                        <p className="font-bold text-center">Tidak ada pengantaran aktif saat ini.<br /><span className="text-sm font-medium opacity-60">Tugas akan muncul di sini setelah driver ditugaskan pada dashboard Penjualan.</span></p>
                    </div>
                ) : (
                    missions.map(mission => (
                        <div key={mission.id} className="bg-white rounded-[40px] p-10 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50/50 px-3 py-1.5 rounded-full border border-orange-100">{mission.id}</span>
                                </div>
                                <span className="text-[10px] font-black text-gray-300 font-mono">AKTIF</span>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-start mb-2 ml-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Tanggal Pengantaran</p>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <p className="text-[10px] font-black leading-none uppercase">
                                            {mission.departureTime ? new Date(mission.departureTime).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-start mb-1.5 ml-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Driver Barang</p>
                                    <p className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md leading-none uppercase">{mission.driver}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-black text-gray-900 leading-tight">{mission.customer}</h3>
                                    <a
                                        href={`https://wa.me/${mission.phone?.replace(/^0/, '62').replace(/^\+/, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center p-1.5 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                                        title="Hubungi via WhatsApp"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                    </a>
                                </div>
                                <div className="flex items-start gap-2 mt-2 text-gray-500">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                                    <p className="text-sm font-medium leading-relaxed">{mission.address}</p>
                                </div>
                            </div>

                            <div className="mb-8 p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
                                        <Timer className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Durasi Perjalanan</p>
                                        <p className="text-sm font-black text-gray-800 leading-none">{mission.estimasi}</p>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-gray-200"></div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Prediksi Sampai</p>
                                        <p className="text-sm font-black text-gray-800 leading-none">{mission.eta}</p>
                                    </div>
                                </div>
                            </div>

                            {(() => {
                                const isInApprovedRoute = proposals.some(p => p.isApproved && p.orders.some((o: any) => o.id === mission.id));
                                const isTooEarly = isBeforeDeliveryDay(mission.departureTime);

                                return isInApprovedRoute ? (
                                    <div className="w-full bg-gray-100 text-gray-400 py-4 rounded-full flex justify-center items-center gap-3 font-black text-[10px] uppercase tracking-widest border border-gray-200 cursor-not-allowed">
                                        <Combine className="w-4 h-4" /> Bagian dari Rute Gabungan
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openRescheduleModal(mission)}
                                            className="w-16 bg-orange-50 text-orange-600 hover:bg-orange-100 py-4 rounded-full flex justify-center items-center gap-3 font-black text-[10px] uppercase shadow-sm active:scale-95 transition-all outline-none flex-shrink-0"
                                            title="Jadwalkan Ulang"
                                        >
                                            <CalendarClock className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => !isTooEarly && handleSelesai(mission.id)}
                                            disabled={isTooEarly}
                                            title={isTooEarly ? "Hanya dapat diselesaikan pada hari pengiriman yang dijadwalkan" : ""}
                                            className={`flex-1 py-4 rounded-full flex justify-center items-center gap-3 font-black text-[10px] uppercase tracking-[0.15em] transition-all outline-none ${isTooEarly
                                                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                                                    : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 active:scale-95'
                                                }`}
                                        >
                                            {isTooEarly ? <Timer className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                            {isTooEarly ? 'Belum Waktunya' : 'Selesaikan Pengiriman \u2192'}
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    ))
                )}

                {/* Penggabungan Pengiriman Suggestion */}
                {proposals.length > 0 && proposals.map(proposal => (
                    <div key={proposal.id} className="bg-orange-600 rounded-[40px] p-10 shadow-2xl shadow-orange-600/30 relative overflow-hidden group">
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
                            <p className="text-orange-100 text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1 leading-none">Rute Berdekatan Terdeteksi</p>
                            <h3 className="text-xl font-black leading-tight mb-4">{proposal.title}</h3>
                            <div className="space-y-3">
                                {proposal.orders.map((order: any, idx: number) => (
                                    <div key={idx} className="bg-white/10 p-4 rounded-2xl border border-white/10 flex items-center justify-between group/item hover:bg-white/20 transition-all cursor-default">
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-tight text-orange-200">{order.id} — {order.name}</p>
                                            <p className="text-xs font-bold text-white mt-0.5">{order.addr}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/40 group-hover/item:text-white transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {proposal.isApproved ? (
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleCompleteBatch(proposal.orders.map((o: any) => o.id), proposal.id)}
                                    className="w-full bg-green-500 text-white py-4 rounded-full flex justify-center items-center gap-3 font-black text-[10px] uppercase tracking-[0.15em] shadow-xl hover:bg-green-600 active:scale-95 transition-all outline-none"
                                >
                                    <CheckCircle className="w-4 h-4" /> Selesaikan Seluruh Rute &rarr;
                                </button>
                                <button
                                    onClick={() => openBatchRescheduleModal(proposal)}
                                    className="w-full bg-white/10 text-white py-3 rounded-full flex justify-center items-center gap-3 font-black text-[10px] uppercase tracking-[0.15em] hover:bg-white/20 transition-all outline-none border border-white/20"
                                >
                                    <CalendarClock className="w-4 h-4" /> Jadwal Ulang Rute
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleSetujui(proposal)}
                                    className="w-full bg-white text-orange-600 py-4 rounded-full flex justify-center items-center gap-3 font-black text-[10px] uppercase tracking-[0.15em] shadow-xl hover:bg-orange-50 active:scale-95 transition-all outline-none"
                                >
                                    <Combine className="w-4 h-4" /> Setujui Penggabungan &rarr;
                                </button>
                                <button
                                    onClick={() => openBatchRescheduleModal(proposal)}
                                    className="w-full bg-orange-700 text-orange-100 py-3 rounded-full flex justify-center items-center gap-3 font-black text-[10px] uppercase tracking-[0.15em] hover:bg-orange-800 transition-all outline-none"
                                >
                                    <CalendarClock className="w-4 h-4" /> Jadwal Ulang Rute
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* Reschedule Modal */}
            {showRescheduleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity pointer-events-auto" onClick={() => setShowRescheduleModal(false)}></div>
                    <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] text-left">
                        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-50 bg-gray-50/30">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4 tracking-tight">
                                    <div className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20">
                                        <CalendarClock className="w-6 h-6" />
                                    </div>
                                    Jadwal Ulang
                                </h3>
                                <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mt-3 ml-[60px]">
                                    {rescheduleData.isBatch ? `${rescheduleData.ids.length} Pesanan` : `Invoice Ref: ${rescheduleData.ids[0]}`}
                                </p>
                            </div>
                            <button onClick={() => setShowRescheduleModal(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-10 overflow-y-auto">
                            <form onSubmit={handleRescheduleSubmit} className="space-y-10 focus:outline-none">
                                <div className="grid grid-cols-2 gap-8 text-left">
                                    <div>
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tanggal Keberangkatan</label>
                                        <div className="relative group/input">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-orange-600 transition-colors pointer-events-none"><Calendar className="w-5 h-5" /></span>
                                            <input
                                                type="date" required
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-[28px] focus:border-orange-500 focus:bg-white outline-none transition-all font-black text-gray-800 shadow-inner"
                                                value={rescheduleData.date}
                                                onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                                onInvalid={(e) => {
                                                    e.preventDefault();
                                                    showToast('Tanggal keberangkatan tidak valid atau sudah lewat.', 'error');
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Waktu Keberangkatan</label>
                                        <div className="relative group/input">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-orange-600 transition-colors pointer-events-none"><Clock className="w-5 h-5" /></span>
                                            <input
                                                type="time" required
                                                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-[28px] focus:border-orange-500 focus:bg-white outline-none transition-all font-black text-gray-800 shadow-inner font-mono"
                                                value={rescheduleData.time}
                                                onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 flex flex-col sm:flex-row gap-4 border-t border-gray-50">
                                    <button
                                        type="button"
                                        onClick={() => setShowRescheduleModal(false)}
                                        className="flex-1 py-5 text-gray-400 font-black text-[10px] uppercase tracking-widest bg-gray-50 rounded-full hover:bg-gray-100 transition-all text-center border border-gray-100"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isActionLoading}
                                        className="flex-[2] py-5 bg-orange-600 text-white font-black text-[10px] uppercase tracking-[0.15em] rounded-full shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-[0.98] text-center disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                        Konfirmasi Jadwal Baru &rarr;
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 text-center">
                    <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 rotate-12 group hover:rotate-0 transition-transform ${confirmType === 'APPROVE_ROUTE' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-500'}`}>
                            {confirmType === 'APPROVE_ROUTE' ? <Combine className="w-10 h-10" /> : <CheckCircle className="w-10 h-10" />}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                            {confirmType === 'APPROVE_ROUTE' ? 'Setujui Rute?' : 'Selesaikan Tugas?'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            {confirmType === 'APPROVE_ROUTE'
                                ? 'Konfirmasi penggabungan rute untuk mengoptimalkan waktu pengiriman driver.'
                                : 'Pastikan barang sudah benar-benar sampai dan diterima dengan baik oleh pelanggan.'}
                        </p>

                        <div className="flex flex-col w-full gap-3">
                            <button
                                onClick={executeAction}
                                disabled={isActionLoading}
                                className={`w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 ${confirmType === 'APPROVE_ROUTE' ? 'bg-orange-600 shadow-orange-600/20 hover:bg-orange-700' : 'bg-green-600 shadow-green-600/20 hover:bg-green-700'}`}
                            >
                                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (confirmType === 'APPROVE_ROUTE' ? 'Ya, Setujui Rute' : 'Ya, Sudah Selesai')}
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setConfirmType(null);
                                    setConfirmTarget(null);
                                }}
                                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

