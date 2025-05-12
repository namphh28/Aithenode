import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import FeaturedCategories from "@/components/FeaturedCategories";
import FeaturedEducators from "@/components/FeaturedEducators";
import Testimonials from "@/components/Testimonials";
import BecomeEducator from "@/components/BecomeEducator";
import AppFeatures from "@/components/AppFeatures";
import CallToAction from "@/components/CallToAction";

const Home = () => {
  useEffect(() => {
    // Set page title
    document.title = "Aithenode - Connect with Expert Educators";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <FeaturedCategories />
        <FeaturedEducators />
        <Testimonials />
        <BecomeEducator />
        <AppFeatures />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
