import { useEffect, useRef, useCallback } from 'react';
import { useStore, ANALYSE_INTERVAL_MS, type AnalyseResponse } from '../state/useStore';

const MOCK_RESPONSE: AnalyseResponse = {
  score: 0.8,
  breakdown: {
    ideation: 0.7,
    structure: 0.8,
    expression: 0.9,
  },
  question: "What evidence supports this conclusion? Can you think of alternative perspectives?",
};

export function useAnalysis() {
  const { text, isAnalysisEnabled, setAnalysisResult } = useStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastAnalysisRef = useRef<string>('');

  const analyzeText = useCallback(async (textToAnalyze: string) => {
    if (!textToAnalyze.trim() || !isAnalysisEnabled) {
      return;
    }

    // Skip if text hasn't changed since last analysis
    if (textToAnalyze === lastAnalysisRef.current) {
      return;
    }

    try {
      const response = await fetch('/api/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToAnalyze }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: AnalyseResponse = await response.json();
      setAnalysisResult(result);
      lastAnalysisRef.current = textToAnalyze;
    } catch (error) {
      console.warn('Analysis API failed, using mock response:', error);
      // Fallback to mock response
      setAnalysisResult(MOCK_RESPONSE);
      lastAnalysisRef.current = textToAnalyze;
    }
  }, [isAnalysisEnabled, setAnalysisResult]);

  // Set up interval for regular analysis
  useEffect(() => {
    if (!isAnalysisEnabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial analysis
    if (text.trim()) {
      analyzeText(text);
    }

    // Set up interval
    intervalRef.current = setInterval(() => {
      if (text.trim()) {
        analyzeText(text);
      }
    }, ANALYSE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, isAnalysisEnabled, analyzeText]);

  return {
    analyzeNow: () => analyzeText(text),
  };
}