"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/app/components/Toast';
import { Settings, Save, Clock, Banknote, CreditCard, QrCode, UploadCloud, Plus, Trash2, Image as ImageIcon, ChevronDown, MessageCircle } from 'lucide-react';

interface FAQItem {
    id: string;
    pertanyaan: string;
    jawaban: string;
}

interface BankAccount {
    id: string;
    bank: string;
    nomor: string;
    nama: string;
    logo?: string;
}

const INDONESIAN_BANKS = [
    { name: 'BCA', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
    { name: 'Bank Mandiri', logo: 'https://www.bankmandiri.co.id/documents/20143/44881086/ag-branding-logo-2.png/30f0204c-d3c1-7237-0e97-6d9c137b2866?t=1623309819189' },
    { name: 'BNI', logo: 'https://images.seeklogo.com/logo-png/35/2/bank-bni-logo-png_seeklogo-355606.png' },
    { name: 'BRI', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg' },
    { name: 'BSI', logo: 'https://bloguna.com/wp-content/uploads/2025/05/Logo-Bank-Syariah-Indonesia-BSI-Format-CDR-PNG-AI-PSD-EPS-SVG-1024x576.png' },
    { name: 'BTN', logo: 'https://akcdn.detik.net.id/visual/2024/03/04/logo-baru-btn_169.png?w=900&q=80' },
    { name: 'CIMB Niaga', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/38/CIMB_Niaga_logo.svg' },
    { name: 'Permata Bank', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/48/PermataBank_logo.svg/1280px-PermataBank_logo.svg.png?_=20250913151535' },
    { name: 'Danamon', logo: 'https://iconlogovector.com/uploads/images/2024/01/lg-6595cf910d7d1-bank-danamon.webp' },
    { name: 'Bank Mega', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Bank_Mega_2013.svg' },
    { name: 'Bank Jago', logo: 'https://www.jago.com/images/brand/logo-jago-yellow-re.svg' },
    { name: 'SeaBank', logo: 'https://images.seeklogo.com/logo-png/48/2/seabank-logo-png_seeklogo-486271.png' },
];

export default function PengaturanPage() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [batasWaktu, setBatasWaktu] = useState('16:00');
    const [metodeCash, setMetodeCash] = useState(true);
    const [metodeTransfer, setMetodeTransfer] = useState(true);
    const [metodeQris, setMetodeQris] = useState(true);

    const [fotoQris, setFotoQris] = useState<string | null>(null);
    const [uploadingQris, setUploadingQris] = useState(false);

    const [rekeningBank, setRekeningBank] = useState<BankAccount[]>([]);

    const [newBank, setNewBank] = useState({ bank: '', logo: '', nomor: '', nama: '' });

    const [faq, setFaq] = useState<FAQItem[]>([]);
    const [newFaq, setNewFaq] = useState({ pertanyaan: '', jawaban: '' });

    const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsBankDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchPengaturan();
    }, []);

    const fetchPengaturan = async () => {
        try {
            const res = await fetch('/api/pengaturan');
            const result = await res.json();
            if (result.success && result.data) {
                const d = result.data;
                setBatasWaktu(d.batas_waktu_pengantaran || '16:00');
                setMetodeCash(d.metode_cash ?? true);
                setMetodeTransfer(d.metode_transfer ?? true);
                setMetodeQris(d.metode_qris ?? true);
                setFotoQris(d.foto_qris || null);
                if (d.rekening_bank) {
                    try {
                        setRekeningBank(JSON.parse(d.rekening_bank));
                    } catch (e) {
                        console.error('Failed to parse rekening_bank');
                    }
                }
                if (d.faq) {
                    try {
                        setFaq(JSON.parse(d.faq));
                    } catch (e) {
                        console.error('Failed to parse faq');
                    }
                }
            }
        } catch (error) {
            console.error(error);
            showToast('Gagal memuat pengaturan', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                batas_waktu_pengantaran: batasWaktu,
                metode_cash: metodeCash,
                metode_transfer: metodeTransfer,
                metode_qris: metodeQris,
                foto_qris: fotoQris,
                rekening_bank: JSON.stringify(rekeningBank),
                faq: JSON.stringify(faq)
            };

            const res = await fetch('/api/pengaturan', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (result.success) {
                showToast('Pengaturan berhasil disimpan!', 'success');
            } else {
                showToast('Gagal menyimpan pengaturan', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan saat menyimpan', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleQrisUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingQris(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload/qris', {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                setFotoQris(result.filePath);
                showToast('Gambar QRIS berhasil diunggah', 'success');
            } else {
                showToast('Gagal mengunggah gambar', 'error');
            }
        } catch (error) {
            showToast('Kesalahan unggah gambar', 'error');
        } finally {
            setUploadingQris(false);
        }
    };

    const addBankAccount = () => {
        if (!newBank.bank || !newBank.nomor || !newBank.nama) {
            showToast('Lengkapi data bank terlebih dahulu', 'error');
            return;
        }

        setRekeningBank([...rekeningBank, { ...newBank, id: Date.now().toString() }]);
        setNewBank({ bank: '', logo: '', nomor: '', nama: '' });
    };

    const removeBankAccount = (id: string) => {
        setRekeningBank(rekeningBank.filter(b => b.id !== id));
    };

    const addFaq = () => {
        if (!newFaq.pertanyaan || !newFaq.jawaban) {
            showToast('Lengkapi pertanyaan dan jawaban', 'error');
            return;
        }
        setFaq([...faq, { ...newFaq, id: Date.now().toString() }]);
        setNewFaq({ pertanyaan: '', jawaban: '' });
    };

    const removeFaq = (id: string) => {
        setFaq(faq.filter(f => f.id !== id));
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500 font-bold">Memuat pengaturan...</div>;
    }

    return (
        <div className="p-4 md:p-8 w-full max-w-5xl mx-auto pb-20 animate-in fade-in text-left">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20">
                    <Settings className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pengaturan Toko</h1>
                    <p className="text-gray-500 font-medium">Konfigurasi operasional dan metode pembayaran.</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* 1. Pengaturan Operasional */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl relative overflow-hidden">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-6"><Clock className="w-5 h-5 text-orange-600" /> Waktu Operasional</h2>
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div>
                            <h3 className="font-bold text-gray-900">Batas Waktu Pengantaran</h3>
                            <p className="text-xs text-gray-500 mt-1 max-w-md">Tentukan batas maksimal pesanan agar bisa dikirim pada hari yang sama.</p>
                        </div>
                        <input
                            type="time"
                            value={batasWaktu}
                            onChange={e => setBatasWaktu(e.target.value)}
                            className="mt-4 md:mt-0 px-4 py-3 bg-white border-2 border-gray-100 rounded-xl font-black text-gray-900 focus:border-orange-500 outline-none w-full md:w-auto"
                        />
                    </div>
                </div>

                {/* 2. Metode Pembayaran */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-6"><Banknote className="w-5 h-5 text-orange-600" /> Metode Pembayaran</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {/* Cash Toggle */}
                        <label className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${metodeCash ? 'border-orange-600 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                            <div className="flex items-center gap-3">
                                <Banknote className={`w-5 h-5 ${metodeCash ? 'text-orange-600' : 'text-gray-400'}`} />
                                <span className={`font-black ${metodeCash ? 'text-orange-900' : 'text-gray-500'}`}>Tunai / Cash</span>
                            </div>
                            <input type="checkbox" checked={metodeCash} onChange={e => setMetodeCash(e.target.checked)} className="hidden" />
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${metodeCash ? 'bg-orange-600' : 'bg-gray-200'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${metodeCash ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                        </label>

                        {/* Transfer Toggle */}
                        <label className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${metodeTransfer ? 'border-orange-600 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                            <div className="flex items-center gap-3">
                                <CreditCard className={`w-5 h-5 ${metodeTransfer ? 'text-orange-600' : 'text-gray-400'}`} />
                                <span className={`font-black ${metodeTransfer ? 'text-orange-900' : 'text-gray-500'}`}>Transfer Bank</span>
                            </div>
                            <input type="checkbox" checked={metodeTransfer} onChange={e => setMetodeTransfer(e.target.checked)} className="hidden" />
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${metodeTransfer ? 'bg-orange-600' : 'bg-gray-200'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${metodeTransfer ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                        </label>

                        {/* QRIS Toggle */}
                        <label className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${metodeQris ? 'border-orange-600 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                            <div className="flex items-center gap-3">
                                <QrCode className={`w-5 h-5 ${metodeQris ? 'text-orange-600' : 'text-gray-400'}`} />
                                <span className={`font-black ${metodeQris ? 'text-orange-900' : 'text-gray-500'}`}>QRIS</span>
                            </div>
                            <input type="checkbox" checked={metodeQris} onChange={e => setMetodeQris(e.target.checked)} className="hidden" />
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${metodeQris ? 'bg-orange-600' : 'bg-gray-200'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${metodeQris ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
                    </div>

                    {/* QRIS Detail */}
                    {metodeQris && (
                        <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-4">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> QRIS Barcode</h3>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="w-40 h-40 bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative">
                                    {fotoQris ? (
                                        <img src={fotoQris} alt="QRIS" className="w-full h-full object-cover" />
                                    ) : (
                                        <QrCode className="w-10 h-10 text-gray-300" />
                                    )}
                                    {uploadingQris && <div className="absolute inset-0 bg-white/80 flex items-center justify-center font-bold text-orange-600 text-xs">Uploading...</div>}
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <p className="text-sm text-gray-500 mb-4">Unggah gambar barcode QRIS yang akan ditampilkan ke pelanggan. Format: JPG/PNG.</p>
                                    <input type="file" ref={fileInputRef} onChange={handleQrisUpload} accept="image/*" className="hidden" />
                                    <button onClick={() => fileInputRef.current?.click()} className="self-start flex items-center gap-2 bg-white border border-gray-200 hover:border-orange-300 hover:text-orange-600 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm">
                                        <UploadCloud className="w-4 h-4" /> Unggah Gambar QRIS
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Transfer Bank Detail */}
                    {metodeTransfer && (
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-4">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Daftar Rekening Bank</h3>

                            {rekeningBank.length > 0 && (
                                <div className="space-y-3 mb-6">
                                    {rekeningBank.map((rek) => {
                                        const bankInfo = INDONESIAN_BANKS.find(b => b.name === rek.bank);
                                        const logo = rek.logo || bankInfo?.logo;
                                        return (
                                            <div key={rek.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-10 flex items-center justify-center bg-gray-50 rounded-lg p-2 border border-gray-100">
                                                        {logo ? (
                                                            <img src={logo} alt={rek.bank} className="max-h-full max-w-full object-contain" />
                                                        ) : (
                                                            <Banknote className="w-6 h-6 text-gray-300" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-800">{rek.bank} <span className="text-orange-600 ml-2">{rek.nomor}</span></p>
                                                        <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-widest">A.N. {rek.nama}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeBankAccount(rek.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-3">
                                <div className="relative flex-1" ref={dropdownRef}>
                                    <div
                                        onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm font-medium flex items-center justify-between cursor-pointer hover:border-orange-400 h-[38px]"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            {newBank.bank ? (
                                                <>
                                                    {newBank.logo ? <img src={newBank.logo} alt={newBank.bank} className="h-4 object-contain max-w-[40px]" /> : <Banknote className="w-4 h-4 text-gray-400" />}
                                                    <span className="truncate">{newBank.bank}</span>
                                                </>
                                            ) : (
                                                <span className="text-gray-400">Pilih Bank</span>
                                            )}
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isBankDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    {isBankDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-lg max-h-[240px] overflow-y-auto z-10 py-1">
                                            {INDONESIAN_BANKS.map((bank, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        setNewBank({ ...newBank, bank: bank.name, logo: bank.logo });
                                                        setIsBankDropdownOpen(false);
                                                    }}
                                                    className="px-3 py-2.5 flex items-center gap-3 hover:bg-orange-50 cursor-pointer transition-colors"
                                                >
                                                    <div className="w-10 h-6 flex items-center justify-center bg-white rounded border border-gray-50 p-1">
                                                        <img src={bank.logo} alt={bank.name} className="max-h-full max-w-full object-contain" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{bank.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input type="text" placeholder="Nomor Rekening" value={newBank.nomor} onChange={e => setNewBank({ ...newBank, nomor: e.target.value })} className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-orange-400" />
                                <input type="text" placeholder="Atas Nama" value={newBank.nama} onChange={e => setNewBank({ ...newBank, nama: e.target.value })} className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-orange-400" />
                                <button onClick={addBankAccount} className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors">
                                    <Plus className="w-4 h-4" /> Tambah
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. FAQ / Bantuan */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl relative overflow-hidden">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-6"><MessageCircle className="w-5 h-5 text-orange-600" /> FAQ (Tanya Jawab)</h2>
                    
                    {faq.length > 0 && (
                        <div className="space-y-3 mb-6">
                            {faq.map((item) => (
                                <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start justify-between group">
                                    <div className="flex-1 pr-4">
                                        <h4 className="font-bold text-gray-900 text-sm mb-1">{item.pertanyaan}</h4>
                                        <p className="text-gray-500 text-xs leading-relaxed whitespace-pre-line">{item.jawaban}</p>
                                    </div>
                                    <button onClick={() => removeFaq(item.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
                        <input type="text" placeholder="Pertanyaan (Misal: Apakah melayani pengiriman luar kota?)" value={newFaq.pertanyaan} onChange={e => setNewFaq({ ...newFaq, pertanyaan: e.target.value })} className="bg-white border border-gray-100 rounded-lg px-3 py-3 text-sm font-medium focus:outline-none focus:border-orange-400 w-full" />
                        <textarea placeholder="Jawaban..." value={newFaq.jawaban} onChange={e => setNewFaq({ ...newFaq, jawaban: e.target.value })} rows={2} className="bg-white border border-gray-100 rounded-lg px-3 py-3 text-sm font-medium focus:outline-none focus:border-orange-400 w-full resize-none" />
                        <button onClick={addFaq} className="self-end bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors">
                            <Plus className="w-4 h-4" /> Tambah FAQ
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-600/20 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
                </button>
            </div>
        </div>
    );
}
