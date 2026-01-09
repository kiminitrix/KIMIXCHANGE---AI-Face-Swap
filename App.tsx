
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FaceSwapWorkflow } from './components/FaceSwapWorkflow';
import { EthicsConsent } from './components/EthicsConsent';
import { WorkflowStep, HistoryItem } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<WorkflowStep>(WorkflowStep.CONSENT);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sync theme with document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const saved = localStorage.getItem('kimixchange_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const handleConsent = () => setStep(WorkflowStep.UPLOAD_SOURCE);

  const addToHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('kimixchange_history', JSON.stringify(newHistory));
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-zinc-900'}`}>
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
        currentStep={step}
        setStep={setStep}
      />

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <Header 
          onSidebarToggle={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Padding reduced from p-6/p-10 to p-4/p-6 to help fit content without scrolling */}
        <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col justify-center">
          {step === WorkflowStep.CONSENT ? (
            <EthicsConsent onAccept={handleConsent} />
          ) : (
            <FaceSwapWorkflow 
              currentStep={step}
              onStepChange={setStep}
              onResultReady={addToHistory}
              isDarkMode={isDarkMode}
            />
          )}
        </div>

        <footer className="p-4 text-center text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 border-t border-zinc-100 dark:border-zinc-900">
          <p>© 2025 KIMIXCHANGE AI • HIGH-FIDELITY NEURAL SYNTHESIS</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
