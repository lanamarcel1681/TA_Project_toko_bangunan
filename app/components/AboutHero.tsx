export default function AboutHero() {
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base font-semibold text-orange-600 tracking-wide uppercase">Tentang Kami</h2>
                    <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Sejarah & Komitmen Kami</p>
                    <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">Membangun kepercayaan pelanggan melalui kualitas dan pelayanan terbaik sejak 2024.</p>
                </div>

                <div className="mt-12">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <div className="relative">
                            <img className="w-full h-full object-cover rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Bangunan architect" />
                        </div>
                        <div className="space-y-6 text-lg text-gray-500">
                            <h3 className="text-2xl font-bold text-gray-900">Sejarah Kami</h3>
                            <p>
                                Bangunan Jaya didirikan dengan visi sederhana: menyediakan bahan bangunan berkualitas tinggi yang mudah diakses oleh semua orang, mulai dari pemilik rumah yang ingin merenovasi hingga kontraktor besar yang membangun gedung pencakar langit.
                            </p>
                            <p>
                                Kami percaya bahwa setiap proyek konstruksi dimulai dengan fondasi yang kuat, dan itu berarti menggunakan material terbaik. Tim kami berdedikasi untuk mengkurasi produk-produk unggulan yang tidak hanya tahan lama tetapi juga ramah lingkungan dan efisien.
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
