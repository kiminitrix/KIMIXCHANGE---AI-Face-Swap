
import React, { useState, useEffect, useCallback } from 'react';
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

  // Initialize history from localStorage
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

  const handleConsent = () => {
    setStep(WorkflowStep.UPLOAD_SOURCE);
  };

  const addToHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history].slice(0, 20); // Keep last 20
    setHistory(newHistory);
    localStorage.setItem('kimixchange_history', JSON.stringify(newHistory));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'bg-brand-black text-white' : 'bg-gray-50 text-brand-black'}`}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setSidebarOpen(!isSidebarOpen)} 
        currentStep={step}
        setStep={setStep}
      />

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'}`}>
        <Header 
          onSidebarToggle={() => setSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {step === WorkflowStep.CONSENT ? (
            <EthicsConsent onAccept={handleConsent} />
          ) : (
            <FaceSwapWorkflow 
              currentStep={step}
              onStepChange={setStep}
              onResultReady={addToHistory}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="p-6 text-center text-sm text-gray-500 border-t border-gray-800/50">
          <p>© 2024 KIMIXCHANGE AI. All images processed locally or deleted within 72 hours. Ethical AI Use Enforced.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
