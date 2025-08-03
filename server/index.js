import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory session storage (replace with proper DB in production)
const sessions = new Map();

// Voice profiles storage
const voiceProfiles = new Map();

// Helper function to get or create session
function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      id: sessionId,
      startTime: Date.now(),
      messages: [],
      analyses: [],
      voiceProfile: null
    });
  }
  return sessions.get(sessionId);
}

// Voice characteristics analyzer
function analyzeVoiceCharacteristics(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(word => word.length > 0);
  
  // Calculate average sentence length
  const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;
  
  // Calculate vocabulary complexity (average word length)
  const vocabularyComplexity = words.length > 0 ? 
    words.reduce((sum, word) => sum + word.length, 0) / words.length : 0;
  
  // Extract punctuation patterns
  const punctuationPattern = text.match(/[.!?,:;]/g) || [];
  
  // Extract common phrases (simple 2-word combinations)
  const commonPhrases = [];
  for (let i = 0; i < words.length - 1; i++) {
    const phrase = `${words[i].toLowerCase()} ${words[i + 1].toLowerCase()}`;
    if (phrase.length > 3) {
      commonPhrases.push(phrase);
    }
  }
  
  return {
    avgSentenceLength,
    vocabularyComplexity,
    punctuationPattern,
    commonPhrases: [...new Set(commonPhrases)].slice(0, 10) // Unique phrases, max 10
  };
}

// Voice drift analyzer
function analyzeVoiceDrift(currentText, baselineText) {
  if (!baselineText || !currentText) return 0.0;
  
  const baseline = analyzeVoiceCharacteristics(baselineText);
  const current = analyzeVoiceCharacteristics(currentText);
  
  // Calculate drift factors
  const sentenceLengthDrift = Math.abs(baseline.avgSentenceLength - current.avgSentenceLength) / 
    Math.max(baseline.avgSentenceLength, 1);
  
  const vocabularyDrift = Math.abs(baseline.vocabularyComplexity - current.vocabularyComplexity) / 
    Math.max(baseline.vocabularyComplexity, 1);
  
  // Compare punctuation patterns
  const baselinePunctCount = baseline.punctuationPattern.length;
  const currentPunctCount = current.punctuationPattern.length;
  const punctuationDrift = baselinePunctCount > 0 ? 
    Math.abs(baselinePunctCount - currentPunctCount) / baselinePunctCount : 0;
  
  // Compare common phrases overlap
  const phraseOverlap = baseline.commonPhrases.filter(phrase => 
    current.commonPhrases.includes(phrase)).length;
  const phraseTotal = Math.max(baseline.commonPhrases.length, 1);
  const phraseDrift = 1 - (phraseOverlap / phraseTotal);
  
  // Weighted average of drift factors
  const totalDrift = (
    sentenceLengthDrift * 0.3 +
    vocabularyDrift * 0.3 +
    punctuationDrift * 0.2 +
    phraseDrift * 0.2
  );
  
  // Cap at 1.0 and smooth the result
  return Math.min(1.0, totalDrift);
}

// Voice profile initialization endpoint
app.post('/api/voice/initialize', (req, res) => {
  const { sessionId, sampleText } = req.body;
  
  if (!sessionId || !sampleText) {
    return res.status(400).json({ error: 'Missing sessionId or sampleText' });
  }
  
  if (sampleText.trim().length < 50) {
    return res.status(400).json({ error: 'Sample text too short. Minimum 50 characters required.' });
  }
  
  const session = getSession(sessionId);
  const characteristics = analyzeVoiceCharacteristics(sampleText);
  
  const voiceProfile = {
    sessionId,
    sampleText,
    timestamp: Date.now(),
    characteristics
  };
  
  // Store in session and profiles map
  session.voiceProfile = voiceProfile;
  voiceProfiles.set(sessionId, voiceProfile);
  
  res.json({
    success: true,
    profile: voiceProfile
  });
});

// Analyze endpoint - for Live mode
app.post('/api/analyze', (req, res) => {
  const { text, sessionId } = req.body;
  
  if (!text || !sessionId) {
    return res.status(400).json({ error: 'Missing text or sessionId' });
  }

  const session = getSession(sessionId);
  
  // Simple analysis logic (replace with actual AI analysis)
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const clarity = Math.min(100, Math.max(0, 100 - words.length / 50));
  const originality = Math.random() * 100; // Placeholder
  const depth = Math.min(100, sentences.length * 10);
  const coherence = Math.max(0, 100 - Math.abs(words.length - sentences.length * 8));
  
  const score = Math.round((clarity + originality + depth + coherence) / 4);
  
  const patterns = [];
  if (text.includes('however')) patterns.push('transition-heavy');
  if (text.split(' ').some(word => word.length > 12)) patterns.push('complex-vocabulary');
  if (sentences.length > 5) patterns.push('detailed-explanation');

  // Calculate voice drift if baseline exists
  let voiceDrift = 0.0;
  if (session.voiceProfile && session.voiceProfile.sampleText) {
    voiceDrift = analyzeVoiceDrift(text, session.voiceProfile.sampleText);
  }

  let question = null;
  if (score < 60) {
    question = "What's the core insight you're trying to convey here?";
  } else if (patterns.includes('complex-vocabulary')) {
    question = "Could this be expressed more simply?";
  }

  const response = {
    score,
    breakdown: {
      clarity: Math.round(clarity),
      originality: Math.round(originality),
      depth: Math.round(depth),
      coherence: Math.round(coherence),
      patterns
    },
    voiceDrift: Math.round(voiceDrift * 100) / 100, // Round to 2 decimal places
    question
  };

  // Store analysis in session
  session.analyses.push({
    id: Date.now().toString(),
    timestamp: Date.now(),
    request: { text, sessionId },
    response
  });

  res.json(response);
});

// Chat endpoint - for Draft mode
app.post('/api/chat', (req, res) => {
  const { message, sessionId } = req.body;
  
  if (!message || !sessionId) {
    return res.status(400).json({ error: 'Missing message or sessionId' });
  }

  const session = getSession(sessionId);
  
  // Add user message to session
  session.messages.push({
    id: Date.now().toString(),
    content: message,
    timestamp: Date.now(),
    sender: 'user'
  });

  // Simple AI response logic (replace with actual Claude integration)
  let reply = "I understand you're working on that idea. ";
  
  if (message.toLowerCase().includes('help')) {
    reply += "What specific aspect would you like to explore further?";
  } else if (message.toLowerCase().includes('stuck')) {
    reply += "Let's break this down into smaller pieces. What's the main point you're trying to make?";
  } else if (message.toLowerCase().includes('draft')) {
    reply += "Great! What's your opening thought?";
  } else {
    reply += "That's an interesting perspective. How does it connect to your broader argument?";
  }

  // Add assistant response to session
  session.messages.push({
    id: (Date.now() + 1).toString(),
    content: reply,
    timestamp: Date.now(),
    sender: 'assistant'
  });

  res.json({ reply });
});

// Session info endpoint
app.get('/api/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = getSession(sessionId);
  res.json(session);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});