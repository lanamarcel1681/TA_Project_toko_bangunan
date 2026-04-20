"use client";

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';

interface ProductPurchaseActionsProps {
    productId: number;
    stock: number;
}

export default function ProductPurchaseActions({ productId, stock }: ProductPurchaseActionsProps) {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleIncrement = () => {
        if (quantity < stock) setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const addToCart = async () => {
        setLoading(true);
        setSuccess(false);
        try {
            const res = await fetch('/api/keranjang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                // Dispatch event to update Navbar count
                window.dispatchEvent(new Event('cart-updated'));
                setTimeout(() => setSuccess(false), 3000);
            } else {
                alert(data.error || "Gagal menambah ke keranjang");
            }
        } catch (error) {
            console.error("Add to cart error:", error);
            alert("Terjadi kesalahan sistem saat menghubungi server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white w-full sm:w-auto shrink-0 h-12">
                <button 
                    onClick={handleDecrement}
                    disabled={quantity <= 1 || loading}
                    className="px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-orange-600 transition-colors focus:outline-none disabled:opacity-30"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <input 
                    type="number" 
                    value={quantity} 
                    readOnly 
                    className="w-12 text-center text-sm font-bold text-gray-800 border-x border-gray-100 focus:outline-none py-3" 
                />
                <button 
                    onClick={handleIncrement}
                    disabled={quantity >= stock || loading}
                    className="px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-orange-600 transition-colors focus:outline-none disabled:opacity-30"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <button 
                onClick={addToCart}
                disabled={loading || stock <= 0}
                className={`w-full sm:flex-1 h-12 flex items-center justify-center gap-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-bold rounded-lg transition-all px-6 active:scale-95 ${success ? 'bg-green-50 border-green-500 text-green-600' : ''}`}
            >
                {success ? (
                    <>
                        <Check className="w-5 h-5" />
                        <span>Berhasil!</span>
                    </>
                ) : (
                    <>
                        <ShoppingCart className={`w-5 h-5 ${loading ? 'animate-bounce' : ''}`} />
                        <span>{loading ? 'Menambahkan...' : 'Keranjang'}</span>
                    </>
                )}
            </button>

            <button 
                disabled={stock <= 0 || loading}
                className="w-full sm:flex-1 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all px-6 active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
            >
                Beli Sekarang
            </button>
        </div>
    );
}
