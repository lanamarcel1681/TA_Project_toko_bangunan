export default function AboutHero() {
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base font-semibold text-orange-600 tracking-wide uppercase">Tentang Kami</h2>
                    <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Sejarah & Komitmen Kami</p>
                    <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">Menyediakan 500+ varian material bangunan berkualitas untuk memenuhi kebutuhan perorangan maupun pemborong sejak 2020.</p>
                </div>

                <div className="mt-12">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div className="relative">
                            <img className="w-full h-full object-cover rounded-lg shadow-lg" src="/Gambar%20Toko.jpg" alt="TB. Lumbung Jaya" />
                        </div>
                        <div className="space-y-6 text-lg text-gray-500">
                            <h3 className="text-2xl font-bold text-gray-900">Sejarah Kami</h3>
                            <p>
                                Sejak didirikan pada tahun 2020, TB. Lumbung Jaya telah menjadi mitra pengadaan material andalan bagi ribuan pelanggan perorangan hingga pemborong lokal. Kami berawal dari visi sederhana: memastikan setiap orang mendapatkan akses mudah ke bahan bangunan berstandar tinggi dengan harga bersaing.
                            </p>
                            <p>
                                Selama beroperasi, kami telah menyuplai berbagai macam produk, mulai dari semen, besi, hingga alat pertukangan. Tim kami berdedikasi untuk memberikan kualitas material terbaik dengan pengiriman yang tepat waktu demi kelancaran proyek Anda.
                            </p>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Visi Kami</h3>
                                <p className="mb-6">
                                    Menjadi penyedia solusi bahan bangunan terdepan di Indonesia yang mengutamakan inovasi, keberlanjutan, dan kepuasan pelanggan.
                                </p>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Misi Kami</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Menyediakan produk berkualitas standar SNI dengan harga kompetitif.</li>
                                    <li>Memberikan pelayanan profesional dan konsultasi teknis yang solutif.</li>
                                    <li>Mengembangkan jaringan distribusi yang cepat dan handal.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
