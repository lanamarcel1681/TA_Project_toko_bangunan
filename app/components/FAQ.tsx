import { PrismaClient } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

const prisma = new PrismaClient();

export default async function FAQ() {
    noStore();
    let faqs: { pertanyaan: string, jawaban: string }[] = [];
    
    try {
        const pengaturan = await prisma.pengaturanToko.findFirst();
        if (pengaturan && pengaturan.faq) {
            faqs = JSON.parse(pengaturan.faq);
        }
    } catch (error) {
        console.error("Gagal mengambil FAQ:", error);
    }
    if (faqs.length === 0) {
        return null;
    }

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
                                        <span className="text-lg text-gray-900">{faq.pertanyaan}</span>
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <p className="text-gray-500 mt-3 animate-fadeIn whitespace-pre-line">
                                        {faq.jawaban}
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
