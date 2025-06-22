'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Play, ArrowRight, Loader2, Brain, Zap } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import Scorecard from '@/components/Scorecard';
import CometExperimentTracker from '@/components/CometExperimentTracker';
import { cometLogger } from '@/utils/cometLogger';

export default function SmartEditPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);
  const [scorecardData, setScorecardData] = useState({
    coherence: 0,
    promptCoverage: 0,
    hallucination: 0,
    visualQuality: 0
  });
  const [videoFileName, setVideoFileName] = useState('');
  const [enhancementHistory, setEnhancementHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showComet, setShowComet] = useState(false);

  useEffect(() => {
    console.log('Smart-edit page loading...');
    const videoData = sessionStorage.getItem('uploadedVideo');
    console.log('Video data from session storage:', videoData);
    
    if (videoData) {
      try {
        const parsed = JSON.parse(videoData);
        console.log('Parsed video data:', parsed);
        setVideoFileName(parsed.name);
      } catch (error) {
        console.error('Error parsing video data:', error);
        router.push('/upload');
      }
    } else {
      console.log('No video data found, redirecting to upload');
      router.push('/upload');
    }

    // Load enhancement history from Comet
    loadEnhancementHistory();
  }, [router]);

  const loadEnhancementHistory = async () => {
    try {
      // Get enhancement history from Comet Opik
      const logs = cometLogger.getAllLogs();
      const history = logs.map(log => ({
        id: log.id,
        prompt: log.prompt,
        timestamp: log.timestamp,
        averageScore: Math.round((log.scorecard.coherence + log.scorecard.promptCoverage + log.scorecard.hallucination + log.scorecard.visualQuality) / 4),
        videoId: log.videoId
      }));
      setEnhancementHistory(history);
    } catch (error) {
      console.error('Failed to load enhancement history:', error);
    }
  };

  const generateMockVideoUrl = () => {
    // First try to get the file from memory (window.__uploadedVideoFile)
    const fileInMemory = (window as any).__uploadedVideoFile;
    if (fileInMemory) {
      return URL.createObjectURL(fileInMemory);
    }
    
    // Fallback to sessionStorage metadata
    const videoData = sessionStorage.getItem('uploadedVideo');
    if (videoData) {
      try {
        const parsed = JSON.parse(videoData);
        console.log('Using video data:', parsed);
        // Use the preview URL if available
        return parsed.preview || 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
      } catch (error) {
        console.error('Error parsing video data:', error);
        return 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
      }
    }
    return 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
  };

  const handleProcessVideo = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    
    // Simulate AI processing with Comet Opik integration
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate mock scorecard data
    const mockScores = {
      coherence: Math.floor(Math.random() * 40) + 60,
      promptCoverage: Math.floor(Math.random() * 40) + 60,
      hallucination: Math.floor(Math.random() * 40) + 60,
      visualQuality: Math.floor(Math.random() * 40) + 60
    };
    
    setScorecardData(mockScores);
    
    // Enhanced Comet Opik integration with more metadata
    const videoId = `video_${Date.now()}`;
    const enhancementData = {
      videoId,
      prompt,
      scorecard: mockScores,
      metadata: {
        fileName: videoFileName,
        fileSize: Math.floor(Math.random() * 100) + 10, // MB
        duration: Math.floor(Math.random() * 300) + 30, // seconds
        resolution: '1920x1080',
        format: 'MP4',
        enhancementType: 'AI_VIDEO_ENHANCEMENT',
        modelVersion: 'v2.1',
        processingTime: 3000,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    };
    
    cometLogger.logPromptAndScorecard(
      videoId,
      prompt,
      {
        ...mockScores,
        modelVersion: 'v2.1',
        processingTime: 3000,
        userSatisfaction: 4.5, // Example, could be dynamic
      },
      'smart'
    );
    
    // Store enhancement data for history
    const existingHistory = JSON.parse(localStorage.getItem('enhancementHistory') || '[]');
    existingHistory.push(enhancementData);
    localStorage.setItem('enhancementHistory', JSON.stringify(existingHistory));
    
    setIsProcessing(false);
    setShowScorecard(true);
    loadEnhancementHistory(); // Refresh history
  };

  const handleRefineManually = () => {
    router.push('/manual-edit');
  };

  const handleContinueToMint = () => {
    // Check upload choice to determine if user wants to skip manual edit
    const uploadData = localStorage.getItem('uploadData');
    if (uploadData) {
      try {
        const parsed = JSON.parse(uploadData);
        if (parsed.uploadChoice === 'direct') {
          // For direct upload, skip manual edit and go straight to mint
          router.push('/mint');
        } else {
          // For AI enhanced and manual edit, go to manual edit first
          router.push('/manual-edit');
        }
      } catch (error) {
        console.error('Error parsing upload data:', error);
        router.push('/manual-edit');
      }
    } else {
      router.push('/manual-edit');
    }
  };

  const getPromptSuggestion = () => {
    const suggestions = [
      'Make this a cinematic masterpiece with dramatic lighting',
      'Transform into a fast-paced action montage',
      'Add professional color grading and smooth transitions',
      'Create an artistic slow-motion sequence',
      'Enhance with dynamic camera movements and effects'
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-16">
        {/* Animated Orb with Rotating Discs */}
        <div className="relative flex items-center justify-center mb-10" style={{ height: 180 }}>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Outer disc */}
            <span className="absolute w-40 h-40 rounded-full border-4 border-purple-500/30 animate-spin-slow" style={{ borderTopColor: '#a855f7', borderBottomColor: '#ec4899', borderLeftColor: 'transparent', borderRightColor: 'transparent' }}></span>
            {/* Middle disc */}
            <span className="absolute w-28 h-28 rounded-full border-4 border-pink-500/30 animate-spin-reverse" style={{ borderTopColor: '#ec4899', borderBottomColor: '#6366f1', borderLeftColor: 'transparent', borderRightColor: 'transparent' }}></span>
            {/* Inner disc */}
            <span className="absolute w-16 h-16 rounded-full border-4 border-blue-500/30 animate-spin-slow" style={{ borderTopColor: '#6366f1', borderBottomColor: '#a855f7', borderLeftColor: 'transparent', borderRightColor: 'transparent' }}></span>
            {/* Center orb */}
            <span className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 shadow-2xl animate-pulse"></span>
          </div>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-x mb-4 drop-shadow-lg">
            AI Video Enhancement
          </h1>
          <p className="text-xl text-gray-300">
            Describe your vision and let AI bring it to life
          </p>
        </div>
        {/* Prompt Input Card */}
        <div className="w-full bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-xl p-8 animate-fade-in flex flex-col items-center">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
            Enhancement Prompt
          </h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe how you want to enhance your video... (e.g., 'Make this a cinematic montage', 'Add dramatic lighting', 'Create a fast-paced edit')"
            className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 resize-none mb-4"
            disabled={isProcessing}
          />
          <div className="mt-2 mb-4 w-full">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Quick suggestions:</p>
              <button
                onClick={() => setPrompt(getPromptSuggestion())}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                disabled={isProcessing}
              >
                Get Suggestion
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                'Make this cinematic',
                'Add dramatic lighting',
                'Fast-paced edit',
                'Professional color grading',
                'Smooth transitions'
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setPrompt(example)}
                  className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full hover:bg-purple-900/40 transition-colors border border-gray-700"
                  disabled={isProcessing}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleProcessVideo}
            disabled={!prompt.trim() || isProcessing}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-3 px-6 rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 border-2 border-transparent hover:border-purple-400 animate-glow"
            style={{ backgroundSize: '200% 200%', animation: 'gradient-x 4s ease infinite' }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Enhancing with AI...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                <span>Enhance Video</span>
              </>
            )}
          </button>
        </div>
        {/* Processing State, Results, and Comet Tracker below */}
        <div className="w-full mt-10">
          {isProcessing && (
            <div className="bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-xl p-6 animate-fade-in mt-6">
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 text-purple-400 animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  AI is Enhancing Your Video
                </h3>
                <p className="text-gray-400">
                  Analyzing content, applying enhancements, and generating quality metrics...
                </p>
                <div className="mt-4 text-sm text-purple-400">
                  Powered by Comet Opik - Tracking enhancement quality
                </div>
              </div>
            </div>
          )}
          {showScorecard && (
            <>
              <Scorecard
                coherence={scorecardData.coherence}
                promptCoverage={scorecardData.promptCoverage}
                hallucination={scorecardData.hallucination}
                visualQuality={scorecardData.visualQuality}
              />
              <div className="bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-xl p-6 animate-fade-in mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Next Steps
                </h3>
                <div className="space-y-4">
                  {/* Check upload choice to show appropriate options */}
                  {(() => {
                    const uploadData = localStorage.getItem('uploadData');
                    if (uploadData) {
                      try {
                        const parsed = JSON.parse(uploadData);
                        if (parsed.uploadChoice === 'direct') {
                          // For direct upload, show option to go straight to mint
                          return (
                            <>
                              <button
                                onClick={handleRefineManually}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                              >
                                <span>Refine Manually</span>
                                <ArrowRight className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => router.push('/mint')}
                                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                              >
                                <span>Skip to Mint</span>
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            </>
                          );
                        } else {
                          // For AI enhanced and manual edit, always go to manual edit
                          return (
                            <>
                              <button
                                onClick={handleRefineManually}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                              >
                                <span>Continue to Manual Edit</span>
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            </>
                          );
                        }
                      } catch (error) {
                        console.error('Error parsing upload data:', error);
                      }
                    }
                    // Default fallback
                    return (
                      <>
                        <button
                          onClick={handleRefineManually}
                          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>Refine Manually</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleContinueToMint}
                          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>Continue to Mint</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            </>
          )}
          {!isProcessing && !showScorecard && (
            <div className="bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-xl p-6 animate-fade-in mt-6">
              <div className="text-center text-gray-400">
                <Sparkles className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Ready for Enhancement
                </h3>
                <p>
                  Enter a prompt and click "Enhance Video" to see AI-powered improvements and quality metrics.
                </p>
                <div className="mt-4 text-sm text-purple-400">
                  All enhancements are tracked by Comet Opik for quality assurance
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Comet Experiment Tracker - Expandable Section */}
        <div className="w-full mt-10">
          <button
            onClick={() => setShowComet((prev) => !prev)}
            className="mx-auto block mb-4 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-700 via-pink-600 to-blue-600 text-white font-semibold shadow-lg hover:from-purple-800 hover:to-blue-700 transition-all animate-glow"
          >
            {showComet ? 'Hide' : 'Show'} AI Enhancement Analytics
          </button>
          {showComet && (
            <CometExperimentTracker />
          )}
        </div>
      </div>
    </div>
  );
} 