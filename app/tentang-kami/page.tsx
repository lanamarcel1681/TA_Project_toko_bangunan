import Navbar from '../components/Navbar';
import AboutHero from '../components/AboutHero';
import AboutBrands from '../components/AboutBrands';
import Footer from '../components/Footer';

export const metadata = {
    title: 'Tentang Kami - Toko TB. Lumbung Jaya',
    description: 'Sejarah dan komitmen Toko TB. Lumbung Jaya.',
};

export default function TentangKami() {
    return (
        <div className="bg-gray-50 text-gray-800 antialiased font-sans flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <AboutHero />
                <AboutBrands />
            </main>
            <Footer />
        </div>
    );
}
