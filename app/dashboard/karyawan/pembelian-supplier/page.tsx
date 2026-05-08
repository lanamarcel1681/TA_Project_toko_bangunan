'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
    Phone, Building2, RefreshCw, Pencil, ArrowRight, Save, LayoutGrid, List,
    MessageCircle, FilePlus2, Printer, Truck, Package, DollarSign, Calendar, User, X,
    CheckCircle2, AlertCircle, Search, Plus, Trash2, Edit2, Eye, Wrench, Clock, ShoppingCart,
    Store, FileText, ChevronDown, ChevronRight, AlertTriangle
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '@/app/components/Toast';

const WhatsAppLogo = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

interface Supplier {
    id_supplier: number;
    nama_supplier: string;
    nomor_telepon_supplier: string;
    nama_perusahaan_supplier: string;
}

interface Barang {
    id_barang: number;
    nama_barang: string;
    harga_barang: number;
    stok_barang: number;
    minimum_barang: number;
    satuan: { satuan_barang: string };
    kategori: { nama_kategori: string };
    barang_supplier: { id_supplier: number }[];
}

interface POItem {
    id: string;
    id_barang: number | null;
    namaBarang: string;
    jumlah: number;
    harga_satuan: number;
}

interface TransaksiDetail {
    id_detailtransaksipembelian: number;
    jumlah_pembelian_barang: number;
    harga_satuan_barang: number;
    barang: Barang;
}

interface Transaksi {
    id_transaksipembelian: number;
    tanggal_pembelian: string;
    total_biaya: number;
    supplier: Supplier;
    pegawai: { nama_pegawai: string };
    detail: TransaksiDetail[];
}

