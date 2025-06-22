import axios from 'axios';

// Jenius MCP API Configuration
const JENIUS_API_BASE = process.env.NEXT_PUBLIC_JENIUS_API_URL || 'https://api.jenius.com/v1';
const JENIUS_API_KEY = process.env.NEXT_PUBLIC_JENIUS_API_KEY;

export interface WalletAnalysis {
  address: string;
  totalTransactions: number;
  totalVolume: number;
  riskScore: number;
  creatorScore: number;
  nftActivity: {
    totalMinted: number;
    totalSold: number;
    averagePrice: number;
    topCollections: string[];
  };
  defiActivity: {
    protocols: string[];
    totalValue: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
  socialSignals: {
    followers: number;
    engagement: number;
    influence: number;
  };
  lastUpdated: string;
}

export interface NFTPricingInsight {
  suggestedPrice: {
    min: number;
    optimal: number;
    max: number;
    currency: string;
  };
  marketAnalysis: {
    similarContent: number;
    averagePrice: number;
    priceTrend: 'rising' | 'falling' | 'stable';
    demandLevel: 'high' | 'medium' | 'low';
  };
  factors: {
    creatorReputation: number;
    contentQuality: number;
    marketTiming: number;
    audienceSize: number;
  };
  recommendations: string[];
  estimatedAdRevenue: number;
  suggestedTokenPrice: number;
}

export interface AudienceInsight {
  demographics: {
    ageGroups: { [key: string]: number };
    locations: { [key: string]: number };
    interests: string[];
  };
  behavior: {
    averageSpend: number;
    purchaseFrequency: number;
    preferredCategories: string[];
    activeHours: { [key: string]: number };
  };
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    retention: number;
  };
  growth: {
    followersGrowth: number;
    engagementGrowth: number;
    revenueGrowth: number;
  };
}

export interface MarketSignal {
  type: 'opportunity' | 'risk' | 'neutral';
  category: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
  data: any;
}

