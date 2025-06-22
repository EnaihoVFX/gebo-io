'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, DollarSign, Target, Lightbulb } from 'lucide-react';
import { jeniusMCP, NFTPricingInsight } from '@/utils/jeniusMCP';

interface PricingInsightsProps {
  creatorAddress: string;
  contentType: string;
  contentMetadata?: any;
  className?: string;
}

export default function PricingInsights({ 
  creatorAddress, 
  contentType, 
  contentMetadata = {}, 
  className = "" 
}: PricingInsightsProps) {
  const [pricingInsights, setPricingInsights] = useState<NFTPricingInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPricingInsights = async () => {
      setIsLoading(true);
      try {
        const insights = await jeniusMCP.getNFTPricingInsights(
          creatorAddress,
          contentType,
          contentMetadata
        );
        setPricingInsights(insights);
      } catch (error) {
        console.error('Failed to load pricing insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (creatorAddress) {
      loadPricingInsights();
    }
  }, [creatorAddress, contentType, contentMetadata]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'falling':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!pricingInsights) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <p className="text-gray-500 text-center">Unable to load pricing insights</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-500" />
          Optimal Pricing Insights
        </h3>
        <span className="text-sm text-gray-500">Powered by Jenius MCP</span>
      </div>

      {/* Suggested Price Range */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <DollarSign className="h-4 w-4 mr-2" />
          Jenius MCP Recommendations
        </h4>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">NFT Price</div>
            <div className="text-lg font-bold text-gray-700">
              ${pricingInsights.suggestedPrice.optimal} {pricingInsights.suggestedPrice.currency}
            </div>
            <div className="text-xs text-gray-500 mt-1">You set this price</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
            <div className="text-lg font-bold text-gray-700">
              ${pricingInsights.estimatedAdRevenue} {pricingInsights.suggestedPrice.currency}
            </div>
            <div className="text-xs text-gray-500 mt-1">Estimated earnings</div>
          </div>
        </div>
        
        {/* Token Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm text-blue-600">Initial Token Price</div>
              <div className="text-lg font-bold text-blue-700">
                ${pricingInsights.suggestedTokenPrice} {pricingInsights.suggestedPrice.currency}
              </div>
              <div className="text-xs text-blue-500 mt-1">Market-driven</div>
            </div>
            <div>
              <div className="text-sm text-green-600">Creator Stake</div>
              <div className="text-lg font-bold text-green-700">
                1% (10,000 tokens)
              </div>
              <div className="text-xs text-green-500 mt-1">Initial allocation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Analysis */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Market Analysis</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Similar Content</span>
              <span className="font-semibold">{pricingInsights.marketAnalysis.similarContent}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Price</span>
              <span className="font-semibold">
                {pricingInsights.marketAnalysis.averagePrice} {pricingInsights.suggestedPrice.currency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Price Trend</span>
              <div className="flex items-center space-x-1">
                {getTrendIcon(pricingInsights.marketAnalysis.priceTrend)}
                <span className="font-semibold capitalize">{pricingInsights.marketAnalysis.priceTrend}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Demand Level</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(pricingInsights.marketAnalysis.demandLevel)}`}>
                {pricingInsights.marketAnalysis.demandLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Pricing Factors</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Creator Reputation</span>
                <span className="text-sm font-semibold">{pricingInsights.factors.creatorReputation}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${pricingInsights.factors.creatorReputation}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Content Quality</span>
                <span className="text-sm font-semibold">{pricingInsights.factors.contentQuality}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${pricingInsights.factors.contentQuality}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Market Timing</span>
                <span className="text-sm font-semibold">{pricingInsights.factors.marketTiming}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${pricingInsights.factors.marketTiming}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Audience Size</span>
                <span className="text-sm font-semibold">{pricingInsights.factors.audienceSize}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${pricingInsights.factors.audienceSize}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
          AI Recommendations
        </h4>
        <ul className="space-y-2">
          {pricingInsights.recommendations.map((recommendation, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              {recommendation}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 