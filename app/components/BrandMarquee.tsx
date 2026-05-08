export default function BrandMarquee() {
    const brands = [
        { name: "RUCIKA", logo: "https://www.rucika.co.id/wp-content/uploads/2021/10/rucika-logo-png-Aldira-Sasmito@2x.png" },
        { name: "DULUX", logo: "https://vectorseek.com/wp-content/uploads/2021/01/Dulux-Logo-Vector-1.jpg" },
        { name: "MAKITA", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6oLUyW5EArhUg8HpusFoxDE7t_l_lz1x2oQ&s" },
        { name: "HOLCIM", logo: "https://images.seeklogo.com/logo-png/6/2/holcim-logo-png_seeklogo-67373.png" },
        { name: "NIPPON PAINT", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpU9PYonG_msmfbZBKgOWB51CEasE9ePdEZA&s" },
        { name: "SEMEN GRESIK", logo: "https://www.komunikasia.com/web/images/productpic/semen-gresik-indonesia_2_014607.jpg" },
        { name: "PENGUIN", logo: "https://www.tekad.co.id/wp-content/uploads/2019/09/84penguin-logo.png" }
    ];
    return (
        <div className="py-12 bg-white border-b border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
                <p className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Brand Terpercaya yang Kami Jual</p>
            </div>
            <div className="relative flex overflow-x-hidden group py-4">
                <div className="py-2 animate-marquee whitespace-nowrap flex space-x-16 items-center paused">
                    {brands.map((brand, i) => (
                        <div key={i} className="flex items-center justify-center w-36 h-16">
                            <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" title={brand.name} referrerPolicy="no-referrer" />
                        </div>
                    ))}
                    {brands.map((brand, i) => (
                        <div key={`dup-${i}`} className="flex items-center justify-center w-36 h-16">
                            <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" title={brand.name} referrerPolicy="no-referrer" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
