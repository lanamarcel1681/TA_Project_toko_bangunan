'use client';
import React, { useState, useEffect } from 'react';
import {
    ShoppingCart, Printer, CalendarClock, PackageCheck, AlertTriangle,
    X, Truck, User, Calendar, Clock, MapPin, CheckCircle2, ChevronRight,
    Store, ClipboardCheck, Timer, History, Loader2, MessageCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Link from 'next/link';
import { useToast } from '@/app/components/Toast';

export default function TransaksiPenjualanKaryawanPage() {
    const { showToast } = useToast();
    const [deliveries, setDeliveries] = useState<any[]>([]);
    const [pickups, setPickups] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Confirmation Modal states
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'ASSIGN_DRIVER' | 'CONFIRM_PICKUP' | null>(null);
    const [confirmTarget, setConfirmTarget] = useState<any>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const [assignment, setAssignment] = useState({
        driverId: '',
        vehicle: 'Motor Toko / Pick Up', // Default or mocked
        date: '',
        time: '',
        note: ''
    });

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/pegawai');
            const data = await res.json();
            if (Array.isArray(data)) {
                // Filter out Owner / Pemilik
                const filtered = data.filter(p => {
                    const role = p.jabatan?.nama_jabatan?.toLowerCase();
                    return role !== 'owner' && role !== 'pemilik toko';
                });
                setEmployees(filtered);
            }
        } catch (error) {
            console.error("Fetch Employees Error:", error);
        }
    };

    const generateInvoicePDF = (order: any) => {
        const doc = new jsPDF();

        // Header Branding
        doc.setFontSize(22);
        doc.setTextColor(234, 88, 12); // Orange-600
        doc.text("TB. LUMBUNG JAYA", 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Pusat Bahan Bangunan & Alat Teknik Terlengkap", 14, 28);
        doc.line(14, 32, 196, 32);

        // Transaction Info
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("SURAT JALAN / INVOICE", 14, 45);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`No. Invoice : ${order.id}`, 14, 52);
        doc.text(`Tanggal     : ${order.date}`, 14, 57);
        doc.text(`Kepada      : ${order.customer}`, 14, 62);

        if (order.address) {
            doc.text("Alamat      :", 14, 67);
            const splitAddress = doc.splitTextToSize(order.address, 140);
            doc.text(splitAddress, 35, 67);
        }

        // Table calculation (Total costs are in the raw data)
        // Note: The 'order' object now has 'detail' from the updated API
        const tableData = (order.rawDetail || []).map((item: any, index: number) => [
            index + 1,
            item.barang.nama_barang,
            `${item.jumlah_penjualan_barang}`,
            `Rp ${item.total_harga.toLocaleString('id-ID')}`
        ]);

        autoTable(doc, {
            startY: 85,
            head: [['No', 'Deskripsi Barang', 'Qty', 'Subtotal']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [234, 88, 12],
                textColor: 255,
                lineWidth: 0.5,
                lineColor: [255, 255, 255]
            },
            styles: {
                fontSize: 9,
                cellPadding: 5,
                lineWidth: 0.3,
                lineColor: [220, 220, 220]
            },
            columnStyles: {
                0: { cellWidth: 15, halign: 'center' },
                2: { cellWidth: 25, halign: 'center' },
                3: { cellWidth: 45, halign: 'right' }
            }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;

        // Footer & Signature
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.text("* Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan.", 14, finalY);

        doc.setFont("helvetica", "bold");
        doc.text("Tanda Terima,", 165, finalY + 20, { align: 'center' });
        doc.text(`( ${order.customer} )`, 165, finalY + 45, { align: 'center' });

        doc.save(`${order.id}.pdf`);
    };

    const fetchMonitoringData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/karyawan/transaksi/penjualan');
            const data = await res.json();
            if (data.success) {
                setDeliveries(data.deliveries);
                setPickups(data.pickups);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMonitoringData();
        fetchEmployees();
    }, []);

    const openAssignmentModal = (id: string) => {
        setSelectedId(id);

        // AUTO-FILL LOGIC
        const now = new Date();
        const currentHour = now.getHours();

        let defaultDate = new Date();
        let defaultTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        // Jika sudah jam 4 sore (16:00) ke atas, arahkan ke BESOK jam 9 Pagi
        if (currentHour >= 16) {
            defaultDate.setDate(now.getDate() + 1);
            defaultTime = "09:00";
        }

        const dateString = defaultDate.toISOString().split('T')[0];

        setAssignment(prev => ({
            ...prev,
            date: dateString,
            time: defaultTime
        }));

        setIsModalOpen(true);
    };

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();

        // CONSTRAINT: Tidak bisa kirim dihari yang sama kalau belum jam 4 sore
        const today = new Date();
        const selectedDate = new Date(assignment.date);
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate.getTime() === today.getTime()) {
            const currentHour = new Date().getHours();
            if (currentHour < 16) {
                showToast('Penugasan hari yang sama hanya diperbolehkan setelah pukul 16:00.', 'error');
                return;
            }
        }

        setConfirmAction('ASSIGN_DRIVER');
        setConfirmTarget(selectedId);
        setShowConfirmModal(true);
    };

    const handlePickup = (id: string) => {
        setConfirmAction('CONFIRM_PICKUP');
        setConfirmTarget(id);
        setShowConfirmModal(true);
    };

    const executeAction = async () => {
        if (!confirmAction || !confirmTarget) return;
        setIsActionLoading(true);

        try {
            if (confirmAction === 'ASSIGN_DRIVER') {
                const res = await fetch('/api/karyawan/transaksi/penjualan', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: confirmTarget,
                        action: 'ASSIGN_DRIVER',
                        details: assignment
                    })
                });
                const data = await res.json();
                if (data.success) {
                    showToast(`Pesanan ${confirmTarget} berhasil ditugaskan!`, 'success');
                    fetchMonitoringData();
                    setIsModalOpen(false);
                    setShowConfirmModal(false);
                    setAssignment({ driverId: '', vehicle: 'Motor Toko / Pick Up', date: '', time: '', note: '' });
                } else {
                    showToast(data.error || 'Gagal menugaskan driver', 'error');
                }
            } else if (confirmAction === 'CONFIRM_PICKUP') {
                const res = await fetch('/api/karyawan/transaksi/penjualan', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: confirmTarget, action: 'CONFIRM_PICKUP' })
                });
                const data = await res.json();
                if (data.success) {
                    showToast(`Penyerahan pesanan ${confirmTarget} berhasil dikonfirmasi!`, 'success');
                    fetchMonitoringData();
                    setShowConfirmModal(false);
                } else {
                    showToast(data.error || 'Gagal konfirmasi penyerahan', 'error');
                }
            }
        } catch (error) {
            showToast('Terjadi kesalahan sistem operasional', 'error');
        } finally {
            setIsActionLoading(false);
        }
    };

    const selectedOrder = deliveries.find(d => d.id === selectedId);

    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight leading-none mb-2 md:mb-3">Monitoring Penjualan</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Kelola persiapan barang dan penugasan driver untuk pesanan pelanggan.</p>
                </div>
                <Link
                    href="/dashboard/karyawan/transaksi/penjualan/riwayat"
                    className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-3xl text-gray-600 hover:text-orange-600 hover:border-orange-100 hover:bg-orange-50/50 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm group"
                >
                    <History className="w-4 h-4 group-hover:rotate-[-20deg] transition-transform" /> Lihat Riwayat Penjualan
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                {/* Kolom Pengiriman (Diantar) */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center border border-orange-100">
                                <Truck className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Antar Alamat</h2>
                        </div>
                        <span className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-600/20">{deliveries.length} PESANAN</span>
                    </div>

                    <div className="space-y-6">
                        {deliveries.length === 0 ? (
                            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 font-bold">
                                Tidak ada pengiriman yang tertunda.
                            </div>
                        ) : (
                            deliveries.map((delivery) => (
                                <div key={delivery.id} className="bg-white rounded-[24px] md:rounded-[40px] p-5 md:p-10 shadow-xl border border-gray-100 relative group overflow-hidden transition-all hover:border-orange-200">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-700"></div>

                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-4 md:mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-gray-50 text-orange-600 rounded-2xl border border-gray-100">
                                                    <ShoppingCart className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-gray-900 leading-tight mb-1">{delivery.id}</h3>
                                                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                                                        {delivery.customer} 
                                                        <a 
                                                            href={`https://wa.me/${delivery.phone?.replace(/^0/, '62').replace(/^\+/, '')}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center p-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors ml-1"
                                                            title="Hubungi via WhatsApp"
                                                        >
                                                            <MessageCircle className="w-3 h-3" />
                                                        </a>
                                                        <span className="text-gray-300 font-normal">·</span> {delivery.date}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50/50 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-100 mb-4 md:mb-8 text-left">
                                            <div className="flex items-center gap-3 mb-3">
                                                <MapPin className="w-4 h-4 text-orange-600" />
                                                <span className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Alamat Tujuan Pengiriman:</span>
                                            </div>
                                            <p className="text-sm font-black text-gray-800 leading-relaxed pl-7">{delivery.address}</p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => openAssignmentModal(delivery.id)}
                                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.15em] flex justify-center items-center gap-3 shadow-lg shadow-orange-600/20 active:scale-95 transition-all"
                                            >
                                                <CalendarClock className="w-4 h-4" /> Tugaskan Driver &rarr;
                                            </button>
                                            <button
                                                onClick={() => generateInvoicePDF(delivery)}
                                                className="w-14 h-14 bg-white border border-gray-100 text-gray-400 rounded-2xl flex items-center justify-center hover:text-orange-600 hover:bg-orange-50 transition-all shadow-sm active:scale-95"
                                            >
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
                            <div key={pickup.id} className="bg-white rounded-[24px] md:rounded-[40px] p-5 md:p-10 shadow-xl border border-gray-100 relative group overflow-hidden transition-all hover:border-green-200">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="relative text-left">
                                    <div className="flex items-center gap-4 mb-4 md:mb-8 text-left">
                                        <div className="p-4 bg-gray-50 text-green-600 rounded-2xl border border-gray-100">
                                            <PackageCheck className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-black text-gray-900 leading-tight mb-1">{pickup.id}</h3>
                                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
                                                {pickup.customer} 
                                                <a 
                                                    href={`https://wa.me/${pickup.phone?.replace(/^0/, '62').replace(/^\+/, '')}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center p-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors ml-1"
                                                    title="Hubungi via WhatsApp"
                                                >
                                                    <MessageCircle className="w-3 h-3" />
                                                </a>
                                                <span className="text-gray-300 font-normal">·</span> {pickup.date}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-green-50/30 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-green-100/50 mb-4 md:mb-8 text-left relative overflow-hidden">
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
                                        <button
                                            onClick={() => generateInvoicePDF(pickup)}
                                            className="w-14 h-14 bg-white border border-gray-100 text-gray-400 rounded-2xl flex items-center justify-center hover:text-green-600 hover:bg-green-50 transition-all shadow-sm active:scale-95"
                                        >
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
                                    <div className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20">
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
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-orange-600 transition-colors pointer-events-none"><User className="w-5 h-5" /></span>
                                            <select
                                                required
                                                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-[28px] focus:border-orange-500 focus:bg-white outline-none transition-all font-black text-gray-800 shadow-inner appearance-none"
                                                value={assignment.driverId}
                                                onChange={e => setAssignment({ ...assignment, driverId: e.target.value })}
                                            >
                                                <option value="">Pilih Personel Driver...</option>
                                                {employees.map(emp => (
                                                    <option key={emp.id_pegawai} value={emp.id_pegawai}>
                                                        {emp.nama_pegawai} - {emp.jabatan?.nama_jabatan}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-5 h-5 text-gray-300 rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 text-left">
                                        <div>
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tanggal Distribusi</label>
                                            <div className="relative group/input">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-orange-600 transition-colors pointer-events-none"><Calendar className="w-5 h-5" /></span>
                                                <input
                                                    type="date" required
                                                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-[28px] focus:border-orange-500 focus:bg-white outline-none transition-all font-black text-gray-800 shadow-inner"
                                                    value={assignment.date}
                                                    onChange={e => setAssignment({ ...assignment, date: e.target.value })}
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
                                        className="flex-[2] py-5 bg-orange-600 text-white font-black text-[10px] uppercase tracking-[0.15em] rounded-full shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-[0.98] text-center"
                                    >
                                        Konfirmasi & Tugaskan &rarr;
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
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 rotate-12 group hover:rotate-0 transition-transform ${confirmAction === 'ASSIGN_DRIVER' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                            {confirmAction === 'ASSIGN_DRIVER' ? <Truck className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                            {confirmAction === 'ASSIGN_DRIVER' ? 'Konfirmasi Driver?' : 'Konfirmasi Ambil?'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            {confirmAction === 'ASSIGN_DRIVER' 
                                ? `Yakin ingin menugaskan driver untuk pesanan ${confirmTarget}? Pastikan jadwal dan personel sudah benar.` 
                                : `Konfirmasi bahwa barang untuk pesanan ${confirmTarget} sudah benar-benar diserahkan kepada pelanggan.`}
                        </p>
                        
                        <div className="flex flex-col w-full gap-3">
                            <button 
                                onClick={executeAction}
                                disabled={isActionLoading}
                                className={`w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 ${confirmAction === 'ASSIGN_DRIVER' ? 'bg-orange-600 shadow-orange-600/20 hover:bg-orange-700' : 'bg-green-600 shadow-green-600/20 hover:bg-green-700'}`}
                            >
                                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (confirmAction === 'ASSIGN_DRIVER' ? 'Ya, Tugaskan' : 'Ya, Konfirmasi Penyerahan')}
                            </button>
                            <button 
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setConfirmAction(null);
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

