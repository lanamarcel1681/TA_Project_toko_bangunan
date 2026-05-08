"use client";

import { useState } from 'react';

const ratingOptions = [
    { stars: 5, label: "bintang 5" },
    { stars: 4, label: "ke atas" },
    { stars: 3, label: "ke atas" },
];

interface SidebarFilterProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (cat: string) => void;
    selectedRating: number | null;
    onRatingChange: (rating: number | null) => void;
    showAvailableOnly: boolean;
    onShowAvailableChange: (val: boolean) => void;
}

export default function SidebarFilter({
    categories,
    selectedCategory,
    onCategoryChange,
    selectedRating,
    onRatingChange,
    showAvailableOnly,
    onShowAvailableChange
}: SidebarFilterProps) {
    const [isOpen, setIsOpen] = useState(false);

    const activeFilterCount = (selectedCategory !== 'Semua' ? 1 : 0) + (selectedRating !== null ? 1 : 0) + (showAvailableOnly ? 1 : 0);

    const filterContent = (
        <>
            {/* Categories */}
            <div className="bg-white rounded-[24px] lg:rounded-[32px] shadow-sm border border-gray-100 p-5 lg:p-6 mb-4 lg:mb-5">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 lg:mb-5 ml-1">Kategori Material</h3>
                <ul className="space-y-1">
                    {categories.map(cat => (
                        <li key={cat}>
                            <button
                                onClick={() => { onCategoryChange(cat); setIsOpen(false); }}
                                className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all ${selectedCategory === cat
                                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-orange-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Rating Filter */}
            <div className="bg-white rounded-[24px] lg:rounded-[32px] shadow-sm border border-gray-100 p-5 lg:p-6 mb-4 lg:mb-5">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 lg:mb-5 ml-1">Filter Reputasi</h3>
                <ul className="space-y-2">
                    {ratingOptions.map(opt => (
                        <li key={opt.stars}>
                            <button
                                onClick={() => onRatingChange(selectedRating === opt.stars ? null : opt.stars)}
                                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold transition-all ${selectedRating === opt.stars
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="flex text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg key={i} className={`w-3.5 h-3.5 ${i < opt.stars ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </span>
                                <span className="uppercase tracking-widest">{opt.stars === 5 ? opt.label : `${opt.stars}+ ${opt.label}`}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-[24px] lg:rounded-[32px] shadow-sm border border-gray-100 p-5 lg:p-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 lg:mb-5 ml-1">Ketersediaan</h3>
                <label className="flex items-center gap-3 cursor-pointer group px-4 py-1">
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            checked={showAvailableOnly}
                            onChange={(e) => onShowAvailableChange(e.target.checked)}
                            className="w-5 h-5 rounded-lg border-2 border-gray-200 checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer appearance-none" 
                        />
                        <svg className="absolute top-1 left-1 w-3 h-3 text-white pointer-events-none opacity-0 checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-800 transition-colors">Tersedia Saja</span>
                </label>
            </div>
        </>
    );

    return (
        <aside className="w-full lg:w-60 flex-shrink-0">
            {/* Mobile: Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden w-full flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span>Filter Produk</span>
                    {activeFilterCount > 0 && (
                        <span className="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Mobile: Collapsible content */}
            <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
                {filterContent}
            </div>

            {/* Desktop: Always visible */}
            <div className="hidden lg:block">
                {filterContent}
            </div>
        </aside>
    );
}
