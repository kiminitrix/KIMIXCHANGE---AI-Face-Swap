
export enum WorkflowStep {
  CONSENT = 'CONSENT',
  UPLOAD_SOURCE = 'UPLOAD_SOURCE',
  UPLOAD_TARGET = 'UPLOAD_TARGET',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT'
}

export interface ImageFile {
  id: string;
  url: string;
  file?: File;
  name: string;
}

export interface SwapConfig {
  quality: 'low' | 'high';
  enhance: boolean;
  blendStrength: number;
}

export interface HistoryItem {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  resultUrl: string;
  timestamp: number;
}
