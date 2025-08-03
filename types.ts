// API Contracts for Dual-Mode Application

export interface AnalyzeRequest {
  text: string;
  sessionId: string;
}

export interface AnalyzeResponse {
  score: number;
  breakdown: {
    clarity: number;
    originality: number;
    depth: number;
    coherence: number;
    patterns: string[];
  };
  voiceDrift?: number; // 0.0-1.0 indicating deviation from baseline voice
  question?: string;
}

export interface ChatRequest {
  message: string;
  sessionId: string;
}

export interface ChatResponse {
  reply: string;
}

// Voice Profile Types
export interface VoiceProfile {
  sessionId: string;
  sampleText: string;
  timestamp: number;
  characteristics?: {
    avgSentenceLength: number;
    vocabularyComplexity: number;
    punctuationPattern: string[];
    commonPhrases: string[];
  };
}

export interface VoiceInitializeRequest {
  sessionId: string;
  sampleText: string;
}

export interface VoiceInitializeResponse {
  success: boolean;
  profile: VoiceProfile;
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
  voiceProfile?: VoiceProfile;
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
  request: AnalyzeRequest;
  response: AnalyzeResponse;
}