
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
    { id: 'home', label: 'Create Swap', icon: ICONS.Swap, step: WorkflowStep.UPLOAD_SOURCE },
    { id: 'history', label: 'Recent Work', icon: ICONS.History, step: WorkflowStep.RESULT },
    { id: 'security', label: 'Security & Ethics', icon: ICONS.Security, step: WorkflowStep.CONSENT },
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-black border-r border-brand-red/20 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3">
          {CROWN_LOGO}
          <span className="text-xl font-bold tracking-tighter text-white">
            KIMI<span className="text-brand-red">XCHANGE</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setStep(item.step)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentStep === item.step 
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* App Info */}
        <div className="p-6">
          <div className="bg-brand-red/10 border border-brand-red/20 rounded-2xl p-4">
            <h4 className="text-sm font-semibold text-brand-red mb-1">PRO Pipeline Active</h4>
            <p className="text-xs text-gray-400">RetinaFace + ArcFace + GFPGAN enhancement ready.</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
