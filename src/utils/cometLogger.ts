export interface ScorecardData {
  coherence: number;
  promptCoverage: number;
  hallucination: number;
  visualQuality: number;
  timestamp: string;
  prompt: string;
  videoId: string;
  processingTime?: number;
  userSatisfaction?: number;
  modelVersion?: string;
  promptType?: 'cinematic' | 'action' | 'artistic' | 'professional' | 'custom';
  successRate?: number;
}

export interface CometLogEntry {
  id: string;
  videoId: string;
  prompt: string;
  scorecard: ScorecardData;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  promptLength?: number;
  enhancementType?: 'smart' | 'manual' | 'auto';
}

export interface EnhancementInsight {
  type: 'performance' | 'prompt' | 'model' | 'trend';
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  data: any;
}

export interface PromptPerformance {
  promptType: string;
  averageScore: number;
  successRate: number;
  usageCount: number;
  bestPrompts: string[];
}

class CometLogger {
  private logs: CometLogEntry[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadFromLocalStorage();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private categorizePrompt(prompt: string): 'cinematic' | 'action' | 'artistic' | 'professional' | 'custom' {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('cinematic') || lowerPrompt.includes('dramatic') || lowerPrompt.includes('movie')) {
      return 'cinematic';
    }
    if (lowerPrompt.includes('action') || lowerPrompt.includes('fast') || lowerPrompt.includes('dynamic')) {
      return 'action';
    }
    if (lowerPrompt.includes('artistic') || lowerPrompt.includes('creative') || lowerPrompt.includes('slow-motion')) {
      return 'artistic';
    }
    if (lowerPrompt.includes('professional') || lowerPrompt.includes('color') || lowerPrompt.includes('grading')) {
      return 'professional';
    }
    return 'custom';
  }

