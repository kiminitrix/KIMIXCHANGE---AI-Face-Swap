
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
    <header className={`h-20 border-b flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 backdrop-blur-xl transition-all duration-300 ${
      isDarkMode ? 'bg-black/80 border-zinc-900/50' : 'bg-white/80 border-zinc-200/50'
    }`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={onSidebarToggle}
          className={`p-2.5 rounded-xl transition-all ${
            isDarkMode ? 'hover:bg-white/5 text-zinc-500 hover:text-white' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
          }`}
          aria-label={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        >
          {isSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
        {!isSidebarOpen && (
          <div className="flex items-center gap-3">
            {CROWN_LOGO}
            <span className="font-black tracking-tighter italic">
              <span className="text-zinc-900 dark:text-white transition-colors duration-300">KIMI</span>
              <span className="text-brand-red">XCHANGE</span>
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden sm:flex items-center gap-2.5 px-4 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full transition-colors duration-300">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase italic">Inference Mode</span>
        </div>
        
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full transition-all border ${
            isDarkMode 
              ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700' 
              : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300'
          }`}
          aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
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
      </div>
    </header>
  );
};
