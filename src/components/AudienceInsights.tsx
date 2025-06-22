'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, MapPin, Clock, DollarSign, BarChart3 } from 'lucide-react';
import { jeniusMCP, AudienceInsight } from '@/utils/jeniusMCP';

interface AudienceInsightsProps {
  creatorAddress: string;
  className?: string;
}

export default function AudienceInsights({ creatorAddress, className = "" }: AudienceInsightsProps) {
  const [audienceInsights, setAudienceInsights] = useState<AudienceInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAudienceInsights = async () => {
      setIsLoading(true);
      try {
        const insights = await jeniusMCP.getAudienceInsights(creatorAddress);
        setAudienceInsights(insights);
      } catch (error) {
        console.error('Failed to load audience insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (creatorAddress) {
      loadAudienceInsights();
    }
  }, [creatorAddress]);

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

  if (!audienceInsights) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <p className="text-gray-500 text-center">Unable to load audience insights</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2 text-purple-500" />
          Audience Insights
        </h3>
        <span className="text-sm text-gray-500">Powered by Jenius MCP</span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {audienceInsights.behavior.averageSpend.toFixed(3)}
          </div>
          <div className="text-xs text-gray-600">Avg Spend (ETH)</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {audienceInsights.behavior.purchaseFrequency.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600">Purchases/Month</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {(audienceInsights.engagement.retention * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-600">Retention</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {audienceInsights.growth.followersGrowth}%
          </div>
          <div className="text-xs text-gray-600">Growth</div>
        </div>
      </div>

      {/* Demographics */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Age Demographics
          </h4>
          <div className="space-y-2">
            {Object.entries(audienceInsights.demographics.ageGroups).map(([age, percentage]) => (
              <div key={age} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{age}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold w-8">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Geographic Distribution
          </h4>
          <div className="space-y-2">
            {Object.entries(audienceInsights.demographics.locations).map(([location, percentage]) => (
              <div key={location} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{location}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold w-8">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Top Interests</h4>
        <div className="flex flex-wrap gap-2">
          {audienceInsights.demographics.interests.map((interest, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Active Hours */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Peak Activity Hours
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(audienceInsights.behavior.activeHours).map(([hours, percentage]) => (
            <div key={hours} className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm font-semibold text-gray-900">{hours}</div>
              <div className="text-xs text-gray-600">{percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Growth Metrics
        </h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">
              +{audienceInsights.growth.followersGrowth}%
            </div>
            <div className="text-xs text-gray-600">Followers</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              +{audienceInsights.growth.engagementGrowth}%
            </div>
            <div className="text-xs text-gray-600">Engagement</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              +{audienceInsights.growth.revenueGrowth}%
            </div>
            <div className="text-xs text-gray-600">Revenue</div>
          </div>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Engagement Statistics</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Likes</span>
            <span className="font-semibold">{audienceInsights.engagement.likes.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Shares</span>
            <span className="font-semibold">{audienceInsights.engagement.shares.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Comments</span>
            <span className="font-semibold">{audienceInsights.engagement.comments.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Retention Rate</span>
            <span className="font-semibold">{(audienceInsights.engagement.retention * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
} 