  logPromptAndScorecard(
    videoId: string,
    prompt: string,
    scorecard: Omit<ScorecardData, 'timestamp' | 'prompt' | 'videoId'>,
    enhancementType: 'smart' | 'manual' | 'auto' = 'smart'
  ): CometLogEntry {
    const promptType = this.categorizePrompt(prompt);
    const averageScore = Math.round((scorecard.coherence + scorecard.promptCoverage + scorecard.hallucination + scorecard.visualQuality) / 4);
    
    const entry: CometLogEntry = {
      id: `comet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      videoId,
      prompt,
      scorecard: {
        ...scorecard,
        timestamp: new Date().toISOString(),
        prompt,
        videoId,
        promptType,
        successRate: averageScore >= 75 ? 1 : averageScore >= 60 ? 0.5 : 0
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      promptLength: prompt.length,
      enhancementType
    };

    this.logs.push(entry);
    
    // Store in localStorage for demo purposes
    this.saveToLocalStorage();
    
    // Generate insights based on new data
    this.generateInsights();
    
    return entry;
  }

  getLogsByVideoId(videoId: string): CometLogEntry[] {
    return this.logs.filter(log => log.videoId === videoId);
  }

  getAllLogs(): CometLogEntry[] {
    return this.logs;
  }

  getRecentLogs(limit: number = 10): CometLogEntry[] {
    return this.logs.slice(-limit).reverse();
  }

  getPromptPerformance(): PromptPerformance[] {
    const promptTypes = ['cinematic', 'action', 'artistic', 'professional', 'custom'];
    
    return promptTypes.map(type => {
      const typeLogs = this.logs.filter(log => log.scorecard.promptType === type);
      
      if (typeLogs.length === 0) {
        return {
          promptType: type,
          averageScore: 0,
          successRate: 0,
          usageCount: 0,
          bestPrompts: []
        };
      }

      const scores = typeLogs.map(log => {
        const { coherence, promptCoverage, hallucination, visualQuality } = log.scorecard;
        return Math.round((coherence + promptCoverage + hallucination + visualQuality) / 4);
      });

      const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const successRate = scores.filter(score => score >= 75).length / scores.length;
      
      // Get best performing prompts
      const bestPrompts = typeLogs
        .filter(log => {
          const { coherence, promptCoverage, hallucination, visualQuality } = log.scorecard;
          const score = Math.round((coherence + promptCoverage + hallucination + visualQuality) / 4);
          return score >= 80;
        })
        .map(log => log.prompt)
        .slice(0, 3);

      return {
        promptType: type,
        averageScore,
        successRate,
        usageCount: typeLogs.length,
        bestPrompts
      };
    });
  }

  generateInsights(): EnhancementInsight[] {
    const insights: EnhancementInsight[] = [];
    const recentLogs = this.getRecentLogs(20);
    
    if (recentLogs.length < 3) return insights;

    // Performance insight
    const recentScores = recentLogs.map(log => {
      const { coherence, promptCoverage, hallucination, visualQuality } = log.scorecard;
      return Math.round((coherence + promptCoverage + hallucination + visualQuality) / 4);
    });
    
    const averageRecentScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const allScores = this.logs.map(log => {
      const { coherence, promptCoverage, hallucination, visualQuality } = log.scorecard;
      return Math.round((coherence + promptCoverage + hallucination + visualQuality) / 4);
    });
    const overallAverage = allScores.reduce((a, b) => a + b, 0) / allScores.length;

    if (averageRecentScore > overallAverage + 5) {
      insights.push({
        type: 'performance',
        title: 'Performance Improving',
        description: `Recent enhancements are performing ${Math.round(averageRecentScore - overallAverage)} points better than average.`,
        recommendation: 'Keep using similar prompts and techniques.',
        confidence: 0.85,
        data: { recentAverage: averageRecentScore, overallAverage }
      });
    } else if (averageRecentScore < overallAverage - 5) {
      insights.push({
        type: 'performance',
        title: 'Performance Declining',
        description: `Recent enhancements are performing ${Math.round(overallAverage - averageRecentScore)} points below average.`,
        recommendation: 'Try different prompt types or be more specific in your descriptions.',
        confidence: 0.80,
        data: { recentAverage: averageRecentScore, overallAverage }
      });
    }

    // Prompt type insight
    const promptPerformance = this.getPromptPerformance();
    const bestPerformingType = promptPerformance.reduce((best, current) => 
      current.averageScore > best.averageScore ? current : best
    );
    
    const mostUsedType = promptPerformance.reduce((most, current) => 
      current.usageCount > most.usageCount ? current : most
    );

    if (bestPerformingType.promptType !== mostUsedType.promptType && bestPerformingType.averageScore > 80) {
      insights.push({
        type: 'prompt',
        title: 'Better Prompt Type Available',
        description: `${bestPerformingType.promptType} prompts are performing ${Math.round(bestPerformingType.averageScore - mostUsedType.averageScore)} points better than your most used type.`,
        recommendation: `Try using more ${bestPerformingType.promptType} style prompts.`,
        confidence: 0.75,
        data: { bestType: bestPerformingType, mostUsedType }
      });
    }

    // Model version insight
    const modelVersions = recentLogs
      .filter(log => log.scorecard.modelVersion)
      .reduce((acc, log) => {
        const version = log.scorecard.modelVersion!;
        if (!acc[version]) acc[version] = [];
        acc[version].push(log);
        return acc;
      }, {} as Record<string, CometLogEntry[]>);

    const versionPerformance = Object.entries(modelVersions).map(([version, logs]) => {
      const scores = logs.map(log => {
        const { coherence, promptCoverage, hallucination, visualQuality } = log.scorecard;
        return Math.round((coherence + promptCoverage + hallucination + visualQuality) / 4);
      });
      return {
        version,
        averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        usageCount: logs.length
      };
    });

    if (versionPerformance.length > 1) {
      const bestVersion = versionPerformance.reduce((best, current) => 
        current.averageScore > best.averageScore ? current : best
      );
      
      insights.push({
        type: 'model',
        title: 'Model Version Performance',
        description: `Model version ${bestVersion.version} is performing best with an average score of ${bestVersion.averageScore}.`,
        recommendation: 'Consider using the latest model version for better results.',
        confidence: 0.70,
        data: { versionPerformance, bestVersion }
      });
    }

    return insights;
  }

  getEnhancementTrends() {
    const logs = this.logs.slice(-50); // Last 50 enhancements
    const trends = {
      totalEnhancements: logs.length,
      averageScore: 0,
      promptTypeDistribution: {} as Record<string, number>,
      successRate: 0,
      averageProcessingTime: 0
    };

    if (logs.length === 0) return trends;

    const scores = logs.map(log => {
      const { coherence, promptCoverage, hallucination, visualQuality } = log.scorecard;
      return Math.round((coherence + promptCoverage + hallucination + visualQuality) / 4);
    });

    trends.averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    trends.successRate = scores.filter(score => score >= 75).length / scores.length;

    // Prompt type distribution
    logs.forEach(log => {
      const type = log.scorecard.promptType || 'custom';
      trends.promptTypeDistribution[type] = (trends.promptTypeDistribution[type] || 0) + 1;
    });

    // Average processing time
    const processingTimes = logs
      .filter(log => log.scorecard.processingTime)
      .map(log => log.scorecard.processingTime!);
    
    if (processingTimes.length > 0) {
      trends.averageProcessingTime = Math.round(processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length);
    }

    return trends;
  }

  getRecommendedPrompts(promptType?: string): string[] {
    const typeLogs = promptType 
      ? this.logs.filter(log => log.scorecard.promptType === promptType)
      : this.logs;

    if (typeLogs.length === 0) {
      return [
        'Make this a cinematic masterpiece with dramatic lighting',
        'Transform into a fast-paced action montage',
        'Add professional color grading and smooth transitions'
      ];
    }

    // Get high-performing prompts
    const highPerformingLogs = typeLogs.filter(log => {
      const { coherence, promptCoverage, hallucination, visualQuality } = log.scorecard;
      const score = Math.round((coherence + promptCoverage + hallucination + visualQuality) / 4);
      return score >= 80;
    });

    return highPerformingLogs
      .map(log => log.prompt)
      .slice(0, 5);
  }

  private saveToLocalStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('comet_logs', JSON.stringify(this.logs));
    }
  }

  loadFromLocalStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('comet_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    }
  }

  // Simulate Comet Opik API call
  async sendToCometOpik(entry: CometLogEntry): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success/failure
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      console.log('Successfully sent to Comet Opik:', entry.id);
    } else {
      console.error('Failed to send to Comet Opik:', entry.id);
    }
    
    return success;
  }

  clearLogs() {
    this.logs = [];
    this.saveToLocalStorage();
  }
}

export const cometLogger = new CometLogger();

// Load existing logs on initialization
if (typeof window !== 'undefined') {
  cometLogger.loadFromLocalStorage();
} 