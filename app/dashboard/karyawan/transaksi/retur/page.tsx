'use client';

import { useState, useEffect } from 'react';
import { CornerDownLeft, Search, RefreshCcw, Image as ImageIcon, Camera, ExternalLink, ShieldCheck, CreditCard, ClipboardList, AlertCircle, CheckCircle2, AlertTriangle, Loader2, MessageCircle } from 'lucide-react';
import { useToast } from '@/app/components/Toast';

export default function ReturPembelianPage() {
    const { showToast } = useToast();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterInv, setFilterInv] = useState('');
    const [uploading, setUploading] = useState(false);

    // Confirmation Modal states
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'APPROVE' | 'REFUND' | null>(null);
    const [confirmTarget, setConfirmTarget] = useState<any>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/karyawan/transaksi/retur');
            const data = await res.json();
            if (data.success) {
                setItems(data.data);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = (type: string, id: number, action: string, amount: number) => {
        setConfirmAction(action as 'APPROVE' | 'REFUND');
        setConfirmTarget({ type, id, action, amount });
        setShowConfirmModal(true);
    };

    const executeAction = async () => {
        if (!confirmAction || !confirmTarget) return;
        const { type, id, action, amount } = confirmTarget;

        if (action === 'REFUND') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (e: any) => {
                const file = e.target.files[0];
                if (!file) return;

                setUploading(true);
                setIsActionLoading(true);
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const uploadRes = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    });
                    const uploadData = await uploadRes.json();
                    if (uploadData.success) {
                        const proof = uploadData.url;

                        const res = await fetch('/api/karyawan/transaksi/retur', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type, id, action, proof, amount })
                        });
                        const data = await res.json();
                        if (data.success) {
                            showToast("Refund berhasil diproses!", 'success');
                            fetchData();
                            setShowConfirmModal(false);
                        } else {
                            showToast(data.error || "Gagal memproses refund", 'error');
                        }
                    }
                } catch (err) {
                    showToast("Gagal mengunggah bukti refund", 'error');
                } finally {
                    setUploading(false);
                    setIsActionLoading(false);
                }
            };
            input.click();
            return;
        }

        // Standard approval
        setIsActionLoading(true);
        try {
            const res = await fetch('/api/karyawan/transaksi/retur', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, id, action })
            });
            const data = await res.json();
            if (data.success) {
                showToast("Status berhasil diperbarui!", 'success');
                fetchData();
                setShowConfirmModal(false);
            } else {
                showToast(data.error || "Gagal mengubah status", 'error');
            }
        } catch (error) {
            showToast("Terjadi kesalahan sistem", 'error');
        } finally {
            setIsActionLoading(false);
        }
    };

    const filteredItems = items.filter(item =>
        item.inv.toLowerCase().includes(filterInv.toLowerCase()) ||
        item.customer.toLowerCase().includes(filterInv.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto pb-20 text-left">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-3 text-left">Monitoring Retur & Batal</h1>
                    <p className="text-gray-500 font-medium">Validasi fisik pengembalian barang dan proses pengembalian dana (Refund) kepada pelanggan.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari Invoice / Pelanggan..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
                        value={filterInv}
                        onChange={(e) => setFilterInv(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] text-center">Bukti / Foto</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Info Pesanan</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Pelanggan & Rekening</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Alasan / Deskripsi</th>
                                <th className="px-8 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Nominal Refund</th>
                                <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <RefreshCcw className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Memuat Data...</p>
                                    </td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-4" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tidak Ada Pengajuan Batal / Retur</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-orange-50/30 transition-all group">
                                        <td className="px-10 py-8">
                                            <div className="flex justify-center">
                                                {item.photo ? (
                                                    <a href={item.photo} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center hover:scale-105 transition-transform group/img relative">
                                                        <img src={item.photo} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                                            <ExternalLink className="w-4 h-4 text-white" />
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <div className="w-14 h-14 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center border border-gray-100">
                                                        <ImageIcon className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mb-2 inline-block ${item.type === 'RETUR' ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'}`}>
                                                {item.type}
                                            </span>
                                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">ID INV</p>
                                            <p className="font-black text-gray-800 text-base tracking-tight leading-none">{item.inv}</p>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="font-black text-gray-900 text-base leading-none">{item.customer}</p>
                                                <a 
                                                    href={`https://wa.me/${item.phone?.replace(/^0/, '62').replace(/^\+/, '')}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center p-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                                                    title="Hubungi via WhatsApp"
                                                >
                                                    <MessageCircle className="w-3 h-3" />
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-2 bg-orange-50/50 px-3 py-1.5 rounded-lg border border-orange-100/50 w-fit">
                                                <CreditCard className="w-3.5 h-3.5 text-orange-600" />
                                                <p className="text-[10px] font-black text-orange-600 uppercase tracking-tighter">
                                                    {item.bankInfo}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="max-w-[220px]">
                                                <p className="text-gray-500 font-medium text-xs leading-relaxed italic tracking-tight mb-2">&ldquo;{item.reason}&rdquo;</p>
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${item.status === 'Selesai' || item.status.includes('Selesai') ? 'bg-teal-100 text-teal-600' : 'bg-orange-100 text-orange-600'}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className="text-xl font-black text-gray-900 tracking-tight leading-none">Rp {item.amount?.toLocaleString('id-ID')}</span>
                                            {item.refundStatus === 'Selesai' ? (
                                                <div className="flex items-center gap-1.5 text-green-500 mt-2">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    <p className="text-[9px] font-black uppercase tracking-widest leading-none">REFUNDED</p>
                                                </div>
                                            ) : (
                                                <p className="text-[9px] font-black text-orange-500 uppercase mt-2 tracking-widest leading-none">PENDING REFUND</p>
                                            )}
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex flex-col gap-2 scale-90 origin-right">
                                                {item.type === 'RETUR' && item.status === 'Diajukan' && (
                                                    <button
                                                        onClick={() => handleAction(item.type, item.id, 'APPROVE', item.amount)}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-[0.15em] transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                                                    >
                                                        Setujui Retur &rarr;
                                                    </button>
                                                )}

                                                {(item.status === 'Disetujui' || item.type === 'BATAL') && item.refundStatus === 'Pending' && (
                                                    <button
                                                        onClick={() => handleAction(item.type, item.id, 'REFUND', item.amount)}
                                                        disabled={uploading}
                                                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-[0.15em] transition-all shadow-lg shadow-orange-600/20 active:scale-95 disabled:opacity-50"
                                                    >
                                                        <RefreshCcw className={`w-3.5 h-3.5 ${uploading ? 'animate-spin' : ''}`} />
                                                        {uploading ? 'UPLOADING...' : 'Input Bukti TF &rarr;'}
                                                    </button>
                                                )}

                                                {item.proof && (
                                                    <a
                                                        href={item.proof}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-teal-50 text-teal-600 border border-teal-100 px-6 py-3 rounded-full flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-[0.15em] hover:bg-teal-100 transition-all"
                                                    >
                                                        Lihat Bukti Transfer
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-10 bg-gray-50/50 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm items-center gap-8 relative overflow-hidden group/notice">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/30 -mr-16 -mt-16 rounded-full blur-2xl group-hover/notice:scale-110 transition-transform"></div>
                        <div className="w-16 h-16 bg-orange-600 rounded-2xl text-white flex items-center justify-center shadow-xl shadow-orange-600/20 shrink-0">
                            <ClipboardList className="w-8 h-8" />
                        </div>
                        <div className="flex-1 text-left">
                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-[11px] mb-3 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-orange-600" /> Protokol Operasional Refund
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">Untuk **Retur**: Pastikan barang fisik sudah diterima/diverifikasi sebelum menginput bukti transfer.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">Untuk **Batal**: Dana harus segera dikembalikan agar pelanggan merasa aman berbelanja di TB. Lumbung Jaya.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Action Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 text-center">
                    <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 rotate-12 group hover:rotate-0 transition-transform ${confirmAction === 'APPROVE' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                            {confirmAction === 'APPROVE' ? <CornerDownLeft className="w-10 h-10" /> : <CreditCard className="w-10 h-10" />}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                            {confirmAction === 'APPROVE' ? 'Setujui Retur?' : 'Proses Refund?'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            {confirmAction === 'APPROVE'
                                ? `Konfirmasi penerimaan barang retur untuk ${confirmTarget?.inv}. Pastikan kondisi barang sudah sesuai laporan.`
                                : `Lanjutkan proses refund untuk ${confirmTarget?.inv} senilai Rp ${confirmTarget?.amount?.toLocaleString('id-ID')}. Anda akan diminta mengunggah bukti transfer.`}
                        </p>

                        <div className="flex flex-col w-full gap-3">
                            <button
                                onClick={executeAction}
                                disabled={isActionLoading}
                                className={`w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 ${confirmAction === 'APPROVE' ? 'bg-indigo-600 shadow-indigo-600/20 hover:bg-indigo-700' : 'bg-orange-600 shadow-orange-600/20 hover:bg-orange-700'}`}
                            >
                                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (confirmAction === 'APPROVE' ? 'Ya, Setujui Retur' : 'Ya, Proses Refund')}
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

