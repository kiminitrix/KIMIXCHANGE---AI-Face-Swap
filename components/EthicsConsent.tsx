
import React, { useState } from 'react';

interface EthicsConsentProps {
  onAccept: () => void;
}

export const EthicsConsent: React.FC<EthicsConsentProps> = ({ onAccept }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 bg-brand-gray/20 border border-gray-800 rounded-[2.5rem] animate-in slide-in-from-bottom-10 duration-700">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold mb-3">Ethics & Security Protocol</h1>
        <p className="text-gray-400">Please read and confirm the KIMIXCHANGE security guidelines before using our high-fidelity AI pipeline.</p>
      </div>

      <div className="space-y-6 mb-10">
        <div className="flex gap-4">
           <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-red font-bold">1</div>
           <div>
              <h4 className="font-bold text-lg mb-1">Explicit Consent</h4>
              <p className="text-gray-400 text-sm">You must own the rights to the photos you upload. You confirm that any individuals in the photos have consented to this processing.</p>
           </div>
        </div>
        <div className="flex gap-4">
           <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-red font-bold">2</div>
           <div>
              <h4 className="font-bold text-lg mb-1">Anti-Abuse Policy</h4>
              <p className="text-gray-400 text-sm">Creating non-consensual deepfakes, parody involving public figures, or any malicious material is strictly prohibited and monitored.</p>
           </div>
        </div>
        <div className="flex gap-4">
           <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-red font-bold">3</div>
           <div>
              <h4 className="font-bold text-lg mb-1">Privacy & Data Deletion</h4>
              <p className="text-gray-400 text-sm">Images are processed on transient GPU nodes. All temporary biometric markers and source images are purged within 72 hours.</p>
           </div>
        </div>
      </div>

      <label className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all border border-transparent hover:border-brand-red/30">
        <input 
          type="checkbox" 
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="w-6 h-6 accent-brand-red rounded-lg" 
        />
        <span className="text-sm font-medium select-none">I agree to the Ethical AI Terms of Service and Privacy Policy.</span>
      </label>

      <button
        disabled={!checked}
        onClick={onAccept}
        className={`w-full mt-8 py-4 rounded-2xl font-bold text-lg transition-all ${
          checked 
            ? 'bg-brand-red hover:bg-red-700 text-white shadow-xl shadow-brand-red/20 scale-100 hover:scale-[1.02]' 
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        Enter Production Environment
      </button>
    </div>
  );
};
