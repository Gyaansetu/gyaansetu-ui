import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import FindTutorPage from './pages/FindTutorPage';
import UnifiedProfilePage from './pages/UnifiedProfilePage';
import AdminDemoBookingPage from './pages/AdminDemoBookingPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TutorPoolPage from './pages/TutorPoolPage';
import AuthModal from './components/modals/AuthModal';
import Toast from './components/common/Toast';
import useToast from './hooks/useToast';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { toast, showError, showSuccess, hideToast } = useToast();
  const [currentPage, setCurrentPage] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Handle OAuth callback and error parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const email = urlParams.get('email');
    const name = urlParams.get('name');

    if (error === 'not_registered') {
      // User tried to login but is not registered
      showError('Account not found. Please register first to continue.');
      setAuthMode('register');
      setAuthModalOpen(true);
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  const closeModal = () => {
    setAuthModalOpen(false);
    // If there's a pending navigation and user is now authenticated, navigate
    if (pendingNavigation && isAuthenticated()) {
      setCurrentPage(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const navigateHome = () => {
    setCurrentPage('home');
  };

  const navigateToAdminBooking = () => {
    setCurrentPage('admin-booking');
  };

  const navigateToAdminDashboard = () => {
    setCurrentPage('admin-dashboard');
  };

  const navigateToTutorPool = () => {
    setCurrentPage('tutor-pool');
  };

  const navigateToFindTutor = () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Store the intended navigation
      setPendingNavigation('find-tutor');
      // Open login modal
      openLogin();
    } else {
      setCurrentPage('find-tutor');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <LandingPage 
            onOpenLogin={openLogin} 
            onOpenRegister={openRegister}
            onNavigateToFindTutor={navigateToFindTutor}
            onNavigateToProfile={() => setCurrentPage('profile')}
            onNavigateToAdminBooking={navigateToAdminBooking}
            onNavigateToAdminDashboard={navigateToAdminDashboard}
            onNavigateToTutorPool={navigateToTutorPool}
            onNavigateHome={navigateHome}
          />
        );
      case 'find-tutor':
        return (
          <FindTutorPage 
            onOpenLogin={openLogin} 
            onOpenRegister={openRegister}
            onNavigateToFindTutor={navigateToFindTutor}
            onNavigateToProfile={() => setCurrentPage('profile')}
            onNavigateToAdminBooking={navigateToAdminBooking}
            onNavigateToAdminDashboard={navigateToAdminDashboard}
            onNavigateToTutorPool={navigateToTutorPool}
            onNavigateHome={navigateHome}
          />
        );
      case 'profile':
        return (
          <UnifiedProfilePage 
            onOpenLogin={openLogin} 
            onOpenRegister={openRegister}
            onNavigateToFindTutor={navigateToFindTutor}
            onNavigateToProfile={() => setCurrentPage('profile')}
            onNavigateToAdminBooking={navigateToAdminBooking}
            onNavigateToAdminDashboard={navigateToAdminDashboard}
            onNavigateToTutorPool={navigateToTutorPool}
            onNavigateHome={navigateHome}
          />
        );
      case 'admin-booking':
        return (
          <AdminDemoBookingPage 
            onOpenLogin={openLogin} 
            onOpenRegister={openRegister}
            onNavigateToFindTutor={navigateToFindTutor}
            onNavigateToProfile={() => setCurrentPage('profile')}
            onNavigateToAdminBooking={navigateToAdminBooking}
            onNavigateToAdminDashboard={navigateToAdminDashboard}
            onNavigateToTutorPool={navigateToTutorPool}
            onNavigateHome={navigateHome}
          />
        );
      case 'tutor-pool':
        return (
          <TutorPoolPage 
            onOpenLogin={openLogin} 
            onOpenRegister={openRegister}
            onNavigateToFindTutor={navigateToFindTutor}
            onNavigateToProfile={() => setCurrentPage('profile')}
            onNavigateToAdminBooking={navigateToAdminBooking}
            onNavigateToAdminDashboard={navigateToAdminDashboard}
            onNavigateToTutorPool={navigateToTutorPool}
            onNavigateHome={navigateHome}
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboardPage 
            onOpenLogin={openLogin} 
            onOpenRegister={openRegister}
            onNavigateToFindTutor={navigateToFindTutor}
            onNavigateToProfile={() => setCurrentPage('profile')}
            onNavigateToAdminBooking={navigateToAdminBooking}
            onNavigateToAdminDashboard={navigateToAdminDashboard}
            onNavigateToTutorPool={navigateToTutorPool}
            onNavigateHome={navigateHome}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderPage()}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={closeModal} 
        initialMode={authMode}
      />
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
