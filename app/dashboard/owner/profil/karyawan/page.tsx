'use client';
import React from 'react';
import { Users, Edit, Eye, Search } from 'lucide-react';

export default function ProfilKaryawanPage() {
    return (
        <div className="p-8 w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Profil Karyawan</h1>
                    <p className="text-gray-500 mt-1">Lihat dan konfirmasi data profil serta foto karyawan Anda.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                    <input type="text" placeholder="Cari karyawan..." className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">Nama Lengkap</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Posisi</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Terakhir Aktif</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(3)].map((_, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">{String.fromCharCode(65 + i)}</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Karyawan {i + 1}</p>
                                        <p className="text-sm text-gray-500">karyawan{i + 1}@email.com</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-700">Staff Gudang</td>
                                <td className="px-6 py-4 text-gray-700">Hari ini, 08:30</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg mr-2" title="Lihat Profil"><Eye className="w-4 h-4" /></button>
                                    <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg" title="Edit Profil"><Edit className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
