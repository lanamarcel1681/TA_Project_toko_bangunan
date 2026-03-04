export default function AboutBrands() {
    const brands = [
        "SEMEN GRESIK", "TIGA RODA", "HOLCIM", "KRAKATAU STEEL", "JAYABOARD",
        "HEBEL", "DULUX", "NIPPON PAINT", "AVIAN", "ROMAN",
        "TOTO", "AMERICAN STD", "BOSCH", "MAKITA", "TEKIRO",
        "DEWALT", "STANLEY", "HONDA"
    ];

    return (
        <div className="bg-white py-16 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-base font-semibold text-orange-600 tracking-wide uppercase">Produk Kami</h2>
                    <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">Brand Terbaik</p>
                    <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">Kami bekerja sama dengan berbagai brand terkemuka untuk menjamin kualitas proyek Anda.</p>
                </div>

                <div className="relative flex overflow-x-hidden group py-10">
                    <div className="py-2 animate-marquee whitespace-nowrap flex space-x-16 items-center paused" style={{ animationDuration: '45s' }}>
                        {brands.map((brand, i) => (
                            <span key={i} className="text-3xl font-bold text-gray-400">{brand}</span>
                        ))}
                        {brands.map((brand, i) => (
                            <span key={`dup-${i}`} className="text-3xl font-bold text-gray-400">{brand}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
