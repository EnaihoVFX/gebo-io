'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Video, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Wallet, Settings, Play, Eye, DollarSign, Users, Target, Zap, Coins, Crown } from 'lucide-react';
import { jeniusMCP, WalletAnalysis, MarketSignal } from '@/utils/jeniusMCP';
import { cometLogger } from '@/utils/cometLogger';
import AudienceInsights from '@/components/AudienceInsights';
import CometExperimentTracker from '@/components/CometExperimentTracker';
import Link from 'next/link';

interface MintedVideo {
  name: string;
  title: string;
  description: string;
  tags: string;
  category: string;
  visibility: string;
  ipfsHash: string;
  tokenId: string;
  transactionHash: string;
  fileName: string;
  mintedAt: string;
  nftPrice: number;
  coinPrice: number;
  coinSupply: number;
  estimatedRevenue: number;
  creatorTokenStake: number;
  isListed: boolean;
  id: string;
  thumbnailUrl: string;
}

interface VideoStake {
  videoId: string;
  amount: number;
  cost: number;
  timestamp: string;
}

interface OwnedNFT {
  videoId: string;
  price: number;
  timestamp: string;
}

export default function DashboardPage() {
  const [mintedVideos, setMintedVideos] = useState<MintedVideo[]>([]);
  const [videoStakes, setVideoStakes] = useState<VideoStake[]>([]);
  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([]);
  const [walletAnalysis, setWalletAnalysis] = useState<WalletAnalysis | null>(null);
  const [marketSignals, setMarketSignals] = useState<MarketSignal[]>([]);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [cometLogs, setCometLogs] = useState<any[]>([]);
  const [averageScore, setAverageScore] = useState(0);
  const [highQualityCount, setHighQualityCount] = useState(0);
  const [recentEnhancements, setRecentEnhancements] = useState(0);

  useEffect(() => {
    // Mock wallet address for demo
    const mockAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
    setWalletAddress(mockAddress);
    analyzeWallet(mockAddress);
    
    // Load Comet Opik analytics
    loadCometAnalytics();
    
    // Load minted videos, stakes, and NFTs
    loadUserData();
  }, []);

  const loadUserData = () => {
    // Load minted videos
    const videos = JSON.parse(localStorage.getItem('mintedVideos') || '[]');
    setMintedVideos(videos);
    
    // Load video stakes
    const stakes = JSON.parse(localStorage.getItem('videoStakes') || '[]');
    setVideoStakes(stakes);
    
    // Load owned NFTs
    const nfts = JSON.parse(localStorage.getItem('ownedNFTs') || '[]');
    setOwnedNFTs(nfts);
  };

  const analyzeWallet = async (address: string) => {
    setIsLoadingWallet(true);
    try {
      const analysis = await jeniusMCP.analyzeWallet(address);
      setWalletAnalysis(analysis);
      
      // Load market signals
      const signals = await jeniusMCP.getMarketSignals(address);
      setMarketSignals(signals);
    } catch (error) {
      console.error('Failed to analyze wallet:', error);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const loadCometAnalytics = () => {
    try {
      const logs = cometLogger.getAllLogs();
      const processedLogs = logs.map(log => ({
        id: log.id,
        prompt: log.prompt,
        timestamp: log.timestamp,
        averageScore: Math.round((log.scorecard.coherence + log.scorecard.promptCoverage + log.scorecard.hallucination + log.scorecard.visualQuality) / 4)
      }));
      
      setCometLogs(processedLogs);
      
      // Calculate analytics
      if (processedLogs.length > 0) {
        const avgScore = Math.round(processedLogs.reduce((sum, log) => sum + log.averageScore, 0) / processedLogs.length);
        setAverageScore(avgScore);
        
        const highQuality = processedLogs.filter(log => log.averageScore >= 80).length;
        setHighQualityCount(highQuality);
        
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recent = processedLogs.filter(log => new Date(log.timestamp) > oneWeekAgo).length;
        setRecentEnhancements(recent);
      }
    } catch (error) {
      console.error('Failed to load Comet analytics:', error);
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleListNFT = (index: number) => {
    const newPrice = prompt('Enter NFT price (USD):', '150');
    if (newPrice && !isNaN(Number(newPrice))) {
      const updatedVideos = [...mintedVideos];
      updatedVideos[index].nftPrice = Number(newPrice);
      updatedVideos[index].isListed = true;
      setMintedVideos(updatedVideos);
      localStorage.setItem('mintedVideos', JSON.stringify(updatedVideos));
      alert(`NFT listed for $${newPrice}!`);
    }
  };

  const handleUpdateNFTPrice = (index: number) => {
    const currentPrice = mintedVideos[index].nftPrice;
    const newPrice = prompt(`Current price: $${currentPrice}\nEnter new price (USD):`, currentPrice.toString());
    if (newPrice && !isNaN(Number(newPrice))) {
      const updatedVideos = [...mintedVideos];
      updatedVideos[index].nftPrice = Number(newPrice);
      setMintedVideos(updatedVideos);
      localStorage.setItem('mintedVideos', JSON.stringify(updatedVideos));
      alert(`NFT price updated to $${newPrice}!`);
    }
  };

  const handleViewTokenDetails = (index: number) => {
    const video = mintedVideos[index];
    const tokenValue = video.creatorTokenStake * video.coinPrice;
    alert(`Token Details for "${video.title}":\n\n` +
          `Your Stake: ${video.creatorTokenStake} tokens (1%)\n` +
          `Current Token Price: $${video.coinPrice}\n` +
          `Your Stake Value: $${tokenValue.toFixed(2)}\n` +
          `Total Supply: ${video.coinSupply.toLocaleString()} tokens\n` +
          `Market Cap: $${(video.coinPrice * video.coinSupply).toLocaleString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Creator Dashboard</h1>
          <p className="text-gray-400 text-lg">Track your content performance and earnings</p>
        </div>

        {/* Wallet Analysis Section */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8 shadow-2xl border border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Wallet Analysis</h2>
          </div>
          
          {isLoadingWallet ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-400">Analyzing wallet...</span>
            </div>
          ) : walletAnalysis ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">Risk Level</h3>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  walletAnalysis.defiActivity.riskLevel === 'low' ? 'bg-green-500/20 text-green-400' :
                  walletAnalysis.defiActivity.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {walletAnalysis.defiActivity.riskLevel.toUpperCase()}
                </span>
              </div>
              
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">Total Volume</h3>
                </div>
                <p className="text-2xl font-bold text-white">${walletAnalysis.totalVolume.toLocaleString()}</p>
              </div>
              
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">Creator Score</h3>
                </div>
                <p className="text-2xl font-bold text-white">{walletAnalysis.creatorScore}/100</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No wallet analysis available</p>
            </div>
          )}
        </div>

        {/* Market Signals */}
        {marketSignals.length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-8 mb-8 shadow-2xl border border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Market Signals</h2>
            </div>
            
            <div className="space-y-4">
              {marketSignals.map((signal, index) => (
                <div key={index} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-start space-x-3">
                    {getSignalIcon(signal.type)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{signal.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{signal.description}</p>
                      <div className="flex items-center space-x-4 text-xs">
                        <span className={`inline-block px-2 py-1 rounded-full ${
                          signal.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                          signal.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {signal.impact.toUpperCase()} IMPACT
                        </span>
                        <span className="text-gray-500">{signal.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Minted Videos</p>
                <p className="text-2xl font-bold text-white">{mintedVideos.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Stakes</p>
                <p className="text-2xl font-bold text-white">{videoStakes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Owned NFTs</p>
                <p className="text-2xl font-bold text-white">{ownedNFTs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">AI Score</p>
                <p className="text-2xl font-bold text-white">{averageScore}/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Minted Videos */}
        <div className="bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-xl p-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Video className="h-6 w-6 mr-2" />
            Your Videos ({mintedVideos.length})
          </h2>

          {mintedVideos.length === 0 ? (
            <div className="text-center py-12">
              <Video className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                No videos minted yet
              </h3>
              <p className="text-gray-400">
                Start by uploading and minting your first video
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mintedVideos.map((video, index) => (
                <div key={index} className="border border-gray-800 rounded-lg p-4 bg-gray-800/80 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link href={`/video/${video.id}`} className="block hover:underline">
                        <h3 className="font-semibold text-white">{video.title || video.name}</h3>
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">{video.description}</p>
                      {/* Metadata tags */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {video.category && (
                          <span className="px-2 py-1 bg-blue-900/40 text-blue-300 text-xs rounded-full">
                            {video.category}
                          </span>
                        )}
                        {video.visibility && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            video.visibility === 'public' ? 'bg-green-900/40 text-green-300' :
                            video.visibility === 'unlisted' ? 'bg-yellow-900/40 text-yellow-300' :
                            'bg-gray-900/40 text-gray-300'
                          }`}>
                            {video.visibility}
                          </span>
                        )}
                        {video.tags && video.tags.split(',').map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-purple-900/40 text-purple-300 text-xs rounded-full">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Token ID: {video.tokenId}</span>
                        <span>Minted: {new Date(video.mintedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs">
                        <span className="text-green-400">NFT Price: ${video.nftPrice || 'Not listed'}</span>
                        <span className="text-blue-400">Coin Price: ${video.coinPrice}</span>
                        <span className="text-purple-400">Est. Revenue: ${video.estimatedRevenue}</span>
                      </div>
                      {/* Creator Token Stake */}
                      <div className="mt-2 p-2 bg-green-900/20 rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-green-300">Your Token Stake:</span>
                          <span className="font-semibold text-green-200">{video.creatorTokenStake || 10000} tokens (1%)</span>
                        </div>
                      </div>
                      {/* NFT Listing Controls */}
                      <div className="mt-3 flex space-x-2">
                        {!video.isListed ? (
                          <button
                            onClick={() => handleListNFT(index)}
                            className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            List NFT for Sale
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateNFTPrice(index)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Update Price
                          </button>
                        )}
                        <button
                          onClick={() => handleViewTokenDetails(index)}
                          className="px-3 py-1 bg-gray-700 text-white text-xs rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Token Details
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2 ml-4">
                      <Link href={`/video/${video.id}`} className="block">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title || video.name}
                          className="w-32 h-20 object-cover rounded-lg border border-gray-700 hover:opacity-90 transition-opacity"
                        />
                      </Link>
                      <a
                        href={`https://mumbai.polygonscan.com/token/${video.tokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audience Insights */}
        {walletAddress && (
          <AudienceInsights creatorAddress={walletAddress} />
        )}

        {/* Comet Experiment Tracker */}
        <div className="col-span-full">
          <CometExperimentTracker />
        </div>
      </div>
    </div>
  );
} 