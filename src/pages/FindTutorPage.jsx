import { useState } from 'react';
import FindTutorHero from '../components/sections/FindTutorHero';
import TutorFilters from '../components/sections/TutorFilters';
import TutorGrid from '../components/sections/TutorGrid';
import BookDemoModal from '../components/modals/BookDemoModal';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const FindTutorPage = ({ onOpenLogin, onOpenRegister, onNavigateHome, onNavigateToFindTutor, onNavigateToProfile, onNavigateToAdminBooking, onNavigateToAdminDashboard, onNavigateToTutorPool }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    class: [],
    subject: [],
    gender: '',
    minFees: 0,
    maxFees: 10000,
    minRating: 0,
  });
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [bookDemoOpen, setBookDemoOpen] = useState(false);

  const handleBookDemo = (tutor) => {
    setSelectedTutor(tutor);
    setBookDemoOpen(true);
  };

  const handleCloseBookDemo = () => {
    setBookDemoOpen(false);
    setSelectedTutor(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <Navbar 
        onOpenLogin={onOpenLogin} 
        onOpenRegister={onOpenRegister} 
        onNavigateHome={onNavigateHome}
        onNavigateToFindTutor={onNavigateToFindTutor}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToAdminBooking={onNavigateToAdminBooking}
        onNavigateToAdminDashboard={onNavigateToAdminDashboard}
        onNavigateToTutorPool={onNavigateToTutorPool}
        currentPage="find-tutor" 
      />
      
      <main className="pt-20">
        {/* Hero Section with Search */}
        <FindTutorHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {/* Filters & Results Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <TutorFilters filters={filters} setFilters={setFilters} />
            </aside>

            {/* Tutor Grid */}
            <div className="lg:col-span-3 mt-8 lg:mt-0">
              <TutorGrid 
                searchQuery={searchQuery} 
                filters={filters} 
                onBookDemo={handleBookDemo}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Book Demo Modal */}
      <BookDemoModal 
        isOpen={bookDemoOpen}
        onClose={handleCloseBookDemo}
        tutor={selectedTutor}
      />
    </div>
  );
};

export default FindTutorPage;
