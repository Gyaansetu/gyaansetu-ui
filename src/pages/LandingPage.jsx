import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/sections/HeroSection';
import StatsSection from '../components/sections/StatsSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import TutorTypesSection from '../components/sections/TutorTypesSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import BlogPreviewSection from '../components/sections/BlogPreviewSection';
import CTASection from '../components/sections/CTASection';
import Footer from '../components/layout/Footer';

const LandingPage = ({ onOpenLogin, onOpenRegister, onNavigateToFindTutor, onNavigateToProfile, onNavigateToAdminBooking, onNavigateToAdminDashboard, onNavigateToTutorPool, onNavigateHome }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        onOpenLogin={onOpenLogin} 
        onOpenRegister={onOpenRegister} 
        onNavigateToFindTutor={onNavigateToFindTutor}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToAdminBooking={onNavigateToAdminBooking}
        onNavigateToAdminDashboard={onNavigateToAdminDashboard}
        onNavigateToTutorPool={onNavigateToTutorPool}
        onNavigateHome={onNavigateHome}
        currentPage="home"
      />
      <main>
        <HeroSection onOpenRegister={onOpenRegister} />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TutorTypesSection />
        <TestimonialsSection />
        <BlogPreviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
