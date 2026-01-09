
import React, { useState, useRef } from 'react';
import { AIService } from '../services/aiService';
import { WorkflowStep, ImageFile, SwapConfig, HistoryItem } from '../types';

interface FaceSwapWorkflowProps {
  currentStep: WorkflowStep;
  onStepChange: (step: WorkflowStep) => void;
  onResultReady: (item: HistoryItem) => void;
  isDarkMode: boolean;
}

export const FaceSwapWorkflow: React.FC<FaceSwapWorkflowProps> = ({ currentStep, onStepChange, onResultReady, isDarkMode }) => {
  const [sourceImage, setSourceImage] = useState<ImageFile | null>(null);
  const [targetImage, setTargetImage] = useState<ImageFile | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'source' | 'target') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgObj = {
          id: Math.random().toString(36).substr(2, 9),
          url: reader.result as string,
          file,
          name: file.name
        };
        if (type === 'source') {
          setSourceImage(imgObj);
          onStepChange(WorkflowStep.UPLOAD_TARGET);
        } else {
          setTargetImage(imgObj);
          onStepChange(WorkflowStep.PROCESSING);
          startProcessing(sourceImage?.url!, reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startProcessing = async (source: string, target: string) => {
    setIsProcessing(true);
    setError(null);
    setStatusMessage('Booting Neural Pipeline...');
    
    try {
      await new Promise(r => setTimeout(r, 800));
      setStatusMessage('Extracting Embeddings...');
      await new Promise(r => setTimeout(r, 800));
      setStatusMessage('Applying Blending...');

      const ai = AIService.getInstance();
      const result = await ai.performFaceSwap(source, target, { quality: 'high', enhance: true });
      
      setResultImage(result);
      onStepChange(WorkflowStep.RESULT);
      onResultReady({
        id: Date.now().toString(),
        sourceUrl: source,
        targetUrl: target,
        resultUrl: result,
        timestamp: Date.now()
      });
    } catch (err: any) {
      setError(err.message || 'Operation failed. Please try again.');
      onStepChange(WorkflowStep.UPLOAD_SOURCE);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetWorkflow = () => {
    setSourceImage(null);
    setTargetImage(null);
    setResultImage(null);
    onStepChange(WorkflowStep.UPLOAD_SOURCE);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto w-full">
      {/* Stepper - Reduced spacing */}
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
        {[
          { step: WorkflowStep.UPLOAD_SOURCE, label: 'Source' },
          { step: WorkflowStep.UPLOAD_TARGET, label: 'Target' },
          { step: WorkflowStep.RESULT, label: 'Finish' }
        ].map((item, idx) => (
          <div key={item.step} className="flex items-center flex-1 last:flex-none">
            <div className={`flex flex-col items-center gap-2 ${currentStep === item.step ? 'text-brand-red' : 'text-zinc-400 dark:text-zinc-700'}`}>
              <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center font-black transition-all duration-500 ${
                currentStep === item.step 
                  ? 'border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/25' 
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'
              }`}>
                {idx + 1}
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
            </div>
            {idx < 2 && <div className={`flex-1 h-[2px] mx-2 rounded-full ${idx === 0 && currentStep !== WorkflowStep.UPLOAD_SOURCE ? 'bg-brand-red' : 'bg-zinc-100 dark:bg-zinc-900'}`} />}
          </div>
        ))}
      </div>

      {isProcessing && (
        <div className="flex flex-col items-center justify-center py-16 bg-zinc-50 dark:bg-zinc-900/30 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
          <div className="w-16 h-16 border-[4px] border-brand-red border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-black mb-2 tracking-tighter italic uppercase text-zinc-900 dark:text-white">Processing</h2>
          <p className="text-zinc-500 font-bold tracking-wide animate-pulse uppercase text-[10px]">{statusMessage}</p>
        </div>
      )}

      {!isProcessing && currentStep === WorkflowStep.UPLOAD_SOURCE && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-black mb-2 tracking-tighter italic uppercase whitespace-nowrap">
              <span className="text-zinc-900 dark:text-white transition-colors duration-300">IDENTITY</span>
              <span className="text-brand-red ml-2">SOURCE</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium">Upload the face that will define the new persona.</p>
          </div>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group aspect-video rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-brand-red transition-all duration-500 cursor-pointer bg-zinc-50 dark:bg-zinc-900/20 flex flex-col items-center justify-center overflow-hidden relative"
          >
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:border-brand-red transition-all">
                <svg className="w-8 h-8 text-zinc-400 group-hover:text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
              </div>
              <p className="text-lg font-black tracking-tight mb-1 text-zinc-900 dark:text-white italic uppercase">Upload Photo</p>
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">JPG / PNG • 20MB MAX</p>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e, 'source')} className="hidden" accept="image/*" />
        </div>
      )}

      {!isProcessing && currentStep === WorkflowStep.UPLOAD_TARGET && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-black mb-2 tracking-tighter italic uppercase whitespace-nowrap">
              <span className="text-zinc-900 dark:text-white transition-colors duration-300">TARGET</span>
              <span className="text-brand-red ml-2">SCENE</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium">Select the environment for the synthesis.</p>
          </div>
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
             <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-brand-red flex-shrink-0">
                <img src={sourceImage?.url} className="w-full h-full object-cover" />
             </div>
             <div>
                <span className="text-[9px] text-brand-red font-black uppercase tracking-widest mb-1 block">Source Ready</span>
                <button onClick={() => onStepChange(WorkflowStep.UPLOAD_SOURCE)} className="text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-bold transition-colors underline underline-offset-4 italic">Change</button>
             </div>
          </div>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group aspect-video rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-brand-red transition-all duration-500 cursor-pointer bg-zinc-50 dark:bg-zinc-900/20 flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:border-brand-red transition-all">
                <svg className="w-8 h-8 text-zinc-400 group-hover:text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-lg font-black tracking-tight mb-1 text-zinc-900 dark:text-white italic uppercase">Set Target</p>
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">Final Frame Selection</p>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e, 'target')} className="hidden" accept="image/*" />
        </div>
      )}

      {!isProcessing && currentStep === WorkflowStep.RESULT && resultImage && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none whitespace-nowrap">
                <span className="text-zinc-900 dark:text-white transition-colors duration-300">MASTER</span>
                <span className="text-brand-red ml-2">SYNTHETICS</span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium">Identity successfully merged.</p>
            </div>
            
            <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-xl">
               <div className="space-y-3">
                 <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                   <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic">Inference</span>
                   <span className="text-[9px] font-black text-white bg-brand-red px-2 py-0.5 rounded-full italic">Optimized</span>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 gap-3">
                 <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = resultImage;
                      link.download = `kimixchange-${Date.now()}.png`;
                      link.click();
                    }}
                    className="w-full bg-brand-red hover:bg-red-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_10px_20px_rgba(244,63,94,0.2)] italic uppercase text-sm"
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   Export
                 </button>
                 <button 
                    onClick={resetWorkflow}
                    className="w-full bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-black py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 transition-all uppercase italic text-xs"
                 >
                   Reset Session
                 </button>
               </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative group rounded-[2.5rem] overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl">
            <img src={resultImage} className="w-full h-auto max-h-[60vh] object-contain bg-black/5" alt="Face Swap Result" />
            <div className="absolute top-4 left-4">
                <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-[8px] font-black tracking-widest uppercase text-white">Render Output</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-xl mx-auto p-4 bg-brand-red/10 border border-brand-red/30 rounded-2xl flex items-center gap-4 text-brand-red animate-in zoom-in-95 duration-500">
           <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           <p className="font-black text-[10px] uppercase tracking-wider italic">{error}</p>
        </div>
      )}
    </div>
  );
};
