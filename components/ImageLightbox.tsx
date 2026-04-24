"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ImageLightboxProps {
    src: string;
    alt?: string;
    children: React.ReactNode;
}

export default function ImageLightbox({ src, alt, children }: ImageLightboxProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent scrolling when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            {/* Clickable Area */}
            <div onClick={() => setIsOpen(true)} className="cursor-pointer">
                {children}
            </div>

            {/* Lightbox Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                    >
                        <X size={32} />
                    </button>

                    {/* Image Container */}
                    <div
                        className="relative max-w-5xl w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={src}
                            alt={alt || "Enlarged view"}
                            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
