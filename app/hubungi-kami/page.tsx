import Navbar from '../components/Navbar';
import ContactInfo from '../components/ContactInfo';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export const metadata = {
    title: 'Hubungi Kami - Toko Bangunan Jaya',
    description: 'Informasi kontak dan lokasi Toko Bangunan Jaya.',
};

export default function HubungiKami() {
    return (
        <div className="bg-gray-50 text-gray-800 antialiased font-sans flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <ContactInfo />
                <FAQ />
            </main>
            <Footer />
        </div>
    );
}
