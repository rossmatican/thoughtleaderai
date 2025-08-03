import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

export const useRealtimeFeedback = (sessionId, enabled = true) => {
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cognitiveScore, setCognitiveScore] = useState(100);
  const [aiPatterns, setAiPatterns] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  
  const debounceTimer = useRef(null);
  const lastAnalyzedText = useRef('');
  
  const analyzeFeedback = async (text) => {
    // Skip if disabled or text hasn't changed significantly
    if (!enabled || !text || text === lastAnalyzedText.current) {
      return;
    }
    
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Debounce the API call
    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.post(`${API_ENDPOINTS.BASE_URL}/api/realtime-feedback`, {
          text,
          sessionId
        });
        
        if (response.data.feedback) {
          setFeedback(response.data.feedback);
          setCognitiveScore(response.data.cognitiveScore || 100);
          setAiPatterns(response.data.aiPatterns || []);
          setSuggestions(response.data.suggestions || []);
          lastAnalyzedText.current = text;
        }
      } catch (err) {
        console.error('Real-time feedback error:', err);
        setError(err.response?.data?.error || 'Failed to get feedback');
      } finally {
        setIsLoading(false);
      }
    }, parseInt(process.env.FEEDBACK_INTERVAL_MS) || 5000);
  };
  
  const getSocraticGuidance = async (text, context = {}) => {
    if (!text || !sessionId) return null;
    
    try {
      const response = await axios.post(`${API_ENDPOINTS.BASE_URL}/api/socratic-guidance`, {
        text,
        sessionId,
        context
      });
      
      return response.data.questions;
    } catch (err) {
      console.error('Socratic guidance error:', err);
      return null;
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);
  
  return {
    feedback,
    isLoading,
    error,
    cognitiveScore,
    aiPatterns,
    suggestions,
    analyzeFeedback,
    getSocraticGuidance
  };
};