import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProblemSection from "../components/ProblemSection";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Gamification from "../components/Gamification";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 text-surface-900 dark:text-white">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <Features />
        <Gamification />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
