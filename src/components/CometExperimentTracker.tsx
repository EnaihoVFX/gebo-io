'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Zap, Target, Clock, Lightbulb, ArrowUpRight, Users, Activity } from 'lucide-react';
import { cometLogger, EnhancementInsight, PromptPerformance } from '@/utils/cometLogger';

interface CometExperimentTrackerProps {
  className?: string;
}

export default function CometExperimentTracker({ className = "" }: CometExperimentTrackerProps) {
  const [insights, setInsights] = useState<EnhancementInsight[]>([]);
  const [promptPerformance, setPromptPerformance] = useState<PromptPerformance[]>([]);
  const [trends, setTrends] = useState<any>(null);
  const [selectedInsight, setSelectedInsight] = useState<EnhancementInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'insights' | 'performance' | 'trends'>('insights');

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      
      // Get real data from Comet logger
      const currentInsights = cometLogger.generateInsights();
      const currentPromptPerformance = cometLogger.getPromptPerformance();
      const currentTrends = cometLogger.getEnhancementTrends();
      
      setInsights(currentInsights);
      setPromptPerformance(currentPromptPerformance);
      setTrends(currentTrends);
      setIsLoading(false);
    };

    loadData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <TrendingUp className="h-5 w-5" />;
      case 'prompt':
        return <Lightbulb className="h-5 w-5" />;
      case 'model':
        return <Zap className="h-5 w-5" />;
      case 'trend':
        return <Activity className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'performance':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'prompt':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'model':
        return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'trend':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-xl p-6 animate-fade-in ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
            <div className="h-4 bg-gray-800 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-xl p-6 animate-fade-in ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
          AI Enhancement Analytics
        </h3>
        <span className="text-sm text-gray-400">Powered by Comet Opik</span>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'insights' 
              ? 'bg-gray-900 text-purple-400 shadow-sm' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Insights
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'performance' 
              ? 'bg-gray-900 text-purple-400 shadow-sm' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Performance
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'trends' 
              ? 'bg-gray-900 text-purple-400 shadow-sm' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Trends
        </button>
      </div>

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md bg-gray-800 border-gray-700 ${selectedInsight?.title === insight.title ? 'ring-2 ring-purple-400' : ''}`}
                onClick={() => setSelectedInsight(selectedInsight?.title === insight.title ? null : insight)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-semibold text-white">{insight.title}</h4>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-900 text-purple-300">
                    {Math.round(insight.confidence * 100)}% confidence
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 mb-2">{insight.description}</p>
                
                {selectedInsight?.title === insight.title && (
                  <div className="mt-3 p-3 bg-gray-900 rounded-lg border border-purple-800 animate-fade-in">
                    <p className="text-sm font-medium text-purple-300 mb-1">Recommendation:</p>
                    <p className="text-sm text-gray-200">{insight.recommendation}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="mx-auto h-8 w-8 mb-2" />
              <p>No insights available yet. Start enhancing videos to generate insights!</p>
            </div>
          )}
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promptPerformance
              .filter(perf => perf.usageCount > 0)
              .map((perf) => (
                <div key={perf.promptType} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 capitalize">{perf.promptType}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(perf.averageScore)}`}>
                      {perf.averageScore}/100
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-medium">{Math.round(perf.successRate * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Usage Count:</span>
                      <span className="font-medium">{perf.usageCount}</span>
                    </div>
                  </div>

                  {perf.bestPrompts.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Top Prompts:</p>
                      <div className="space-y-1">
                        {perf.bestPrompts.slice(0, 2).map((prompt, idx) => (
                          <p key={idx} className="text-xs text-gray-700 line-clamp-2">
                            "{prompt}"
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {promptPerformance.filter(perf => perf.usageCount > 0).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="mx-auto h-8 w-8 mb-2" />
              <p>No performance data available yet. Start enhancing videos!</p>
            </div>
          )}
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && trends && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{trends.totalEnhancements}</div>
              <div className="text-xs text-gray-600">Total Enhancements</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{trends.averageScore}</div>
              <div className="text-xs text-gray-600">Avg Score</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{Math.round(trends.successRate * 100)}%</div>
              <div className="text-xs text-gray-600">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{trends.averageProcessingTime}s</div>
              <div className="text-xs text-gray-600">Avg Processing</div>
            </div>
          </div>

          {/* Prompt Type Distribution */}
          {Object.keys(trends.promptTypeDistribution).length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Prompt Type Distribution</h4>
              <div className="space-y-2">
                {Object.entries(trends.promptTypeDistribution)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize text-gray-700">{type}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${((count as number) / trends.totalEnhancements) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8 text-right">{count as number}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Recent Activity
            </h4>
            <div className="space-y-2">
              {cometLogger.getRecentLogs(5).map((log) => (
                <div key={log.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700 line-clamp-1">"{log.prompt}"</span>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const recommendedPrompts = cometLogger.getRecommendedPrompts();
                if (recommendedPrompts.length > 0) {
                  alert(`Recommended prompts:\n${recommendedPrompts.slice(0, 3).join('\n')}`);
                }
              }}
              className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Get Recommendations</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all analytics data?')) {
                  cometLogger.clearLogs();
                  window.location.reload();
                }
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear Data
            </button>
          </div>
          <div className="text-xs text-gray-500">
            Data stored locally • Updates every 30s
          </div>
        </div>
      </div>
    </div>
  );
} 