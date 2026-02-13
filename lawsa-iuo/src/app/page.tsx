import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import LevelGrid from "@/components/LevelGrid";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <HeroSection />
            <WhyChooseUs />
            <LevelGrid />
            <Footer />
        </div>
    );
}