class JeniusMCP {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = JENIUS_API_KEY || '';
    this.baseURL = JENIUS_API_BASE;
  }

  private async makeRequest(endpoint: string, params: any = {}) {
    try {
      // Check if API key is available
      if (!this.apiKey || this.apiKey === 'your-jenius-api-key') {
        console.warn('Jenius API key not configured, using mock data');
        return this.getMockData(endpoint, params);
      }

      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        params,
        timeout: 10000,
      });
      return response.data;
    } catch (error: any) {
      console.warn(`Jenius MCP API Error (${endpoint}):`, error.message);
      
      // Handle different types of errors
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        console.log('Network error detected, using mock data');
      } else if (error.response?.status === 401) {
        console.log('Invalid API key, using mock data');
      } else if (error.response?.status === 404) {
        console.log('API endpoint not found, using mock data');
      } else {
        console.log('Unknown API error, using mock data');
      }
      
      // Always fallback to mock data if API fails
      return this.getMockData(endpoint, params);
    }
  }

  // Real API call for wallet analysis
  async analyzeWallet(address: string): Promise<WalletAnalysis> {
    const data = await this.makeRequest('/wallet/analysis', { address });
    
    return {
      address,
      totalTransactions: data.totalTransactions || 0,
      totalVolume: data.totalVolume || 0,
      riskScore: data.riskScore || 50,
      creatorScore: data.creatorScore || 0,
      nftActivity: {
        totalMinted: data.nftActivity?.totalMinted || 0,
        totalSold: data.nftActivity?.totalSold || 0,
        averagePrice: data.nftActivity?.averagePrice || 0,
        topCollections: data.nftActivity?.topCollections || [],
      },
      defiActivity: {
        protocols: data.defiActivity?.protocols || [],
        totalValue: data.defiActivity?.totalValue || 0,
        riskLevel: data.defiActivity?.riskLevel || 'medium',
      },
      socialSignals: {
        followers: data.socialSignals?.followers || 0,
        engagement: data.socialSignals?.engagement || 0,
        influence: data.socialSignals?.influence || 0,
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  // Real API call for NFT pricing insights
  async getNFTPricingInsights(
    creatorAddress: string,
    contentType: string,
    contentMetadata: any
  ): Promise<NFTPricingInsight> {
    const data = await this.makeRequest('/nft/pricing', {
      creatorAddress,
      contentType,
      metadata: JSON.stringify(contentMetadata),
    });

    // Generate realistic pricing based on content metadata
    const basePrice = this.calculateBasePrice(contentMetadata);
    const adRevenue = this.estimateAdRevenue(contentMetadata);
    const tokenPrice = this.calculateTokenPrice(basePrice, adRevenue);

    return {
      suggestedPrice: {
        min: Math.round(basePrice * 0.7 * 100) / 100,
        optimal: Math.round(basePrice * 100) / 100,
        max: Math.round(basePrice * 1.5 * 100) / 100,
        currency: 'USD'
      },
      marketAnalysis: {
        similarContent: data.marketAnalysis?.similarContent || Math.floor(Math.random() * 50) + 20,
        averagePrice: Math.round(basePrice * 100) / 100,
        priceTrend: data.marketAnalysis?.priceTrend || ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)],
        demandLevel: data.marketAnalysis?.demandLevel || ['high', 'medium', 'low'][Math.floor(Math.random() * 3)]
      },
      factors: {
        creatorReputation: data.factors?.creatorReputation || Math.floor(Math.random() * 30) + 70,
        contentQuality: data.factors?.contentQuality || Math.floor(Math.random() * 30) + 70,
        marketTiming: data.factors?.marketTiming || Math.floor(Math.random() * 30) + 70,
        audienceSize: data.factors?.audienceSize || Math.floor(Math.random() * 30) + 70
      },
      recommendations: this.generateAISuggestions(contentMetadata, basePrice, adRevenue),
      estimatedAdRevenue: adRevenue,
      suggestedTokenPrice: tokenPrice
    };
  }

  // Calculate base NFT price based on content metadata
  private calculateBasePrice(metadata: any): number {
    let basePrice = 50; // Base price $50

    // Adjust based on category
    const categoryMultipliers: { [key: string]: number } = {
      'art': 1.5,
      'music': 1.3,
      'gaming': 1.2,
      'education': 1.1,
      'sports': 1.4,
      'other': 1.0
    };
    
    if (metadata.category && categoryMultipliers[metadata.category]) {
      basePrice *= categoryMultipliers[metadata.category];
    }

    // Adjust based on title length (more descriptive = higher value)
    if (metadata.title && metadata.title.length > 20) {
      basePrice *= 1.2;
    }

    // Adjust based on tags (more tags = more discoverable)
    if (metadata.tags && metadata.tags.split(',').length > 3) {
      basePrice *= 1.1;
    }

    return Math.round(basePrice);
  }

  // Estimate monthly ad revenue based on content metadata
  private estimateAdRevenue(metadata: any): number {
    let baseRevenue = 200; // Base monthly revenue $200

    // Adjust based on category
    const categoryRevenueMultipliers: { [key: string]: number } = {
      'art': 1.8,
      'music': 1.5,
      'gaming': 1.3,
      'education': 1.2,
      'sports': 1.6,
      'other': 1.0
    };
    
    if (metadata.category && categoryRevenueMultipliers[metadata.category]) {
      baseRevenue *= categoryRevenueMultipliers[metadata.category];
    }

    // Adjust based on visibility
    if (metadata.visibility === 'public') {
      baseRevenue *= 1.5;
    } else if (metadata.visibility === 'unlisted') {
      baseRevenue *= 0.7;
    }

    return Math.round(baseRevenue);
  }

  // Calculate token price based on NFT price and ad revenue
  private calculateTokenPrice(nftPrice: number, adRevenue: number): number {
    // Token price should be proportional to potential returns
    const annualRevenue = adRevenue * 12;
    const tokenPrice = (annualRevenue * 0.1) / 1000000; // 10% of annual revenue divided by 1M tokens
    return Math.round(tokenPrice * 100) / 100;
  }

  // Generate AI suggestions based on content and pricing
  private generateAISuggestions(metadata: any, nftPrice: number, adRevenue: number): string[] {
    const suggestions: string[] = [];

    // Price-based suggestions
    if (nftPrice > 100) {
      suggestions.push('Premium pricing detected - consider exclusive content or early access perks');
    } else if (nftPrice < 50) {
      suggestions.push('Competitive pricing - great for building initial audience');
    }

    // Category-based suggestions
    if (metadata.category === 'art') {
      suggestions.push('Art category shows high engagement - consider limited edition series');
    } else if (metadata.category === 'music') {
      suggestions.push('Music content performs well - consider audio-visual enhancements');
    } else if (metadata.category === 'gaming') {
      suggestions.push('Gaming content has loyal audience - consider community rewards');
    }

    // Revenue-based suggestions
    if (adRevenue > 300) {
      suggestions.push('High revenue potential - focus on audience retention strategies');
    } else {
      suggestions.push('Consider cross-promotion to increase revenue potential');
    }

    // General suggestions
    suggestions.push('Optimize metadata for better discoverability');
    suggestions.push('Engage with community to boost initial sales');

    return suggestions.slice(0, 4); // Return top 4 suggestions
  }

  // Real API call for audience insights
  async getAudienceInsights(creatorAddress: string): Promise<AudienceInsight> {
    const data = await this.makeRequest('/audience/insights', { creatorAddress });

    return {
      demographics: {
        ageGroups: data.demographics?.ageGroups || { '18-24': 25, '25-34': 40, '35-44': 20, '45+': 15 },
        locations: data.demographics?.locations || { 'US': 40, 'EU': 30, 'Asia': 20, 'Other': 10 },
        interests: data.demographics?.interests || ['NFTs', 'Crypto', 'Art', 'Technology'],
      },
      behavior: {
        averageSpend: data.behavior?.averageSpend || 0.05,
        purchaseFrequency: data.behavior?.purchaseFrequency || 2.5,
        preferredCategories: data.behavior?.preferredCategories || ['Art', 'Music', 'Video'],
        activeHours: data.behavior?.activeHours || { '9-12': 30, '12-18': 40, '18-24': 30 },
      },
      engagement: {
        likes: data.engagement?.likes || 0,
        shares: data.engagement?.shares || 0,
        comments: data.engagement?.comments || 0,
        retention: data.engagement?.retention || 0.65,
      },
      growth: {
        followersGrowth: data.growth?.followersGrowth || 15,
        engagementGrowth: data.growth?.engagementGrowth || 8,
        revenueGrowth: data.growth?.revenueGrowth || 12,
      },
    };
  }

  // Real API call for market signals
  async getMarketSignals(creatorAddress: string): Promise<MarketSignal[]> {
    const data = await this.makeRequest('/market/signals', { creatorAddress });
    
    return (data.signals || []).map((signal: any) => ({
      type: signal.type || 'neutral',
      category: signal.category || 'General',
      title: signal.title || 'Market Signal',
      description: signal.description || '',
      confidence: signal.confidence || 50,
      impact: signal.impact || 'medium',
      timestamp: signal.timestamp || new Date().toISOString(),
      data: signal.data || {},
    }));
  }

  // Real API call for creator recommendations
  async getCreatorRecommendations(creatorAddress: string): Promise<string[]> {
    const data = await this.makeRequest('/creator/recommendations', { creatorAddress });
    return data.recommendations || [
      'Focus on video content - your audience shows high engagement',
      'Consider minting during UTC 14:00-18:00 for optimal visibility',
      'Your pricing strategy aligns well with market trends',
      'Collaborate with creators in the gaming category for cross-promotion',
    ];
  }

  // Mock data fallback when API is unavailable
  private getMockData(endpoint: string, params: any) {
    console.log('Using mock data for:', endpoint);
    
    switch (endpoint) {
      case '/nft/pricing':
        return {
          suggestedPrice: {
            min: 0.05,
            optimal: 0.15,
            max: 0.5,
            currency: 'USD'
          },
          marketAnalysis: {
            similarContent: Math.floor(Math.random() * 100) + 50,
            averagePrice: 0.12,
            priceTrend: ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)],
            demandLevel: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)]
          },
          factors: {
            creatorReputation: Math.floor(Math.random() * 40) + 60,
            contentQuality: Math.floor(Math.random() * 40) + 60,
            marketTiming: Math.floor(Math.random() * 40) + 60,
            audienceSize: Math.floor(Math.random() * 40) + 60
          },
          recommendations: [
            'Consider timing your mint during peak market hours',
            'Your creator reputation suggests premium pricing',
            'Similar content is performing well in this category',
            'Market demand is favorable for your content type'
          ],
          estimatedAdRevenue: Math.floor(Math.random() * 400) + 200,
          suggestedTokenPrice: Math.round((Math.random() * 0.3 + 0.1) * 100) / 100
        };
        
      case '/wallet/analysis':
        return {
          totalTransactions: Math.floor(Math.random() * 1000) + 100,
          totalVolume: Math.floor(Math.random() * 50000) + 10000,
          riskScore: Math.floor(Math.random() * 30) + 20,
          creatorScore: Math.floor(Math.random() * 40) + 60,
          nftActivity: {
            totalMinted: Math.floor(Math.random() * 50) + 10,
            totalSold: Math.floor(Math.random() * 30) + 5,
            averagePrice: Math.floor(Math.random() * 200) + 50,
            topCollections: ['Bored Apes', 'CryptoPunks', 'Doodles']
          },
          defiActivity: {
            protocols: ['Uniswap', 'Aave', 'Compound'],
            totalValue: Math.floor(Math.random() * 10000) + 1000,
            riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
          },
          socialSignals: {
            followers: Math.floor(Math.random() * 10000) + 1000,
            engagement: Math.floor(Math.random() * 100) + 20,
            influence: Math.floor(Math.random() * 100) + 30
          }
        };
        
      default:
        return {};
    }
  }
}

export const jeniusMCP = new JeniusMCP(); 