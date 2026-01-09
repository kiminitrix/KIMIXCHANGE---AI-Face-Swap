
import React from 'react';
import { CROWN_LOGO } from '../constants';

interface HeaderProps {
  onSidebarToggle: () => void;
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSidebarToggle, isSidebarOpen, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="h-16 md:h-20 border-b border-gray-800/50 flex items-center justify-between px-6 sticky top-0 bg-brand-black/80 backdrop-blur-md z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onSidebarToggle}
          className="md:hidden p-2 rounded-lg hover:bg-white/5"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        {!isSidebarOpen && (
          <div className="flex items-center gap-3 md:hidden">
            {CROWN_LOGO}
            <span className="font-bold tracking-tighter">KIMIXCHANGE</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
          title="Toggle Dark/Light Mode"
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-green-500">GPU ACCELERATED</span>
        </div>
      </div>
    </header>
  );
};
