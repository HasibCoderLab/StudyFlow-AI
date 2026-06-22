import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const initial = (user?.name || "U")[0].toUpperCase();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg shadow-sm border-b border-surface-200 dark:border-dark-700"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400"
          >
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <text
                x="16"
                y="22"
                textAnchor="middle"
                fill="white"
                fontSize="18"
                fontWeight="bold"
                fontFamily="system-ui"
              >
                S
              </text>
            </svg>
            StudyFlow AI
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-surface-600 dark:text-dark-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 pl-3 border-l border-surface-200 dark:border-dark-600">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {initial}
                  </div>
                  <span className="text-sm font-medium text-surface-700 dark:text-dark-200 max-w-[120px] truncate">
                    {user?.name || "User"}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-surface-700 dark:text-dark-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Log in
                </Link>
                <button
                  onClick={() => navigate("/onboarding")}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-surface-600 dark:text-dark-200"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-2 bg-white dark:bg-dark-800 border-t border-surface-200 dark:border-dark-700 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block px-3 py-2.5 text-sm font-medium text-surface-700 dark:text-dark-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-50 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <hr className="border-surface-200 dark:border-dark-700 my-2" />
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-dark-200 truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-3 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-3 py-2.5 text-sm font-medium text-surface-700 dark:text-dark-200 hover:bg-surface-50 dark:hover:bg-dark-700 rounded-lg transition-colors"
              >
                Log in
              </Link>
              <button
                onClick={() => { setMobileOpen(false); navigate("/onboarding"); }}
                className="block w-full text-center px-3 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors cursor-pointer"
              >
                Get Started Free
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
