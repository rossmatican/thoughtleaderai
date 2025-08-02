// API Contracts for Dual-Mode Application

export interface AnalyseRequest {
  text: string;
  sessionId: string;
}

export interface AnalyseResponse {
  score: number;
  breakdown: {
    clarity: number;
    originality: number;
    depth: number;
    coherence: number;
    patterns: string[];
  };
  question?: string;
}

export interface ChatRequest {
  message: string;
  sessionId: string;
}

export interface ChatResponse {
  reply: string;
}

// UI State Types
export interface AppMode {
  current: 'draft' | 'live';
}

export interface SessionData {
  id: string;
  startTime: number;
  messages: ChatMessage[];
  analyses: AnalysisResult[];
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: number;
  sender: 'user' | 'assistant';
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  request: AnalyseRequest;
  response: AnalyseResponse;
}