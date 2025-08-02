// AI Pattern Detection Patterns
const AI_PATTERNS = {
  // Common AI hedge words and phrases
  hedgeWords: [
    'it\'s important to note', 'it\'s worth noting', 'it should be noted',
    'arguably', 'essentially', 'fundamentally', 'ultimately',
    'it\'s crucial to understand', 'it\'s essential to', 'moreover',
    'furthermore', 'additionally', 'in conclusion', 'to summarize'
  ],
  
  // Parallel structure indicators
  parallelStructures: [
    /^(First|Second|Third|Finally),?\s/gm,
    /^(On one hand|On the other hand)/gm,
    /\b(not only.*but also)\b/gi,
    /\b(while.*simultaneously)\b/gi
  ],
  
  // Generic corporate speak
  corporateSpeak: [
    'leverage', 'synergy', 'paradigm', 'utilize', 'optimize',
    'streamline', 'innovative solutions', 'best practices',
    'cutting-edge', 'state-of-the-art', 'robust', 'scalable'
  ],
  
  // AI-style transition phrases
  transitions: [
    'moving forward', 'that being said', 'with that in mind',
    'it\'s clear that', 'this highlights', 'this underscores',
    'this demonstrates', 'as we can see'
  ]
}

export const detectAIPatterns = (text) => {
  if (!text || text.length < 50) return 0
  
  let aiScore = 0
  const words = text.toLowerCase().split(/\s+/)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  
  // 1. Check for hedge words/phrases
  AI_PATTERNS.hedgeWords.forEach(phrase => {
    const occurrences = (text.toLowerCase().match(new RegExp(phrase, 'g')) || []).length
    aiScore += occurrences * 15 // Heavy penalty for hedge words
  })
  
  // 2. Check for parallel structures
  AI_PATTERNS.parallelStructures.forEach(pattern => {
    const matches = (text.match(pattern) || []).length
    aiScore += matches * 20 // Strong indicator of AI writing
  })
  
  // 3. Check for corporate speak
  AI_PATTERNS.corporateSpeak.forEach(word => {
    const occurrences = words.filter(w => w.includes(word)).length
    aiScore += occurrences * 10
  })
  
  // 4. Check for AI transitions
  AI_PATTERNS.transitions.forEach(phrase => {
    const occurrences = (text.toLowerCase().match(new RegExp(phrase, 'g')) || []).length
    aiScore += occurrences * 12
  })
  
  // 5. Sentence structure analysis
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) / sentences.length
  if (avgSentenceLength > 25) aiScore += 10 // Overly complex sentences
  if (avgSentenceLength < 8) aiScore -= 5 // Natural variation is good
  
  // 6. Check for repetitive sentence starters
  const sentenceStarters = sentences.map(s => s.trim().split(/\s+/).slice(0, 2).join(' ').toLowerCase())
  const uniqueStarters = new Set(sentenceStarters).size
  const repetitionRatio = uniqueStarters / sentenceStarters.length
  if (repetitionRatio < 0.7) aiScore += 15 // Too repetitive
  
  // 7. Vocabulary diversity check
  const uniqueWords = new Set(words.filter(w => w.length > 3)).size
  const diversityRatio = uniqueWords / words.length
  if (diversityRatio < 0.4) aiScore += 10 // Low vocabulary diversity
  
  // Cap the score at 100
  return Math.min(100, aiScore)
}

export const analyzeKeystrokeDynamics = (keystrokeBuffer) => {
  if (keystrokeBuffer.length < 10) return { avgPauseTime: 0, backspaceRatio: 0, burstiness: 0 }
  
  const recentKeystrokes = keystrokeBuffer.slice(-50) // Last 50 keystrokes
  
  // Calculate average pause time
  const pauses = recentKeystrokes.map(k => k.timeDelta).filter(t => t < 2000) // Ignore long pauses
  const avgPauseTime = pauses.reduce((sum, p) => sum + p, 0) / pauses.length
  
  // Calculate backspace ratio
  const backspaces = recentKeystrokes.filter(k => k.isBackspace).length
  const backspaceRatio = backspaces / recentKeystrokes.length
  
  // Calculate burstiness (variance in typing speed)
  const variance = pauses.reduce((sum, p) => sum + Math.pow(p - avgPauseTime, 2), 0) / pauses.length
  const burstiness = Math.sqrt(variance) / avgPauseTime
  
  return {
    avgPauseTime: Math.round(avgPauseTime),
    backspaceRatio: Math.round(backspaceRatio * 100) / 100,
    burstiness: Math.round(burstiness * 100) / 100,
    recentActivity: recentKeystrokes.length
  }
}

export const generateSocraticPrompt = (text, cognitiveScore) => {
  const prompts = {
    high_dependency: [
      "What's YOUR unique perspective on this that others might miss?",
      "Can you share a specific example from your own experience?",
      "What would you tell a friend about this in your own words?",
      "What's the one thing you disagree with most people about on this topic?",
      "How would you explain this to someone who's never heard of it before?"
    ],
    medium_dependency: [
      "What personal insight can you add to strengthen this argument?",
      "Which part of this do you feel most confident about, and why?",
      "What questions does this raise for you?",
      "How does this connect to something you've experienced?",
      "What would you change about this approach?"
    ],
    low_dependency: [
      "This sounds authentic - can you elaborate on that insight?",
      "What led you to that conclusion?",
      "How might others challenge this perspective?",
      "What would strengthen this argument even more?"
    ]
  }
  
  let category = 'low_dependency'
  if (cognitiveScore < 40) category = 'high_dependency'
  else if (cognitiveScore < 70) category = 'medium_dependency'
  
  const categoryPrompts = prompts[category]
  return categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)]
}

export const calculateImprovementScore = (baseline, current) => {
  if (!baseline || !current) return 0
  
  const improvement = current.cognitiveScore - baseline.cognitiveScore
  return Math.max(-50, Math.min(50, improvement))
}