import { NextRequest, NextResponse } from 'next/server';

interface VideoData {
  videoId: string;
  title: string;
  description: string;
  views: number;
  likes: number;
  duration: string;
  isShortForm: boolean;
  timestamp: number;
}

interface AdRevenuePrediction {
  predictedRevenue: number;
  confidence: number;
  factors: string[];
  timeframe: string;
  marketSentiment: string;
  audienceDemographics: string[];
  contentCategory: string;
  engagementScore: number;
  viralPotential: number;
}

export async function POST(request: NextRequest) {
  try {
    const videoData: VideoData = await request.json();

    // Call Jenius MCP API for real predictions
    const jeniusResponse = await fetch('https://api.jenius.com/v1/predict-revenue', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.JENIUS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: {
          title: videoData.title,
          description: videoData.description,
          duration: videoData.duration,
          format: videoData.isShortForm ? 'short_form' : 'long_form',
          category: 'web3_crypto', // Default category
          language: 'en'
        },
        metrics: {
          views: videoData.views,
          likes: videoData.likes,
          engagement_rate: videoData.views > 0 ? (videoData.likes / videoData.views) : 0,
          age_hours: (Date.now() - videoData.timestamp) / (1000 * 60 * 60)
        },
        market_data: {
          platform: 'gebotv',
          blockchain: 'polygon',
          nft_marketplace: true
        }
      })
    });

    if (jeniusResponse.ok) {
      const jeniusData = await jeniusResponse.json();
      
      return NextResponse.json({
        predictedRevenue: jeniusData.predicted_revenue_usd,
        confidence: jeniusData.confidence_score,
        factors: jeniusData.key_factors,
        timeframe: '30 days',
        marketSentiment: jeniusData.market_sentiment,
        audienceDemographics: jeniusData.target_demographics,
        contentCategory: jeniusData.content_category,
        engagementScore: jeniusData.engagement_score,
        viralPotential: jeniusData.viral_potential
      });
    }

    // Fallback to algorithmic prediction if Jenius API fails
    const prediction = generateFallbackPrediction(videoData);
    
    return NextResponse.json(prediction);

  } catch (error) {
    console.error('Ad revenue prediction error:', error);
    
    // Return a basic prediction as fallback
    return NextResponse.json({
      predictedRevenue: 0.50,
      confidence: 0.6,
      factors: ['View count', 'Engagement rate', 'Content duration'],
      timeframe: '30 days',
      marketSentiment: 'neutral',
      audienceDemographics: ['crypto_enthusiasts', 'tech_savvy'],
      contentCategory: 'web3_education',
      engagementScore: 0.7,
      viralPotential: 0.5
    });
  }
}

function generateFallbackPrediction(videoData: VideoData): AdRevenuePrediction {
  // Calculate base revenue per view
  const baseRevenuePerView = 0.001; // $0.001 per view
  
  // Engagement multiplier based on like-to-view ratio
  const engagementRate = videoData.views > 0 ? videoData.likes / videoData.views : 0;
  const engagementMultiplier = Math.min(engagementRate * 100, 5); // Cap at 5x
  
  // Duration multiplier (shorts get higher CPM)
  const durationMultiplier = videoData.isShortForm ? 1.5 : 1.0;
  
  // Content quality multiplier based on title length and description
  const titleQuality = Math.min(videoData.title.length / 50, 1.5);
  const descriptionQuality = Math.min(videoData.description.length / 200, 1.2);
  const contentQualityMultiplier = (titleQuality + descriptionQuality) / 2;
  
  // Time decay factor (newer content performs better)
  const ageHours = (Date.now() - videoData.timestamp) / (1000 * 60 * 60);
  const timeDecay = Math.max(0.5, 1 - (ageHours / 720)); // Decay over 30 days
  
  // Calculate predicted revenue
  const predictedRevenue = videoData.views * 
    baseRevenuePerView * 
    engagementMultiplier * 
    durationMultiplier * 
    contentQualityMultiplier * 
    timeDecay;
  
  // Calculate confidence based on data quality
  const confidence = Math.min(
    0.3 + // Base confidence
    (videoData.views > 100 ? 0.2 : 0) + // View threshold
    (engagementRate > 0.05 ? 0.2 : 0) + // Engagement threshold
    (videoData.title.length > 10 ? 0.1 : 0) + // Title quality
    (videoData.description.length > 50 ? 0.1 : 0) + // Description quality
    (videoData.isShortForm ? 0.1 : 0), // Format bonus
    0.9 // Max confidence
  );
  
  // Determine factors
  const factors = [];
  if (videoData.views > 1000) factors.push('High view count');
  if (engagementRate > 0.05) factors.push('Strong engagement');
  if (videoData.isShortForm) factors.push('Short-form format');
  if (videoData.title.length > 20) factors.push('Compelling title');
  if (videoData.description.length > 100) factors.push('Detailed description');
  if (ageHours < 24) factors.push('Fresh content');
  
  // Determine market sentiment
  let marketSentiment = 'neutral';
  if (engagementRate > 0.1) marketSentiment = 'bullish';
  else if (engagementRate < 0.02) marketSentiment = 'bearish';
  
  // Determine audience demographics
  const demographics = ['crypto_enthusiasts'];
  if (videoData.isShortForm) demographics.push('mobile_users');
  if (videoData.title.toLowerCase().includes('tutorial')) demographics.push('learners');
  if (videoData.title.toLowerCase().includes('nft')) demographics.push('nft_collectors');
  
  // Calculate engagement score
  const engagementScore = Math.min(engagementRate * 10, 1.0);
  
  // Calculate viral potential
  const viralPotential = Math.min(
    (engagementRate * 5) + 
    (videoData.isShortForm ? 0.3 : 0) + 
    (ageHours < 24 ? 0.2 : 0),
    1.0
  );
  
  return {
    predictedRevenue: Math.round(predictedRevenue * 100) / 100,
    confidence: Math.round(confidence * 100) / 100,
    factors,
    timeframe: '30 days',
    marketSentiment,
    audienceDemographics: demographics,
    contentCategory: 'web3_education',
    engagementScore: Math.round(engagementScore * 100) / 100,
    viralPotential: Math.round(viralPotential * 100) / 100
  };
} 