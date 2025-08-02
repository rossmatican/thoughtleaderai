import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ANALYSE_INTERVAL_MS = 30_000;
const INTERVENTION_COOLDOWN_MS = 10 * 60_000;

export interface AnalyseResponse {
  score: number;
  breakdown: {
    ideation: number;
    structure: number;
    expression: number;
  };
  question?: string;
}

interface AppState {
  // Text content
  text: string;
  setText: (text: string) => void;
  
  // Analysis results
  analysisResult: AnalyseResponse | null;
  setAnalysisResult: (result: AnalyseResponse) => void;
  
  // Modal state
  lastModalShown: number;
  setLastModalShown: (timestamp: number) => void;
  shouldShowModal: () => boolean;
  
  // Settings
  isAnalysisEnabled: boolean;
  setAnalysisEnabled: (enabled: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      text: '',
      setText: (text: string) => set({ text }),
      
      analysisResult: null,
      setAnalysisResult: (result: AnalyseResponse) => set({ analysisResult: result }),
      
      lastModalShown: 0,
      setLastModalShown: (timestamp: number) => set({ lastModalShown: timestamp }),
      
      shouldShowModal: () => {
        const state = get();
        const now = Date.now();
        const timeSinceLastModal = now - state.lastModalShown;
        
        return (
          state.analysisResult?.score > 0.7 &&
          state.analysisResult?.question &&
          timeSinceLastModal >= INTERVENTION_COOLDOWN_MS
        );
      },
      
      isAnalysisEnabled: true,
      setAnalysisEnabled: (enabled: boolean) => set({ isAnalysisEnabled: enabled }),
    }),
    {
      name: 'tlai-storage',
      partialize: (state) => ({
        text: state.text,
        lastModalShown: state.lastModalShown,
        isAnalysisEnabled: state.isAnalysisEnabled,
      }),
    }
  )
);

export { ANALYSE_INTERVAL_MS, INTERVENTION_COOLDOWN_MS };