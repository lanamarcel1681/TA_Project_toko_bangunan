export default function BrandMarquee() {
    const brands = [
        "BOSCH", "DULUX", "MAKITA", "TIGA RODA", "HOLCIM",
        "NIPPON PAINT", "AVIAN", "SANYO", "HONDA", "TEKIRO"
    ];
    return (
        <div className="py-12 bg-white border-b border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
                <p className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Brand Terpercaya yang Kami Jual</p>
            </div>
            <div className="relative flex overflow-x-hidden group">
                <div className="py-2 animate-marquee whitespace-nowrap flex space-x-16 items-center paused">
                    {brands.map((brand, i) => (
                        <span key={i} className="text-3xl font-bold text-gray-400">{brand}</span>
                    ))}
                    {brands.map((brand, i) => (
                        <span key={`dup-${i}`} className="text-3xl font-bold text-gray-400">{brand}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
