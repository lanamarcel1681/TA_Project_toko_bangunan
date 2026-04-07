export default function AboutBrands() {
    const brands = [
        { name: "RUCIKA", logo: "https://www.rucika.co.id/wp-content/uploads/2021/10/rucika-logo-png-Aldira-Sasmito@2x.png" },
        { name: "DULUX", logo: "https://logos-world.net/wp-content/uploads/2022/07/Dulux-Logo.png" },
        { name: "MAKITA", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6oLUyW5EArhUg8HpusFoxDE7t_l_lz1x2oQ&s" },
        { name: "HOLCIM", logo: "https://images.seeklogo.com/logo-png/6/2/holcim-logo-png_seeklogo-67373.png" },
        { name: "NIPPON PAINT", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpU9PYonG_msmfbZBKgOWB51CEasE9ePdEZA&s" },
        { name: "SEMEN GRESIK", logo: "https://www.komunikasia.com/web/images/productpic/semen-gresik-indonesia_2_014607.jpg" },
        { name: "PENGUIN", logo: "https://www.tekad.co.id/wp-content/uploads/2019/09/84penguin-logo.png" }
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
                            <div key={i} className="flex items-center justify-center w-40 h-20">
                                <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" title={brand.name} referrerPolicy="no-referrer" />
                            </div>
                        ))}
                        {brands.map((brand, i) => (
                            <div key={`dup-${i}`} className="flex items-center justify-center w-40 h-20">
                                <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" title={brand.name} referrerPolicy="no-referrer" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
