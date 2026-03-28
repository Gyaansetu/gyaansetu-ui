const Footer = ({ onNavigateToFindTutor, onOpenRegister, onNavigateHome }) => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id) => {
    // If not on home page, navigate home first then scroll
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Main Footer Row: Brand left, Links right */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-12">

          {/* Brand + tagline */}
          <div className="lg:w-1/3 flex-shrink-0">
            <button onClick={onNavigateHome} className="flex items-center space-x-2 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-400 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">GyaanSetu</span>
            </button>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Connecting parents with verified, local home tutors across India. Safe, transparent, and hassle-free.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8">

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
              <ul className="space-y-3">
                <li>
                  <button onClick={onNavigateHome} className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-200 text-left">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('why-gyaansetu')} className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-200 text-left">
                    Why GyaanSetu
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('how-it-works')} className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-200 text-left">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('testimonials')} className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-200 text-left">
                    Testimonials
                  </button>
                </li>
              </ul>
            </div>

            {/* For Parents */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Parents</h3>
              <ul className="space-y-3">
                <li>
                  <button onClick={onNavigateToFindTutor} className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-200 text-left">
                    Find a Tutor
                  </button>
                </li>
                <li>
                  <button onClick={onNavigateToFindTutor} className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-200 text-left">
                    Book a Demo
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('how-it-works')} className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-200 text-left">
                    How It Works
                  </button>
                </li>
              </ul>
            </div>

            {/* For Tutors */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Tutors</h3>
              <ul className="space-y-3">
                <li>
                  <button onClick={onOpenRegister} className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-200 text-left">
                    Register as a Tutor
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo('why-gyaansetu')} className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-200 text-left">
                    Why List on GyaanSetu
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© {currentYear} GyaanSetu. All rights reserved.</p>
          <p>Bringing the right tutor home, not just the nearest one.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
