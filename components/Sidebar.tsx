
import React from 'react';
import { ICONS, CROWN_LOGO } from '../constants';
import { WorkflowStep } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentStep: WorkflowStep;
  setStep: (step: WorkflowStep) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, currentStep, setStep }) => {
  const navItems = [
    { id: 'home', label: 'Identity Swap', icon: ICONS.Swap, step: WorkflowStep.UPLOAD_SOURCE },
    { id: 'history', label: 'Recent Work', icon: ICONS.History, step: WorkflowStep.RESULT },
    { id: 'security', label: 'Ethics Protocol', icon: ICONS.Security, step: WorkflowStep.CONSENT },
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-900 transform transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } shadow-2xl md:shadow-none`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {CROWN_LOGO}
            <span className="text-xl font-black tracking-tighter italic">
              <span className="text-zinc-900 dark:text-white transition-colors duration-300">KIMI</span>
              <span className="text-brand-red">XCHANGE</span>
            </span>
          </div>
          <button onClick={onToggle} className="md:hidden p-2 text-zinc-400 hover:text-brand-red transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setStep(item.step);
                if (window.innerWidth < 768) onToggle();
              }}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group ${
                currentStep === item.step 
                  ? 'bg-brand-red text-white shadow-xl shadow-brand-red/20 font-bold' 
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 font-medium'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${currentStep === item.step ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white'}`} />
              <span className="tracking-tight uppercase text-xs tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Status Card */}
        <div className="p-6">
          <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h4 className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">Neural Link</h4>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-500 font-medium">Core engine v5.0 processing at 120fps via tensor cores.</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
