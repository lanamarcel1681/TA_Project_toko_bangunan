'use client';
import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function WhatsAppFAB() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Filter paths where the FAB should NOT appear
    const restrictedPaths = ['/dashboard', '/login', '/register'];
    const isRestricted = restrictedPaths.some(path => pathname?.startsWith(path));

    useEffect(() => {
        if (isRestricted) return;
        // Tampilkan setelah 2 detik
        const timer = setTimeout(() => {
            setIsVisible(true);
            setShowTooltip(true);
        }, 2000);

        // Sembunyikan tooltip setelah 8 detik
        const tooltipTimer = setTimeout(() => {
            setShowTooltip(false);
        }, 8000);

        return () => {
            clearTimeout(timer);
            clearTimeout(tooltipTimer);
        };
    }, []);

    const whatsappNumber = "6281913792626"; // Tanpa tanda + atau spasi
    const message = "Halo TB. Lumbung Jaya, saya ingin bertanya mengenai produk...";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    if (isRestricted || !isVisible) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end gap-4 pointer-events-none">
            {/* Tooltip / Message Bubble */}
            {showTooltip && (
                <div className="bg-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-50 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500 pointer-events-auto relative group">
                    <button
                        onClick={() => setShowTooltip(false)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                    <p className="text-sm font-bold text-gray-800 leading-tight">
                        Ada yang bisa kami bantu? <br />
                        <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1 block">Hubungi Admin Kami</span>
                    </p>
                    {/* Triangle pointer */}
                    <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-emerald-50 rotate-45 shadow-[2px_2px_2px_rgba(0,0,0,0.02)]"></div>
                </div>
            )}

            {/* Main FAB */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto relative group"
            >
                {/* Pulse animation rings */}
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20 group-hover:animate-none"></span>
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-pulse opacity-40 group-hover:animate-none scale-110"></span>

                {/* Button content */}
                <div className="relative w-16 h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 group-active:scale-95">
                    <MessageCircle className="w-8 h-8 fill-current" />
                </div>

                {/* Status indicator */}
                <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-sm"></div>
            </a>
        </div>
    );
}
