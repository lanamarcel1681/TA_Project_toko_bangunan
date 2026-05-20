export default function FAQ() {
    const faqs = [
        {
            question: "Bagaimana cara melakukan pemesanan?",
            answer: "Anda dapat memilih produk dihalaman produk, menambahkannya ke keranjang, dan mengikuti langkah-langkah checkout. Anda juga bisa menghubungi kami melalui WhatsApp untuk pemesanan manual."
        },
        {
            question: "Metode pembayaran apa saja yang tersedia?",
            answer: "Kami menerima pembayaran via Transfer Bank dan Qris untuk metode pengiriman delivery atau ambil di toko, dan cash untuk ambil di toko."
        },
        {
            question: "Apakah bisa dikirim di hari yang sama?",
            answer: "Untuk pesanan yang dikonfirmasi sebelum jam 16.00 WIB, kami usahakan dikirim di hari yang sama. Pengiriman menggunakan armada kami sendiri untuk material berat."
        },
        {
            question: "Apakah ada garansi untuk barang yang rusak?",
            answer: "Ya, kami memberikan garansi tukar baru jika barang yang diterima dalam kondisi rusak atau tidak sesuai. Mohon lampirkan bukti berupa foto saat mengajukan klaim."
        },
        {
            question: "Apakah melayani pembelian grosir?",
            answer: "Tentu, kami melayani pembelian dalam jumlah besar untuk proyek atau toko bangunan lainnya dengan harga khusus."
        }
    ];

    return (
        <div id="faq" className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">Pertanyaan yang Sering Diajukan</h2>
                    <dl className="mt-6 space-y-6 divide-y divide-gray-200">
                        {faqs.map((faq, index) => (
                            <div key={index} className="pt-6">
                                <details className="group">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                        <span className="text-lg text-gray-900">{faq.question}</span>
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <p className="text-gray-500 mt-3 animate-fadeIn">
                                        {faq.answer}
                                    </p>
                                </details>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
