import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MoonIcon, SunIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        location.pathname === to
          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                MemeVerse
              </h1>
            </Link>
            <div className="hidden md:flex space-x-4">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/explore">Explore</NavLink>
              <NavLink to="/upload">Upload</NavLink>
              <NavLink to="/leaderboard">Leaderboard</NavLink>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <SunIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
            <Link
              to="/profile"
              className={`p-2 rounded-lg transition-colors ${
                location.pathname === '/profile'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <UserCircleIcon className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Bars3Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-64 opacity-100 py-2'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="flex flex-col space-y-2 pb-3">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/explore">Explore</NavLink>
            <NavLink to="/upload">Upload</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;