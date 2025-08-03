import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

class ClaudeService {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY || '',
    });
    this.model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';
  }

  async sendMessage(messages, systemPrompt = null) {
    try {
      const messageArray = Array.isArray(messages) ? messages : [{ role: 'user', content: messages }];
      
      const params = {
        model: this.model,
        max_tokens: 4096,
        messages: messageArray,
      };

      if (systemPrompt) {
        params.system = systemPrompt;
      }

      const response = await this.anthropic.messages.create(params);
      return response.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error(`Failed to get response from Claude: ${error.message}`);
    }
  }

  async analyzeWriting(text, analysisType = 'general') {
    const prompts = {
      general: `Analyze the following text and provide constructive feedback on writing quality, clarity, and structure. Be encouraging but specific about areas for improvement.`,
      
      realtime: `You are providing real-time feedback as someone writes. The text may be incomplete. Offer brief, helpful suggestions about what they've written so far. Focus on immediate improvements they can make. Keep feedback concise (2-3 sentences max).`,
      
      paper: `You are helping with an academic or professional paper. Analyze the text for:
      1. Argument structure and logical flow
      2. Evidence and support for claims
      3. Academic tone and style
      4. Areas that need more development
      Provide specific, actionable feedback.`,
      
      voice: `Analyze this text for voice characteristics and authenticity. Identify:
      1. Unique stylistic elements
      2. Patterns that might indicate AI-generated content
      3. Suggestions to strengthen personal voice
      4. Areas where the writing feels generic`
    };

    const systemPrompt = prompts[analysisType] || prompts.general;
    
    return await this.sendMessage(
      [{ role: 'user', content: text }],
      systemPrompt
    );
  }

  async provideSocraticGuidance(text, context = {}) {
    const systemPrompt = `You are a Socratic writing coach. Based on the text provided, ask 1-2 thought-provoking questions that will help the writer:
    1. Clarify their thinking
    2. Deepen their argument
    3. Find their authentic voice
    4. Challenge assumptions
    
    Keep questions brief and focused. Don't provide answers, just guide thinking.`;

    const userMessage = `Text: ${text}\n\nContext: ${JSON.stringify(context)}`;
    
    return await this.sendMessage(
      [{ role: 'user', content: userMessage }],
      systemPrompt
    );
  }

  async detectAIPatterns(text) {
    const systemPrompt = `Analyze this text for patterns that suggest AI-generated content. Look for:
    1. Hedge words and phrases
    2. Overly structured formatting
    3. Generic transitions
    4. Lack of personal voice
    
    Return a JSON object with:
    - aiScore: 0-100 (100 = definitely AI)
    - patterns: array of detected patterns
    - suggestions: array of ways to make it more authentic`;

    try {
      const response = await this.sendMessage(
        [{ role: 'user', content: text }],
        systemPrompt
      );
      
      // Try to parse as JSON, fallback to structured response
      try {
        return JSON.parse(response);
      } catch {
        // If not valid JSON, create structured response
        return {
          aiScore: 50,
          patterns: ['Unable to parse detailed patterns'],
          suggestions: [response]
        };
      }
    } catch (error) {
      console.error('AI Pattern Detection Error:', error);
      return {
        aiScore: 0,
        patterns: [],
        suggestions: ['Error analyzing patterns']
      };
    }
  }
}

export default new ClaudeService();