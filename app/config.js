// API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  analyze: `${API_URL}/api/analyze`,
  chat: `${API_URL}/api/chat`,
  voiceInitialize: `${API_URL}/api/voice/initialize`
};