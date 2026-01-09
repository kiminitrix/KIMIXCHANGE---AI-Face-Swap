
import React, { useState } from 'react';

interface EthicsConsentProps {
  onAccept: () => void;
}

export const EthicsConsent: React.FC<EthicsConsentProps> = ({ onAccept }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="max-w-3xl mx-auto py-8 px-6 md:px-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] animate-in slide-in-from-bottom-8 duration-1000 shadow-[0_30px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-red/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="text-center mb-8 relative z-10">
        <div className="w-16 h-16 bg-brand-red shadow-xl shadow-brand-red/40 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter uppercase italic text-zinc-900 dark:text-white leading-none">
          SECURE<br/><span className="text-brand-red">ENTRY</span>
        </h1>
        <p className="text-zinc-500 text-sm max-w-md mx-auto font-medium">Authentication required. Validate neural usage guidelines to proceed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
        {[
          { title: 'IDENTITY', text: 'Confirmed legal rights to process biometrics.' },
          { title: 'PROTOCOL', text: 'No creation of non-consensual content.' },
          { title: 'PURGE', text: 'Transient data cycle purged after session.' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-5 rounded-[2rem] shadow-sm hover:border-brand-red/50 transition-all duration-300 group">
            <div className="text-brand-red font-black text-xl mb-2 opacity-30 group-hover:opacity-100 transition-opacity italic">0{idx + 1}</div>
            <h4 className="font-black text-zinc-900 dark:text-white mb-1 uppercase tracking-tighter text-sm">{item.title}</h4>
            <p className="text-zinc-500 text-[11px] leading-snug font-bold tracking-tight">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 space-y-4">
        <label className="flex items-center gap-4 p-5 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl cursor-pointer hover:bg-brand-red/5 transition-all group">
          <div className="relative flex-shrink-0">
            <input 
              type="checkbox" 
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="peer appearance-none w-6 h-6 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg checked:bg-brand-red checked:border-brand-red transition-all cursor-pointer" 
            />
            <svg className="absolute top-1 left-1 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="text-[10px] font-black text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors select-none tracking-widest uppercase italic">Accept Neural Synthesis Protocol v7.2</span>
        </label>

        <button
          disabled={!checked}
          onClick={onAccept}
          className={`w-full py-5 rounded-2xl font-black text-xl tracking-[0.05em] transition-all transform uppercase italic ${
            checked 
              ? 'bg-brand-red hover:bg-red-600 text-white shadow-[0_15px_30px_rgba(244,63,94,0.3)] scale-100 active:scale-95' 
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-700 cursor-not-allowed border border-zinc-300 dark:border-zinc-800'
          }`}
        >
          Initialize Engine
        </button>
      </div>
    </div>
  );
};
