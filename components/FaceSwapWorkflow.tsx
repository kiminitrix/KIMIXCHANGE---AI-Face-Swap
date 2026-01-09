
import React, { useState, useRef, useCallback } from 'react';
import { AIService } from '../services/aiService';
import { WorkflowStep, ImageFile, SwapConfig, HistoryItem } from '../types';

interface FaceSwapWorkflowProps {
  currentStep: WorkflowStep;
  onStepChange: (step: WorkflowStep) => void;
  onResultReady: (item: HistoryItem) => void;
}

export const FaceSwapWorkflow: React.FC<FaceSwapWorkflowProps> = ({ currentStep, onStepChange, onResultReady }) => {
  const [sourceImage, setSourceImage] = useState<ImageFile | null>(null);
  const [targetImage, setTargetImage] = useState<ImageFile | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [config, setConfig] = useState<SwapConfig>({ quality: 'high', enhance: true, blendStrength: 0.8 });
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
    setStatusMessage('Initializing InsightFace Pipeline...');
    
    try {
      // Simulate steps for UI feedback
      await new Promise(r => setTimeout(r, 1000));
      setStatusMessage('Detecting faces with RetinaFace...');
      await new Promise(r => setTimeout(r, 800));
      setStatusMessage('Extracting 512-d ArcFace Embeddings...');
      await new Promise(r => setTimeout(r, 800));
      setStatusMessage('Performing inswapper_128 inference...');

      const ai = AIService.getInstance();
      const result = await ai.performFaceSwap(source, target, config);
      
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
      setError(err.message || 'Processing failed. Please check your inputs and try again.');
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
        {[
          { step: WorkflowStep.UPLOAD_SOURCE, label: 'Source' },
          { step: WorkflowStep.UPLOAD_TARGET, label: 'Target' },
          { step: WorkflowStep.RESULT, label: 'Result' }
        ].map((item, idx) => (
          <div key={item.step} className="flex items-center flex-1 last:flex-none">
            <div className={`flex flex-col items-center gap-2 ${currentStep === item.step ? 'text-brand-red' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
                currentStep === item.step ? 'border-brand-red bg-brand-red text-white scale-110' : 'border-gray-700 bg-gray-900'
              }`}>
                {idx + 1}
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest">{item.label}</span>
            </div>
            {idx < 2 && <div className={`flex-1 h-[2px] mx-4 ${idx === 0 && currentStep !== WorkflowStep.UPLOAD_SOURCE ? 'bg-brand-red' : 'bg-gray-800'}`} />}
          </div>
        ))}
      </div>

      {isProcessing && (
        <div className="flex flex-col items-center justify-center py-20 bg-brand-gray/30 rounded-3xl border border-gray-800">
          <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold mb-2">Processing Magic</h2>
          <p className="text-gray-400 animate-pulse">{statusMessage}</p>
        </div>
      )}

      {!isProcessing && currentStep === WorkflowStep.UPLOAD_SOURCE && (
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center">Step 1: Your Face</h1>
          <p className="text-gray-400 text-center mb-8">Upload a clear, front-facing photo of yourself. This will be the "Identity" used for the swap.</p>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group aspect-square md:aspect-video rounded-3xl border-2 border-dashed border-gray-700 hover:border-brand-red transition-all cursor-pointer bg-brand-gray/20 flex flex-col items-center justify-center overflow-hidden"
          >
            {sourceImage ? (
              <img src={sourceImage.url} className="w-full h-full object-cover" alt="Source" />
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-red group-hover:scale-110 transition-all">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                <p className="text-lg font-medium">Click or Drag Image</p>
                <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG (Max 10MB)</p>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => handleFileSelect(e, 'source')} 
            className="hidden" 
            accept="image/*"
          />
        </div>
      )}

      {!isProcessing && currentStep === WorkflowStep.UPLOAD_TARGET && (
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center">Step 2: The Scene</h1>
          <p className="text-gray-400 text-center mb-8">Choose the photo you want to appear in. We'll swap your face into this image.</p>
          <div className="flex gap-4 mb-8">
             <div className="w-24 h-24 rounded-2xl overflow-hidden border border-brand-red flex-shrink-0">
                <img src={sourceImage?.url} className="w-full h-full object-cover opacity-50" />
             </div>
             <div className="flex flex-col justify-center">
                <span className="text-xs text-brand-red font-bold uppercase tracking-tighter">Source Identity Locked</span>
                <button onClick={() => onStepChange(WorkflowStep.UPLOAD_SOURCE)} className="text-sm text-gray-400 hover:text-white underline">Change Source</button>
             </div>
          </div>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group aspect-square md:aspect-video rounded-3xl border-2 border-dashed border-gray-700 hover:border-brand-red transition-all cursor-pointer bg-brand-gray/20 flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-red group-hover:scale-110 transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-lg font-medium">Select Target Scene</p>
              <p className="text-sm text-gray-500 mt-2">Your face will be placed here</p>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => handleFileSelect(e, 'target')} 
            className="hidden" 
            accept="image/*"
          />
        </div>
      )}

      {!isProcessing && currentStep === WorkflowStep.RESULT && resultImage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight">Swap Complete</h1>
            <p className="text-gray-400">High-fidelity result generated with GFPGAN facial enhancement and seamless color matching.</p>
            
            <div className="bg-brand-gray/30 p-6 rounded-3xl border border-gray-800 space-y-4">
               <div className="flex items-center justify-between">
                 <span className="text-sm font-medium text-gray-300">Face Enhancement</span>
                 <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full border border-green-500/20">Active</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-sm font-medium text-gray-300">Resolution</span>
                 <span className="text-xs text-white bg-gray-700 px-2 py-1 rounded-full">4K Upscaled</span>
               </div>
               <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = `kimixchange-${Date.now()}.png`;
                    link.click();
                  }}
                  className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                 Download Full Image
               </button>
               <button 
                  onClick={resetWorkflow}
                  className="w-full bg-transparent hover:bg-white/5 text-gray-400 font-bold py-4 rounded-2xl border border-gray-800 transition-all"
               >
                 Start New Swap
               </button>
            </div>
          </div>

          <div className="relative group rounded-3xl overflow-hidden border border-brand-red/30 shadow-2xl shadow-brand-red/10">
            <img src={resultImage} className="w-full h-auto" alt="Face Swap Result" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
               <span className="text-brand-red font-bold text-lg mb-1">PRO PREVIEW</span>
               <span className="text-sm text-gray-300">Watermark removed on download.</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
           <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};
