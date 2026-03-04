import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BrandMarquee from './components/BrandMarquee';
import Features from './components/Features';
import Categories from './components/Categories';
import FeaturedProducts from './components/FeaturedProducts';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-800 antialiased font-sans">
      <Navbar />
      <HeroSection />
      <BrandMarquee />
      <Features />
      <Categories />
      <FeaturedProducts />
      <Footer />
    </div>
  );
}