export default function TransaksiPembelianSupplierPage() {
    const [activeTab, setActiveTab] = useState<'history' | 'suggestion'>('history');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedTransaksi, setSelectedTransaksi] = useState<Transaksi | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const { showToast } = useToast();

    // Form state
    const [items, setItems] = useState<POItem[]>([{ id: '1', id_barang: null, namaBarang: '', jumlah: 1, harga_satuan: 0 }]);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
    const [namaSupplier, setNamaSupplier] = useState('');
    const [nomorTelepon, setNomorTelepon] = useState('');
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);

    // Data from DB
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [barangList, setBarangList] = useState<Barang[]>([]);
    const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');
    const [searchBarang, setSearchBarang] = useState('');

    const [currentUser, setCurrentUser] = useState<{ id: number; name: string; role: string } | null>(null);

    const getPegawaiId = (): number => {
        return currentUser?.id || 1;
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [suppRes, barangRes, transaksiRes] = await Promise.all([
                fetch('/api/supplier'),
                fetch('/api/barang'),
                fetch(`/api/pembelian${search ? `?search=${encodeURIComponent(search)}` : ''}`),
            ]);
            if (suppRes.ok) setSuppliers(await suppRes.json());
            if (barangRes.ok) setBarangList(await barangRes.json());
            if (transaksiRes.ok) setTransaksiList(await transaksiRes.json());
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => setCurrentUser(data))
            .catch(console.error);
        fetchData(); 
    }, [fetchData]);

    const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = parseInt(e.target.value);
        if (isNaN(id)) {
            setSelectedSupplierId(null);
            setNamaSupplier('');
            setNomorTelepon('');
            return;
        }
        const sup = suppliers.find(s => s.id_supplier === id);
        if (sup) {
            setSelectedSupplierId(sup.id_supplier);
            setNamaSupplier(sup.nama_supplier);
            setNomorTelepon(sup.nomor_telepon_supplier);
        }
    };

    const handleBarangChange = (itemId: string, barangId: number) => {
        const barang = barangList.find(b => b.id_barang === barangId);
        setItems(prev => prev.map(item =>
            item.id === itemId
                ? { ...item, id_barang: barangId, namaBarang: barang?.nama_barang || '', harga_satuan: barang?.harga_barang || 0 }
                : item
        ));
    };

    const addItem = () => {
        setItems(prev => [...prev, { id: Date.now().toString(), id_barang: null, namaBarang: '', jumlah: 1, harga_satuan: 0 }]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: keyof POItem, value: string | number | null) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const calculateTotal = () => items.reduce((sum, item) => sum + (item.jumlah * item.harga_satuan), 0);

    const resetForm = () => {
        setItems([{ id: '1', id_barang: null, namaBarang: '', jumlah: 1, harga_satuan: 0 }]);
        setSelectedSupplierId(null);
        setNamaSupplier('');
        setNomorTelepon('');
        setOrderDate(new Date().toISOString().split('T')[0]);
        setEditMode(false);
        setSelectedTransaksi(null);
    };

    const handleEdit = (trx: Transaksi) => {
        setEditMode(true);
        setSelectedTransaksi(trx);
        setSelectedSupplierId(trx.supplier.id_supplier);
        setNamaSupplier(trx.supplier.nama_supplier);
        setNomorTelepon(trx.supplier.nomor_telepon_supplier);
        setOrderDate(new Date(trx.tanggal_pembelian).toISOString().split('T')[0]);
        setItems(trx.detail.map(d => ({
            id: d.id_detailtransaksipembelian.toString(),
            id_barang: d.barang.id_barang,
            namaBarang: d.barang.nama_barang,
            jumlah: d.jumlah_pembelian_barang,
            harga_satuan: d.harga_satuan_barang
        })));
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/pembelian/${itemToDelete}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Transaksi berhasil dihapus', 'success');
                fetchData();
            } else {
                const err = await res.json();
                showToast(err.error || 'Gagal menghapus transaksi', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Kesalahan jaringan', 'error');
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
            setItemToDelete(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSupplierId) return showToast('Pilih perusahaan supplier terlebih dahulu!', 'error');
        if (items.some(item => !item.id_barang)) return showToast('Semua item harus dipilih barangnya!', 'error');
        if (items.some(item => item.harga_satuan < 0)) return showToast('Harga satuan tidak boleh bernilai negatif!', 'error');
        if (items.some(item => item.jumlah < 1)) return showToast('Kuantitas tidak boleh kurang dari 1!', 'error');

        setShowConfirmModal(true);
    };

    const confirmSubmit = async () => {
        setSubmitting(true);
        setShowConfirmModal(false);
        try {
            const pegawaiId = getPegawaiId();
            const url = editMode ? `/api/pembelian/${selectedTransaksi?.id_transaksipembelian}` : '/api/pembelian';
            const method = editMode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_supplier: selectedSupplierId,
                    id_pegawai: pegawaiId,
                    tanggal_pembelian: orderDate,
                    items: items.map(item => ({
                        id_barang: item.id_barang,
                        jumlah: item.jumlah,
                        harga_satuan: item.harga_satuan,
                    })),
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                showToast(err.error || `Gagal ${editMode ? 'memperbarui' : 'membuat'} PO`, 'error');
                return;
            }

            showToast(`Purchase Order berhasil ${editMode ? 'diperbarui' : 'dibuat'}!`, 'success');
            setIsModalOpen(false);
            resetForm();
            fetchData();
        } catch (err) {
            console.error(err);
            showToast('Terjadi kesalahan jaringan', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatRp = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

    const getWALink = (phone: string) => {
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0')) cleaned = '62' + cleaned.substring(1);
        return `https://wa.me/${cleaned}`;
    };

    const generateInvoicePDF = (trx: Transaksi) => {
        const doc = new jsPDF();
        const orangeColor = [234, 88, 12];
        const darkGray = [31, 41, 55];

        doc.setFontSize(22);
        doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('TOKO TB. Lumbung Jaya', 15, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text('Pusat Bahan Bangunan Berkualitas & Terpercaya', 15, 26);

        doc.setDrawColor(240);
        doc.line(15, 32, 195, 32);

        doc.setFontSize(16);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE PEMBELIAN', 15, 45);

        doc.setFontSize(10);
        doc.setTextColor(120);
        doc.setFont('helvetica', 'normal');
        doc.text(`No. PO: PO-${String(trx.id_transaksipembelian).padStart(5, '0')}`, 15, 52);
        doc.text(`Tanggal: ${formatDate(trx.tanggal_pembelian)}`, 15, 57);

        doc.setFontSize(10);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMASI SUPPLIER', 15, 72);

        doc.setFont('helvetica', 'normal');
        doc.text(trx.supplier.nama_perusahaan_supplier, 15, 78);
        doc.setTextColor(100);
        doc.text(trx.supplier.nama_supplier, 15, 83);
        doc.text(trx.supplier.nomor_telepon_supplier, 15, 88);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text('DITERBITKAN OLEH', 120, 72);
        doc.setFont('helvetica', 'normal');
        doc.text('Toko Bangunan Utama', 120, 78);
        doc.setTextColor(100);

        let printerName = currentUser?.name || 'Karyawan';
        let printerRole = currentUser?.role === 'owner' ? 'Owner' : 'Karyawan';

        doc.text(`Dicetak Oleh: ${printerName} (${printerRole})`, 120, 83);
        doc.text(`Waktu Cetak: ${new Date().toLocaleString('id-ID')}`, 120, 88);

        const tableBody = trx.detail.map(d => [
            d.barang.nama_barang,
            d.jumlah_pembelian_barang.toString(),
            formatRp(d.harga_satuan_barang),
            formatRp(d.jumlah_pembelian_barang * d.harga_satuan_barang)
        ]);

        autoTable(doc, {
            startY: 100,
            head: [['Produk', 'Jumlah', 'Harga Satuan', 'Subtotal']],
            body: tableBody,
            theme: 'grid',
            headStyles: {
                fillColor: [234, 88, 12],
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: { fontSize: 9 },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { halign: 'center' },
                2: { halign: 'right' },
                3: { halign: 'right', fontStyle: 'bold' }
            },
            foot: [[
                { content: 'TOTAL PEMBAYARAN', colSpan: 3, styles: { halign: 'left', fontStyle: 'bold' } },
                { content: formatRp(trx.total_biaya), styles: { halign: 'right', fontStyle: 'bold', fillColor: [234, 88, 12] } }
            ]]
        });

        const finalY = (doc as any).lastAutoTable.finalY + 30;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Tanda Tangan Supplier,', 30, finalY);
        doc.setFont('helvetica', 'bold');
        doc.text(trx.supplier.nama_supplier, 45, finalY + 23, { align: 'center' });
        doc.line(20, finalY + 25, 70, finalY + 25);

        doc.setFont('helvetica', 'normal');
        doc.text('Otoritas Toko,', 140, finalY);
        doc.setFont('helvetica', 'bold');
        doc.text(printerName, 155, finalY + 23, { align: 'center' });
        doc.line(130, finalY + 25, 180, finalY + 25);

        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('* Dokumen ini sah dan diterbitkan secara elektronik oleh Sistem Procurement Toko TB. Lumbung Jaya.', 15, 285);

        doc.save(`Invoice-PO-${String(trx.id_transaksipembelian).padStart(5, '0')}.pdf`);
    };

    // Filter barang yang perlu dibeli (stok <= minimum)
    const lowStockBarang = barangList.filter(b =>
        b.stok_barang <= b.minimum_barang &&
        (b.nama_barang.toLowerCase().includes(searchBarang.toLowerCase()) ||
            b.kategori.nama_kategori.toLowerCase().includes(searchBarang.toLowerCase()))
    );

    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3">Pesanan Supplier</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Manajemen Purchase Order (PO) dan pengadaan stok barang toko.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchData}
                        className="w-11 h-11 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 active:scale-95 transition-all outline-none whitespace-nowrap"
                    >
                        <FilePlus2 className="w-4 h-4" /> Buat PO Baru &rarr;
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-8 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-gray-400 hover:text-gray-600 border border-gray-100'}`}
                >
                    <List className="w-4 h-4" /> Riwayat Transaksi
                </button>
                <button
                    onClick={() => setActiveTab('suggestion')}
                    className={`px-8 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all ${activeTab === 'suggestion' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-gray-400 hover:text-gray-600 border border-gray-100'}`}
                >
                    <AlertCircle className="w-4 h-4" /> Rekomendasi Pengadaan
                    {lowStockBarang.length > 0 && <span className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px]">{lowStockBarang.length}</span>}
                </button>
            </div>

            {activeTab === 'history' ? (
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-left">No. PO & Tanggal</th>
                                    <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-left">Supplier / Perusahaan</th>
                                    <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-left">Total Pembelian</th>
                                    <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-left">Item</th>
                                    <th className="px-8 py-6 font-black text-[11px] text-gray-400 uppercase tracking-widest text-right">Manajemen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-8 py-16 text-center text-gray-400 font-bold">Memuat data transaksi...</td></tr>
                                ) : transaksiList.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                                <ShoppingCart className="w-12 h-12 text-gray-200" />
                                                <p className="font-black text-gray-500 text-lg">Tidak ada riwayat transaksi</p>
                                                <p className="text-sm">Silakan buat PO baru jika sudah melakukan pembelian</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    transaksiList.map((trx) => (
                                        <tr key={trx.id_transaksipembelian} className="hover:bg-gray-50/50 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="font-black text-blue-600 text-sm mb-1">PO-{String(trx.id_transaksipembelian).padStart(5, '0')}</div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{formatDate(trx.tanggal_pembelian)}</div>
                                            </td>
                                            <td className="px-8 py-6 text-left">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                                                        <Building2 className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-800 text-sm leading-none mb-1">{trx.supplier.nama_perusahaan_supplier}</p>
                                                        <p className="text-[10px] font-bold text-gray-400">{trx.supplier.nama_supplier} · {trx.supplier.nomor_telepon_supplier}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-black text-gray-900 text-lg tracking-tighter">{formatRp(trx.total_biaya)}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black border border-blue-100 uppercase tracking-widest whitespace-nowrap">
                                                    {trx.detail.length} item
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => generateInvoicePDF(trx)}
                                                        className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-100 transition-all shadow-sm"
                                                        title="Cetak Nota (PDF)"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </button>
                                                    <a
                                                        href={getWALink(trx.supplier.nomor_telepon_supplier)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-green-500 hover:bg-green-50 hover:border-green-100 transition-all shadow-sm"
                                                        title="Hubungi Supplier via WhatsApp"
                                                    >
                                                        <WhatsAppLogo className="w-5 h-5" />
                                                    </a>
                                                    <button
                                                        onClick={() => { setSelectedTransaksi(trx); setIsDetailOpen(true); }}
                                                        className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all shadow-sm"
                                                        title="Detail"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(trx)}
                                                        className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-100 transition-all shadow-sm"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(trx.id_transaksipembelian)}
                                                        className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-10">
                        {loading ? (
                            <div className="text-center py-10 font-black text-gray-400 uppercase tracking-widest text-[11px]">Memuat data stok...</div>
                        ) : lowStockBarang.length === 0 ? (
                            <div className="text-center py-20">
                                <CheckCircle2 className="w-16 h-16 text-green-300 mx-auto mb-4" />
                                <p className="text-xl font-black text-gray-900 mb-1 leading-none">Semua Stok Aman!</p>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Stok barang masih di atas batas minimum.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {lowStockBarang.map(barang => (
                                    <div key={barang.id_barang} className="p-6 bg-red-50/50 border border-red-100 rounded-[32px] group hover:bg-white hover:shadow-xl hover:border-red-200 transition-all duration-300 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-100/30 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-2xl bg-white border border-red-100 flex items-center justify-center text-red-500 shadow-sm">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900 leading-none mb-1">{barang.nama_barang}</h4>
                                                    <p className="text-[9px] font-black text-red-500 tracking-[0.2em] uppercase">{barang.kategori.nama_kategori}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sisa Stok</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-2xl font-black text-red-600">{barang.stok_barang}</span>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase">{barang.satuan.satuan_barang}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        resetForm();
                                                        setItems([{ id: '1', id_barang: barang.id_barang, namaBarang: barang.nama_barang, jumlah: Math.max(1, Math.ceil(barang.minimum_barang * 1.5 - barang.stok_barang)), harga_satuan: barang.harga_barang }]);

                                                        // Auto-select first supplier if available
                                                        const firstSuppId = barang.barang_supplier?.[0]?.id_supplier;
                                                        if (firstSuppId) {
                                                            const sup = suppliers.find(s => s.id_supplier === firstSuppId);
                                                            if (sup) {
                                                                setSelectedSupplierId(sup.id_supplier);
                                                                setNamaSupplier(sup.nama_supplier);
                                                                setNomorTelepon(sup.nomor_telepon_supplier);
                                                            }
                                                        }
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="px-5 py-3 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/20"
                                                >
                                                    Pesan Sekarang &rarr;
                                                </button>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-red-200/30">
                                                <div className="w-full bg-red-100/50 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-red-500 h-full rounded-full"
                                                        style={{ width: `${Math.max(5, (barang.stok_barang / (barang.minimum_barang || 1)) * 100)}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-[9px] font-bold text-red-400 mt-2 text-right uppercase tracking-widest">Minimum: {barang.minimum_barang} {barang.satuan.satuan_barang}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Create/Edit PO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[95vh] text-left animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
                                    {editMode ? <Pencil className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">
                                        {editMode ? 'Perbarui Pesanan Supplier' : 'Buat Pesanan Supplier'}
                                    </h3>
                                    <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mt-1">
                                        {editMode ? `ID Transaksi: PO-${String(selectedTransaksi?.id_transaksipembelian).padStart(5, '0')}` : 'Pengadaan Stok Barang Utama'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-10 flex-1 custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Supplier Section */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="w-4 h-4 text-blue-600" />
                                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Informasi Supplier Utama</span>
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Dropdown Nama Perusahaan */}
                                        <div className="space-y-3">
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                                Nama Perusahaan
                                            </label>
                                            <div className="relative group">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none transition-colors group-focus-within:text-blue-500" />
                                                <select
                                                    required
                                                    className="w-full pl-12 pr-10 py-4 bg-gray-50 border-2 border-transparent hover:border-gray-200 focus:bg-white rounded-[20px] focus:border-blue-500 outline-none transition-all font-bold text-sm text-gray-800 appearance-none cursor-pointer shadow-inner"
                                                    value={selectedSupplierId ?? ''}
                                                    onChange={handleSupplierChange}
                                                >
                                                    <option value="">-- Pilih Perusahaan Supplier --</option>
                                                    {suppliers.map(s => (
                                                        <option key={s.id_supplier} value={s.id_supplier}>
                                                            {s.nama_perusahaan_supplier}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Tanggal */}
                                        <div className="space-y-3">
                                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Tanggal Transaksi</label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none group-focus-within:text-blue-500" />
                                                <input
                                                    type="date" required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent hover:border-gray-200 focus:bg-white rounded-[20px] focus:border-blue-500 outline-none transition-all font-bold text-sm text-gray-800 shadow-inner"
                                                    value={orderDate}
                                                    onChange={e => setOrderDate(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Nama Supplier (auto-fill, disabled) */}
                                        <div className="space-y-3 opacity-80">
                                            <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                                Nama Supplier <span className="text-[8px] font-bold text-blue-500 italic">(Otomatis)</span>
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 pointer-events-none" />
                                                <input
                                                    type="text"
                                                    disabled
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-[20px] font-bold text-sm text-gray-400 outline-none cursor-not-allowed"
                                                    value={namaSupplier}
                                                    placeholder="Pilih perusahaan terlebih dahulu"
                                                />
                                            </div>
                                        </div>

                                        {/* Nomor Telepon (auto-fill, disabled) */}
                                        <div className="space-y-3 opacity-80">
                                            <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                                Nomor Telepon <span className="text-[8px] font-bold text-blue-500 italic">(Otomatis)</span>
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 pointer-events-none" />
                                                <input
                                                    type="text"
                                                    disabled
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-[20px] font-bold text-sm text-gray-400 outline-none cursor-not-allowed"
                                                    value={nomorTelepon}
                                                    placeholder="Pilih perusahaan terlebih dahulu"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Items Section */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <Package className="w-5 h-5 text-blue-600" />
                                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em]">Detail Items Pengadaan</h4>
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                    </div>
                                    <div className="space-y-6">
                                        {items.map((item, index) => (
                                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end bg-gray-50/50 p-8 rounded-[36px] border border-gray-100 group transition-all hover:bg-white hover:shadow-2xl hover:border-blue-100">
                                                <div className="md:col-span-1 text-center">
                                                    <span className="w-10 h-10 bg-white border border-gray-100 text-gray-400 rounded-full flex items-center justify-center font-black text-xs shadow-sm">#{index + 1}</span>
                                                </div>
                                                <div className="md:col-span-11 lg:col-span-5 space-y-3">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Pilih Produk</label>
                                                    <div className="relative group/select">
                                                        <select
                                                            required
                                                            disabled={!selectedSupplierId}
                                                            className={`w-full px-6 py-4 border border-gray-100 rounded-2xl text-sm font-bold outline-none shadow-sm appearance-none cursor-pointer transition-all ${!selectedSupplierId ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900 focus:border-blue-500 hover:border-blue-200'}`}
                                                            value={item.id_barang ?? ''}
                                                            onChange={e => handleBarangChange(item.id, parseInt(e.target.value))}
                                                        >
                                                            <option value="">{selectedSupplierId ? "-- Cari Produk --" : "-- Pilih Supplier Terlebih Dahulu --"}</option>
                                                            {barangList
                                                                .filter(b => !selectedSupplierId || b.barang_supplier.some(bs => bs.id_supplier === selectedSupplierId))
                                                                .map(b => (
                                                                    <option key={b.id_barang} value={b.id_barang}>{b.nama_barang} (Tersedia: {b.stok_barang})</option>
                                                                ))}
                                                        </select>
                                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-4 lg:col-span-2 space-y-3">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center block">Kuantitas</label>
                                                    <input
                                                        type="number" required min="1"
                                                        disabled={!selectedSupplierId}
                                                        className={`w-full px-6 py-4 border border-gray-100 rounded-2xl text-sm font-bold text-center outline-none transition-all ${!selectedSupplierId ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900 focus:border-blue-500'}`}
                                                        value={item.jumlah}
                                                        onChange={e => updateItem(item.id, 'jumlah', parseInt(e.target.value) || 1)}
                                                    />
                                                </div>
                                                <div className="md:col-span-8 lg:col-span-3 space-y-3">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Harga Satuan (Rp)</label>
                                                    <input
                                                        type="number" required min="0" step="1000"
                                                        disabled={!selectedSupplierId}
                                                        className={`w-full px-6 py-4 border border-gray-100 rounded-2xl text-sm font-bold text-right outline-none transition-all ${!selectedSupplierId ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900 focus:border-blue-500'}`}
                                                        value={item.harga_satuan}
                                                        onChange={e => updateItem(item.id, 'harga_satuan', Math.max(0, parseFloat(e.target.value) || 0))}
                                                    />
                                                </div>
                                                <div className="md:col-span-4 lg:col-span-1 flex justify-center">
                                                    <button type="button" onClick={() => removeItem(item.id)} disabled={items.length === 1} className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all disabled:opacity-0 active:scale-90">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            disabled={!selectedSupplierId}
                                            className={`w-full py-6 border-2 border-dashed rounded-[36px] font-black text-[10px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 active:scale-[0.99] mt-4 ${!selectedSupplierId ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            <Plus className="w-5 h-5" /> Tambah Transaksi Item Baru
                                        </button>
                                    </div>
                                </div>

                                {/* Summary & Actions */}
                                <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                                    <div className="bg-gray-100 px-10 py-6 rounded-[32px] border border-gray-200 group transition-all hover:bg-white hover:shadow-xl hover:border-blue-200">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1 leading-none">Total Estimasi Pembelian</span>
                                        <span className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{formatRp(calculateTotal())}</span>
                                    </div>
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 md:flex-none px-10 py-5 text-gray-500 font-black text-[11px] uppercase tracking-widest bg-gray-50 hover:bg-gray-100 rounded-full transition-all active:scale-95 border border-gray-100"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting || !selectedSupplierId}
                                            className="flex-[2] md:flex-none px-12 py-5 bg-blue-600 text-white font-black text-[11px] uppercase tracking-widest rounded-full shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
                                        >
                                            {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : (editMode ? <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" /> : <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />)}
                                            <span>{submitting ? 'Memproses...' : (editMode ? 'Simpan Perubahan' : 'Finalisasi Pesanan')}</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detail Transaksi */}
            {isDetailOpen && selectedTransaksi && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsDetailOpen(false)} />
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
                        <div className="px-12 py-10 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
                                    <ShoppingCart className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 leading-tight">Detail Purchase Order</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">PO-{String(selectedTransaksi.id_transaksipembelian).padStart(5, '0')} · {formatDate(selectedTransaksi.tanggal_pembelian)}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsDetailOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-12 space-y-8 flex-1 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 relative group/card">
                                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3">Tujuan Supplier</p>
                                    <p className="font-black text-gray-900 text-lg leading-tight mb-2">{selectedTransaksi.supplier.nama_perusahaan_supplier}</p>
                                    <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-tight">
                                        <User className="w-3 h-3" /> {selectedTransaksi.supplier.nama_supplier}
                                    </div>
                                    <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-blue-100/50">
                                        <div className="flex items-center gap-2 text-gray-500 font-bold text-xs">
                                            <Phone className="w-3 h-3" /> {selectedTransaksi.supplier.nomor_telepon_supplier}
                                        </div>
                                        <a
                                            href={getWALink(selectedTransaksi.supplier.nomor_telepon_supplier)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all active:scale-90 shadow-lg shadow-green-500/20"
                                            title="Chat WhatsApp"
                                        >
                                            <WhatsAppLogo className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Petugas Pembuat</p>
                                    <p className="font-black text-gray-900 text-lg leading-tight mb-2">{selectedTransaksi.pegawai?.nama_pegawai || 'Admin'}</p>
                                    <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-tight">
                                        <Calendar className="w-3 h-3" /> {formatDate(selectedTransaksi.tanggal_pembelian)}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail Daftar Barang</span>
                                    <div className="h-px bg-gray-100 flex-1"></div>
                                </div>
                                <div className="space-y-4">
                                    {selectedTransaksi.detail.map(d => (
                                        <div key={d.id_detailtransaksipembelian} className="flex items-center justify-between bg-gray-50 rounded-[24px] px-8 py-5 border border-transparent hover:border-gray-200 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:border-blue-100 transition-all shadow-sm">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-800 text-sm">{d.barang.nama_barang}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">
                                                        {d.jumlah_pembelian_barang} {d.barang.satuan.satuan_barang} × {formatRp(d.harga_satuan_barang)}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">{formatRp(d.jumlah_pembelian_barang * d.harga_satuan_barang)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100">
                                <div className="flex justify-between items-center bg-blue-600 text-white p-8 rounded-[32px] shadow-xl shadow-blue-600/20">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-1">Total Pembayaran PO</p>
                                        <p className="text-4xl font-black tracking-tighter leading-none tracking-tighter">{formatRp(selectedTransaksi.total_biaya)}</p>
                                    </div>
                                    <button
                                        className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all shadow-lg active:scale-90 flex items-center gap-3"
                                        onClick={() => generateInvoicePDF(selectedTransaksi)}
                                    >
                                        <Printer className="w-6 h-6" />
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2">Download Nota PDF</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Custom Confirm Modal PO */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 rotate-12 group hover:rotate-0 transition-transform">
                            <ShoppingCart className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{editMode ? 'Simpan Perubahan?' : 'Konfirmasi PO?'}</h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            {editMode 
                                ? 'Apakah Anda yakin ingin menyimpan perubahan pada Purchase Order ini?' 
                                : 'Apakah data pesanan sudah benar? Tindakan ini akan menambah stok barang secara otomatis.'}
                        </p>
                        
                        <div className="flex flex-col w-full gap-3">
                            <button 
                                onClick={confirmSubmit}
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                            >
                                Ya, Eksekusi Sekarang
                            </button>
                            <button 
                                onClick={() => setShowConfirmModal(false)}
                                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Periksa Kembali
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 rotate-12 group hover:rotate-0 transition-transform">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Hapus Transaksi?</h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            Tindakan ini akan menghapus riwayat transaksi dan mengembalikan (mengurangi) stok barang.
                        </p>
                        
                        <div className="flex flex-col w-full gap-3">
                            <button 
                                onClick={confirmDelete}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95"
                            >
                                Ya, Hapus Permanen
                            </button>
                            <button 
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setItemToDelete(null);
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
