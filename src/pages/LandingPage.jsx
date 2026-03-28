import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
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
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
      </main>
      <Footer
        onNavigateToFindTutor={onNavigateToFindTutor}
        onOpenRegister={onOpenRegister}
        onNavigateHome={onNavigateHome}
      />
    </div>
  );
};

export default LandingPage;
