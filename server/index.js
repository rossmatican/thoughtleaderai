import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory session storage (replace with proper DB in production)
const sessions = new Map();

// Helper function to get or create session
function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      id: sessionId,
      startTime: Date.now(),
      messages: [],
      analyses: []
    });
  }
  return sessions.get(sessionId);
}

// Analyse endpoint - for Live mode
app.post('/api/analyse', (req, res) => {
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