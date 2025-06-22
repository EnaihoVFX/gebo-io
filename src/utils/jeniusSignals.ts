export interface WalletSignal {
  type: 'risk' | 'opportunity' | 'neutral';
  category: string;
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
}

export interface WalletProfile {
  address: string;
  totalTransactions: number;
  totalVolume: number;
  riskScore: number;
  signals: WalletSignal[];
  lastUpdated: string;
}

class JeniusSignals {
  private profiles: Map<string, WalletProfile> = new Map();

  async analyzeWallet(address: string): Promise<WalletProfile> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if we have cached data
    if (this.profiles.has(address)) {
      const cached = this.profiles.get(address)!;
      // Update timestamp
      cached.lastUpdated = new Date().toISOString();
      return cached;
    }

    // Generate mock data
    const profile: WalletProfile = {
      address,
      totalTransactions: Math.floor(Math.random() * 1000) + 10,
      totalVolume: Math.random() * 1000000,
      riskScore: Math.random() * 100,
      signals: this.generateMockSignals(),
      lastUpdated: new Date().toISOString(),
    };

    this.profiles.set(address, profile);
    this.saveToLocalStorage();
    
    return profile;
  }

  private generateMockSignals(): WalletSignal[] {
    const signalTypes = [
      {
        type: 'opportunity' as const,
        category: 'NFT Trading',
        title: 'High NFT Activity',
        description: 'This wallet shows strong NFT trading patterns with 45+ transactions in the last 30 days.',
        confidence: 85
      },
      {
        type: 'risk' as const,
        category: 'Security',
        title: 'Multiple Contract Interactions',
        description: 'Wallet has interacted with 12+ smart contracts, consider reviewing for security.',
        confidence: 72
      },
      {
        type: 'neutral' as const,
        category: 'DeFi',
        title: 'Stable DeFi Usage',
        description: 'Consistent DeFi protocol usage with moderate risk exposure.',
        confidence: 65
      },
      {
        type: 'opportunity' as const,
        category: 'Content Creation',
        title: 'Creator Wallet',
        description: 'Patterns suggest this wallet belongs to a content creator with regular minting activity.',
        confidence: 78
      }
    ];

    return signalTypes.map(signal => ({
      ...signal,
      timestamp: new Date().toISOString(),
    }));
  }

  getWalletProfile(address: string): WalletProfile | null {
    return this.profiles.get(address) || null;
  }

  getAllProfiles(): WalletProfile[] {
    return Array.from(this.profiles.values());
  }

  private saveToLocalStorage() {
    if (typeof window !== 'undefined') {
      const data = Object.fromEntries(this.profiles);
      localStorage.setItem('jenius_profiles', JSON.stringify(data));
    }
  }

  loadFromLocalStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('jenius_profiles');
      if (stored) {
        const data = JSON.parse(stored);
        this.profiles = new Map(Object.entries(data));
      }
    }
  }

  // Simulate real-time signal updates
  async getRealTimeSignals(address: string): Promise<WalletSignal[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const profile = this.profiles.get(address);
    if (!profile) return [];

    // Simulate new signals appearing
    const newSignals: WalletSignal[] = [];
    
    if (Math.random() > 0.7) {
      newSignals.push({
        type: 'opportunity',
        category: 'Market',
        title: 'Market Opportunity Detected',
        description: 'Current market conditions favor content creators in your category.',
        confidence: Math.floor(Math.random() * 30) + 70,
        timestamp: new Date().toISOString(),
      });
    }

    return newSignals;
  }

  // Get risk assessment
  getRiskAssessment(address: string): { level: 'low' | 'medium' | 'high'; score: number } {
    const profile = this.profiles.get(address);
    if (!profile) return { level: 'medium', score: 50 };

    const score = profile.riskScore;
    if (score < 30) return { level: 'low', score };
    if (score < 70) return { level: 'medium', score };
    return { level: 'high', score };
  }
}

export const jeniusSignals = new JeniusSignals();

// Load existing profiles on initialization
if (typeof window !== 'undefined') {
  jeniusSignals.loadFromLocalStorage();
} 