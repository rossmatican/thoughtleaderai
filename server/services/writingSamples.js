import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WritingSamplesService {
  constructor() {
    this.samplesDir = path.join(__dirname, '..', 'data', 'writing-samples');
    this.ensureDirectoryExists();
  }

  async ensureDirectoryExists() {
    try {
      await fs.mkdir(this.samplesDir, { recursive: true });
    } catch (error) {
      console.error('Error creating samples directory:', error);
    }
  }

  async saveSample(sessionId, sample) {
    const timestamp = new Date().toISOString();
    const filename = `${sessionId}_${timestamp.replace(/[:.]/g, '-')}.json`;
    const filepath = path.join(this.samplesDir, filename);

    const sampleData = {
      sessionId,
      timestamp,
      text: sample.text,
      metadata: {
        wordCount: sample.text.split(/\s+/).length,
        characterCount: sample.text.length,
        analysisType: sample.analysisType || 'general',
        cognitiveScore: sample.cognitiveScore || null,
        aiPatterns: sample.aiPatterns || null,
        feedback: sample.feedback || null
      }
    };

    try {
      await fs.writeFile(filepath, JSON.stringify(sampleData, null, 2));
      return { success: true, filename, filepath };
    } catch (error) {
      console.error('Error saving writing sample:', error);
      return { success: false, error: error.message };
    }
  }

  async getSamplesBySession(sessionId) {
    try {
      const files = await fs.readdir(this.samplesDir);
      const sessionFiles = files.filter(f => f.startsWith(sessionId));
      
      const samples = await Promise.all(
        sessionFiles.map(async (file) => {
          const content = await fs.readFile(path.join(this.samplesDir, file), 'utf-8');
          return JSON.parse(content);
        })
      );

      return samples.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Error reading samples:', error);
      return [];
    }
  }

  async getRecentSamples(limit = 10) {
    try {
      const files = await fs.readdir(this.samplesDir);
      const fileStats = await Promise.all(
        files.map(async (file) => {
          const filepath = path.join(this.samplesDir, file);
          const stats = await fs.stat(filepath);
          return { file, mtime: stats.mtime };
        })
      );

      const sortedFiles = fileStats
        .sort((a, b) => b.mtime - a.mtime)
        .slice(0, limit);

      const samples = await Promise.all(
        sortedFiles.map(async ({ file }) => {
          const content = await fs.readFile(path.join(this.samplesDir, file), 'utf-8');
          return JSON.parse(content);
        })
      );

      return samples;
    } catch (error) {
      console.error('Error reading recent samples:', error);
      return [];
    }
  }

  async analyzeTrends(sessionId) {
    const samples = await this.getSamplesBySession(sessionId);
    
    if (samples.length === 0) {
      return { hasData: false };
    }

    const trends = {
      hasData: true,
      totalSamples: samples.length,
      averageWordCount: samples.reduce((sum, s) => sum + s.metadata.wordCount, 0) / samples.length,
      cognitiveScoreTrend: [],
      aiPatternTrend: [],
      writingVelocity: []
    };

    // Calculate trends over time
    samples.forEach((sample, index) => {
      if (sample.metadata.cognitiveScore !== null) {
        trends.cognitiveScoreTrend.push({
          timestamp: sample.timestamp,
          score: sample.metadata.cognitiveScore
        });
      }

      if (sample.metadata.aiPatterns?.aiScore !== undefined) {
        trends.aiPatternTrend.push({
          timestamp: sample.timestamp,
          aiScore: sample.metadata.aiPatterns.aiScore
        });
      }

      if (index > 0) {
        const timeDiff = new Date(samples[index - 1].timestamp) - new Date(sample.timestamp);
        const wordDiff = samples[index - 1].metadata.wordCount - sample.metadata.wordCount;
        const wordsPerMinute = (wordDiff / (timeDiff / 60000));
        
        trends.writingVelocity.push({
          timestamp: sample.timestamp,
          wordsPerMinute: Math.max(0, wordsPerMinute)
        });
      }
    });

    return trends;
  }

  async exportSession(sessionId, format = 'json') {
    const samples = await this.getSamplesBySession(sessionId);
    
    if (format === 'json') {
      return JSON.stringify(samples, null, 2);
    } else if (format === 'text') {
      return samples.map(s => 
        `--- ${s.timestamp} ---\n${s.text}\n\nFeedback: ${s.metadata.feedback || 'N/A'}\n\n`
      ).join('\n');
    }
    
    return samples;
  }
}

export default new WritingSamplesService();