export default function ContactInfo() {
    return (
        <div className="bg-white py-12 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-base font-semibold text-orange-600 tracking-wide uppercase">Lokasi Kami</h2>
                    <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">Kunjungi Toko Kami</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Informasi Kontak & Alamat</h3>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13 21.314l-4.657-4.657a8 8 0 0111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3 text-base text-gray-500">
                                    <p className="font-medium text-gray-900">Alamat Utama:</p>
                                    <p className="mt-1">Jl. Sampaan - Berbah</p>
                                    <p>Berbah, Tegaltirto, Berbah, Sleman Regency, Special Region of Yogyakarta 55573</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div className="ml-3 text-base text-gray-500">
                                    <p className="font-medium text-gray-900">Telepon:</p>
                                    <p className="mt-1">+62 811-2638-898</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-3 text-base text-gray-500">
                                    <p className="font-medium text-gray-900">Email:</p>
                                    <p className="mt-1">tblumbungjaya03@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3 text-base text-gray-500">
                                    <p className="font-medium text-gray-900">Jam Operasional:</p>
                                    <p className="mt-1">Senin - Sabtu: 08:00 - 17:00 WIB</p>
                                    <p>Minggu: Tutup</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-full min-h-[400px] bg-gray-200 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d279.25987001076265!2d110.44369137836289!3d-7.806622687968951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a511f4dd9aa15%3A0x1df13600bdbab3ff!2sTB.%20Lumbung%20Jaya!5e1!3m2!1sen!2sid!4v1773321881992!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '400px' }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}
