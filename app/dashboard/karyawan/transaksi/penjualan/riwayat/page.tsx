'use client';
import React, { useState, useEffect } from 'react';
import {
    ShoppingCart, Printer, Search, ArrowLeft, Calendar, 
    User, MapPin, CheckCircle2, Package, ChevronRight
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Link from 'next/link';

export default function RiwayatPenjualanKaryawanPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchHistoryData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/karyawan/transaksi/penjualan?history=true');
            const data = await res.json();
            if (data.success) {
                setHistory(data.deliveries.concat(data.pickups));
            }
        } catch (error) {
            console.error("Fetch History Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistoryData();
    }, []);

    const generateInvoicePDF = (order: any) => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(234, 88, 12);
        doc.text("TB. LUMBUNG JAYA", 14, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Pusat Bahan Bangunan & Alat Teknik Terlengkap", 14, 28);
        doc.line(14, 32, 196, 32);

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("SURAT JALAN / INVOICE (RIWAYAT)", 14, 45);
        
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
            headStyles: { fillColor: [234, 88, 12], textColor: 255, lineWidth: 0.5, lineColor: [255, 255, 255] },
            styles: { fontSize: 9, cellPadding: 5, lineWidth: 0.3, lineColor: [220, 220, 220] },
            columnStyles: { 0: { cellWidth: 20, halign: 'center' }, 2: { cellWidth: 25, halign: 'center' }, 3: { cellWidth: 45, halign: 'right' } }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.text("* Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan.", 14, finalY);
        doc.setFont("helvetica", "bold");
        doc.text("Tanda Terima,", 165, finalY + 20, { align: 'center' });
        doc.text(`( ${order.customer} )`, 165, finalY + 45, { align: 'center' });

        doc.save(`${order.id}.pdf`);
    };

    const filteredHistory = history.filter(item => 
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="text-left">
                    <Link href="/dashboard/karyawan/transaksi/penjualan" className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-widest mb-4 hover:gap-3 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Kembali Ke Monitoring
                    </Link>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-3">Riwayat Penjualan</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Daftar lengkap transaksi yang telah berhasil diselesaikan.</p>
                </div>

                <div className="relative group w-full md:w-80">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors">
                        <Search className="w-5 h-5" />
                    </span>
                    <input 
                        type="text" 
                        placeholder="Cari Invoice / Nama..."
                        className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-3xl outline-none focus:border-orange-500 focus:shadow-xl focus:shadow-orange-500/5 transition-all font-bold text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="py-40 flex flex-col items-center justify-center gap-4 text-gray-400">
                    <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
                    <p className="font-extrabold text-[10px] uppercase tracking-widest">Memuat Riwayat Transaksi...</p>
                </div>
            ) : filteredHistory.length === 0 ? (
                <div className="bg-white rounded-[40px] p-20 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-400 gap-4">
                    <Package className="w-12 h-12 opacity-20" />
                    <p className="font-bold text-center">Tidak ada data riwayat ditemukan.<br/><span className="text-sm font-medium opacity-60">Pastikan transaksi sudah dikonfirmasi SELESAI.</span></p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredHistory.map((item) => (
                        <div key={item.id} className="bg-white rounded-[40px] p-10 shadow-xl border border-gray-100 relative group overflow-hidden transition-all hover:border-orange-200">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-700"></div>

                            <div className="relative">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-gray-50 text-gray-400 rounded-2xl border border-gray-100 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                            <ShoppingCart className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-black text-gray-900 leading-tight mb-1">{item.id}</h3>
                                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                                                {item.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100">
                                            SELESAI
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8 text-left">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none ml-1">Pelanggan</p>
                                        <div className="flex items-center gap-3">
                                            <User className="w-4 h-4 text-orange-600" />
                                            <p className="text-sm font-black text-gray-800">{item.customer}</p>
                                        </div>
                                    </div>
                                    {item.address && (
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none ml-1">Tujuan</p>
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                                                <p className="text-[12px] font-medium text-gray-600 leading-relaxed">{item.address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Verified</p>
                                    </div>
                                    <button 
                                        onClick={() => generateInvoicePDF(item)} 
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-orange-100 shadow-sm"
                                    >
                                        <Printer className="w-4 h-4" /> Cetak Ulang
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
