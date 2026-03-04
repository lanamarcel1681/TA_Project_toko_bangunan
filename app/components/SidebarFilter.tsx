"use client";

import { useState } from 'react';

const categories = [
    "Semua", "Semen", "Besi", "Cat", "Bata",
    "Kayu", "Genteng", "Pipa", "Pasir", "Keramik"
];

const ratingOptions = [
    { stars: 5, label: "bintang 5" },
    { stars: 4, label: "ke atas" },
    { stars: 3, label: "ke atas" },
];

interface SidebarFilterProps {
    selectedCategory: string;
    onCategoryChange: (cat: string) => void;
    selectedRating: number | null;
    onRatingChange: (rating: number | null) => void;
}

export default function SidebarFilter({
    selectedCategory,
    onCategoryChange,
    selectedRating,
    onRatingChange,
}: SidebarFilterProps) {
    return (
        <aside className="w-full lg:w-60 flex-shrink-0">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Kategori</h3>
                <ul className="space-y-1">
                    {categories.map(cat => (
                        <li key={cat}>
                            <button
                                onClick={() => onCategoryChange(cat)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                        ? 'bg-orange-100 text-orange-700 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Rating Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Filter Rating</h3>
                <ul className="space-y-2">
                    {ratingOptions.map(opt => (
                        <li key={opt.stars}>
                            <button
                                onClick={() => onRatingChange(selectedRating === opt.stars ? null : opt.stars)}
                                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${selectedRating === opt.stars
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="flex text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg key={i} className={`w-3.5 h-3.5 ${i < opt.stars ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </span>
                                <span className="text-xs">{opt.stars === 5 ? opt.label : `${opt.stars} ${opt.label}`}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Stok */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Stok</h3>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    <input type="checkbox" className="w-4 h-4 rounded accent-orange-600" />
                    Tersedia
                </label>
            </div>
        </aside>
    );
}
