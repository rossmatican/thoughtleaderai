import express from 'express';
import { z } from 'zod';

const router = express.Router();

// Request validation schema
const AnalyseRequestSchema = z.object({
  text: z.string().min(1, 'Text cannot be empty').max(50000, 'Text too long')
});

// Response interface
interface AnalyseResponse {
  score: number;
  breakdown: {
    ideation: number;
    structure: number;
    expression: number;
  };
  question?: string;
}

// AI dependency patterns
const AI_PHRASES = [
  "Moreover", "However", "It's important to note", "As you can see",
  "Furthermore", "Nevertheless", "In conclusion", "To summarize",
  "In other words", "That being said", "On the other hand", "In fact",
  "Indeed", "Certainly", "Undoubtedly", "Additionally", "Consequently",
  "Therefore", "Subsequently", "Ultimately", "Essentially", "Particularly",
  "Specifically", "Generally speaking", "It should be noted", "It is worth mentioning"
];

const SOCRATIC_QUESTIONS = [
  "What evidence supports this conclusion? Can you think of alternative perspectives?",
  "How did you arrive at this understanding? What assumptions might you be making?",
  "What would someone who disagrees with this position argue? How would you respond?",
  "Can you provide a specific example from your own experience that illustrates this point?",
  "What are the implications of this idea? What might be the unintended consequences?",
  "How does this connect to what you already know? What patterns do you notice?",
  "What questions does this raise for you? What would you like to explore further?",
  "If you had to explain this to someone completely unfamiliar with the topic, how would you do it?",
  "What biases might be influencing your perspective here? How could you test these ideas?",
  "What would change your mind about this? What evidence would you need to see?"
];

// Mock response for when Claude API is not available
const MOCK_RESPONSES: AnalyseResponse[] = [
  {
    score: 0.3,
    breakdown: { ideation: 0.2, structure: 0.4, expression: 0.3 },
  },
  {
    score: 0.6,
    breakdown: { ideation: 0.5, structure: 0.7, expression: 0.6 },
  },
  {
    score: 0.85,
    breakdown: { ideation: 0.8, structure: 0.9, expression: 0.85 },
    question: SOCRATIC_QUESTIONS[Math.floor(Math.random() * SOCRATIC_QUESTIONS.length)]
  }
];

function scoreDependency(text: string): AnalyseResponse {
  const words = text.toLowerCase().split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Count AI phrases
  let aiPhraseCount = 0;
  AI_PHRASES.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase.toLowerCase()}\\b`, 'g');
    const matches = text.toLowerCase().match(regex);
    if (matches) aiPhraseCount += matches.length;
  });
  
  // Calculate metrics
  const aiPhraseRatio = Math.min(aiPhraseCount / Math.max(sentences.length, 1), 1);
  const avgSentenceLength = words.length / Math.max(sentences.length, 1);
  const longSentenceRatio = sentences.filter(s => s.split(/\s+/).length > 25).length / Math.max(sentences.length, 1);
  
  // Complex words (more than 3 syllables) - simplified heuristic
  const complexWords = words.filter(word => word.length > 8).length;
  const complexWordRatio = complexWords / Math.max(words.length, 1);
  
  // Scoring (0-1 scale)
  const ideationScore = Math.min(aiPhraseRatio * 2 + complexWordRatio, 1);
  const structureScore = Math.min(longSentenceRatio * 2 + (avgSentenceLength > 20 ? 0.3 : 0), 1);
  const expressionScore = Math.min(aiPhraseRatio * 1.5 + (avgSentenceLength > 25 ? 0.2 : 0), 1);
  
  const overallScore = (ideationScore + structureScore + expressionScore) / 3;
  
  const response: AnalyseResponse = {
    score: Math.round(overallScore * 100) / 100,
    breakdown: {
      ideation: Math.round(ideationScore * 100) / 100,
      structure: Math.round(structureScore * 100) / 100,
      expression: Math.round(expressionScore * 100) / 100,
    }
  };
  
  // Add question if score > 0.7
  if (response.score > 0.7) {
    response.question = SOCRATIC_QUESTIONS[Math.floor(Math.random() * SOCRATIC_QUESTIONS.length)];
  }
  
  return response;
}

router.post('/', async (req, res) => {
  try {
    // Validate request
    const { text } = AnalyseRequestSchema.parse(req.body);
    
    // Check if Claude API key is available
    const claudeApiKey = process.env.CLAUDE_API_KEY;
    
    if (!claudeApiKey) {
      console.log('No Claude API key found, using mock scoring...');
      const result = scoreDependency(text);
      return res.json(result);
    }
    
    // TODO: Implement actual Claude API call here
    // For now, fall back to mock scoring even with API key
    console.log('Using mock scoring (Claude integration not implemented yet)...');
    const result = scoreDependency(text);
    
    res.json(result);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    
    console.error('Analysis error:', error);
    
    // Fallback to mock response
    const mockResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
    res.json(mockResponse);
  }
});

export { router as analyseRouter };