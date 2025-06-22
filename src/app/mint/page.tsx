'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { 
  Upload, 
  Video, 
  Image, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Eye,
  EyeOff,
  FileText,
  Tag,
  Globe,
  Lock,
  Users,
  Calendar,
  Clock,
  BarChart3,
  Zap,
  Palette,
  Camera,
  X,
  Play,
  Download,
  RefreshCw
} from 'lucide-react';
import AIThumbnailGenerator from '@/components/AIThumbnailGenerator';
import { blockchainService } from '@/utils/blockchainService';
import Link from 'next/link';
import { mockVideoService, VideoMetadata } from '@/utils/mockVideoService';

interface UploadData {
  videoHash: string;
  videoSize: number;
  videoType: string;
  videoName: string;
  videoUrl: string;
}

interface MintingData {
  videoTitle: string;
  description: string;
  tags: string[];
  visibility: 'public' | 'unlisted' | 'private';
  category: string;
  language: string;
  monetization: boolean;
  ageRestriction: boolean;
  allowComments: boolean;
  allowRatings: boolean;
  allowEmbedding: boolean;
  notifySubscribers: boolean;
  publishAt: string;
}

interface ThumbnailOption {
  id: string;
  url: string;
  type: 'auto' | 'custom' | 'ai';
  selected: boolean;
}

export default function MintPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [mintingData, setMintingData] = useState<MintingData>({
    videoTitle: '',
    description: '',
    tags: [],
    visibility: 'public',
    category: 'entertainment',
    language: 'en',
    monetization: false,
    ageRestriction: false,
    allowComments: true,
    allowRatings: true,
    allowEmbedding: true,
    notifySubscribers: true,
    publishAt: '',
  });
  const [thumbnailOptions, setThumbnailOptions] = useState<ThumbnailOption[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string>('');
  const [showThumbnailPreview, setShowThumbnailPreview] = useState(false);
  const [showAIThumbnail, setShowAIThumbnail] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintProgress, setMintProgress] = useState(0);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);
  const [loadedThumbnails, setLoadedThumbnails] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    thumbnail: true,
    blockchain: true,
    advanced: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('uploadData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setUploadData(data);
      
      // Auto-generate title from filename
      const title = data.videoName.replace(/\.[^/.]+$/, "");
      setMintingData(prev => ({ ...prev, videoTitle: title }));
      
      // Generate auto thumbnails
      generateAutoThumbnails();
    } else {
      router.push('/upload');
    }
  }, [router]);

  const generateAutoThumbnails = async () => {
    setIsGeneratingThumbnails(true);
    try {
      // Get the uploaded video file from session storage
      const videoData = sessionStorage.getItem('uploadedVideo');
      if (!videoData) {
        throw new Error('No video data found');
      }

      const videoInfo = JSON.parse(videoData);
      const videoFile = (window as any).__uploadedVideoFile;
      
      if (!videoFile) {
        throw new Error('Video file not found');
      }

      // Create a video element to generate thumbnails
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      
      // Create a canvas for thumbnail generation
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = 1280;
      canvas.height = 720;
      
      // Generate thumbnails from video frames
      const thumbnails: string[] = [];
      
      // Create a promise to wait for video to load
      const videoLoadPromise = new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error('Failed to load video'));
        
        // Set video source
        const videoUrl = URL.createObjectURL(videoFile);
        video.src = videoUrl;
      });

      await videoLoadPromise;
      
      // Get video duration
      const duration = video.duration;
      if (!duration || duration <= 0) {
        throw new Error('Invalid video duration');
      }

      // Generate 3 thumbnails at different timestamps (25%, 50%, 75%)
      const timestamps = [duration * 0.25, duration * 0.5, duration * 0.75];
      
      for (let i = 0; i < timestamps.length; i++) {
        const timestamp = timestamps[i];
        
        // Create a promise to capture frame at specific time
        const framePromise = new Promise<string>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Frame capture timeout'));
          }, 5000);

          video.onseeked = () => {
            try {
              // Draw the video frame to canvas
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              // Convert canvas to data URL
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
              clearTimeout(timeout);
              resolve(dataUrl);
            } catch (error) {
              clearTimeout(timeout);
              reject(error);
            }
          };

          video.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Video seek error'));
          };

          // Seek to the timestamp
          video.currentTime = timestamp;
        });

        try {
          const thumbnail = await framePromise;
          thumbnails.push(thumbnail);
        } catch (error) {
          console.error(`Failed to capture frame at ${timestamp}s:`, error);
          // Use a fallback thumbnail
          thumbnails.push('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1280&h=720&fit=crop');
        }
      }

      // Create thumbnail options
      const options: ThumbnailOption[] = thumbnails.map((url, index) => ({
        id: `auto-${index}`,
        url,
        type: 'auto' as const,
        selected: index === 0,
      }));

      setThumbnailOptions(options);
      if (options.length > 0) {
        setSelectedThumbnail(options[0].url);
      }
    } catch (error) {
      console.error('Error generating thumbnails:', error);
      // Create fallback thumbnails
      const fallbackOptions: ThumbnailOption[] = [
        {
          id: 'fallback-1',
          url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1280&h=720&fit=crop',
          type: 'auto',
          selected: true,
        },
        {
          id: 'fallback-2',
          url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1280&h=720&fit=crop',
          type: 'auto',
          selected: false,
        },
        {
          id: 'fallback-3',
          url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1280&h=720&fit=crop',
          type: 'auto',
          selected: false,
        },
      ];
      setThumbnailOptions(fallbackOptions);
      setSelectedThumbnail(fallbackOptions[0].url);
    } finally {
      setIsGeneratingThumbnails(false);
    }
  };

  const generateAIThumbnails = async () => {
    // This would integrate with an AI service to generate thumbnails
    // For now, we'll use placeholder images
    const aiOptions: ThumbnailOption[] = [
      {
        id: 'ai-1',
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1280&h=720&fit=crop',
        type: 'ai',
        selected: false,
      },
      {
        id: 'ai-2',
        url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1280&h=720&fit=crop',
        type: 'ai',
        selected: false,
      },
      {
        id: 'ai-3',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop',
        type: 'ai',
        selected: false,
      },
    ];

    setThumbnailOptions(prev => [...prev, ...aiOptions]);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleThumbnailSelect = (thumbnailUrl: string) => {
    setSelectedThumbnail(thumbnailUrl);
    setThumbnailOptions(prev =>
      prev.map(option => ({
        ...option,
        selected: option.url === thumbnailUrl,
      }))
    );
  };

  const handleAISelectThumbnail = (imageUrls: string[]) => {
    const aiOptions: ThumbnailOption[] = imageUrls.map((url, index) => ({
      id: `ai-generated-${index}`,
      url,
      type: 'ai' as const,
      selected: false,
    }));

    setThumbnailOptions(prev => [...prev, ...aiOptions]);
    setShowAIThumbnail(false);
  };

  const handleTagInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const input = event.currentTarget;
      const tag = input.value.trim();
      
      if (tag && !mintingData.tags.includes(tag)) {
        setMintingData(prev => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
        input.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setMintingData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleMint = async () => {
    if (!uploadData || !selectedThumbnail) return;

    setIsMinting(true);
    setMintProgress(0);

    try {
      // Simulate minting process
      const steps = [
        { progress: 20, message: 'Preparing video metadata...' },
        { progress: 40, message: 'Generating thumbnail...' },
        { progress: 60, message: 'Uploading to IPFS...' },
        { progress: 80, message: 'Creating smart contract...' },
        { progress: 100, message: 'Minting NFT...' },
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMintProgress(step.progress);
      }

      // Create video metadata
      const videoMetadata: Omit<VideoMetadata, 'id' | 'createdAt' | 'views' | 'likes' | 'dislikes' | 'tokenId' | 'contractAddress' | 'blockchainTx'> = {
        title: mintingData.videoTitle,
        description: mintingData.description,
        tags: mintingData.tags,
        category: mintingData.category,
        language: mintingData.language,
        visibility: mintingData.visibility,
        thumbnailUrl: selectedThumbnail,
        videoUrl: uploadData.videoUrl,
        videoHash: uploadData.videoHash,
        thumbnailHash: 'QmThumbnailHash',
        creator: 'Creator Name',
        creatorAddress: '0x1234567890123456789012345678901234567890',
        monetization: mintingData.monetization,
        ageRestriction: mintingData.ageRestriction,
        allowComments: mintingData.allowComments,
        allowRatings: mintingData.allowRatings,
        allowEmbedding: mintingData.allowEmbedding,
      };

      // Mint the video NFT
      const mintedVideo = await mockVideoService.mintVideo(videoMetadata);

      // Store minted video data
      const mintedVideos = JSON.parse(localStorage.getItem('mintedVideos') || '[]');
      mintedVideos.push({
        name: uploadData.videoName,
        title: mintingData.videoTitle,
        description: mintingData.description,
        tags: mintingData.tags.join(', '),
        category: mintingData.category,
        visibility: mintingData.visibility,
        ipfsHash: uploadData.videoHash,
        tokenId: mintedVideo.tokenId,
        transactionHash: mintedVideo.blockchainTx,
        fileName: uploadData.videoName,
        mintedAt: new Date().toISOString(),
        nftPrice: 150,
        coinPrice: 0.05,
        coinSupply: 1000000,
        estimatedRevenue: 250,
        creatorTokenStake: 10000,
        isListed: false,
      });
      localStorage.setItem('mintedVideos', JSON.stringify(mintedVideos));

      // Clear upload data
      localStorage.removeItem('uploadData');
      sessionStorage.removeItem('uploadedVideo');
      delete (window as any).__uploadedVideoFile;

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Minting failed:', error);
      setError('Minting failed. Please try again.');
    } finally {
      setIsMinting(false);
      setMintProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!uploadData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-x mb-4 drop-shadow-lg">
              Mint Your Video NFT
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Create your video NFT on the blockchain. Set metadata, generate thumbnails, and mint your content.
            </p>
          </div>

          {!isConnected ? (
            <div className="bg-gray-900/80 rounded-2xl p-12 text-center shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                <Video className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-8">
                You need to connect your wallet to mint video NFTs
              </p>
              <Link
                href="/"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl animate-glow"
              >
                <span>Connect Wallet</span>
                <ChevronDown className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-10">
                {/* Video Preview */}
                <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Video Preview</h2>
                  </div>
                  <div className="relative rounded-xl overflow-hidden bg-gray-900">
                    {uploadData && uploadData.videoUrl ? (
                      <video
                        src={uploadData.videoUrl}
                        className="w-full rounded-xl shadow-lg hover:shadow-purple-900/40 transition-shadow duration-300"
                        controls
                        poster={selectedThumbnail || undefined}
                      />
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center bg-gray-800 rounded-xl text-gray-400">
                        Video preview not available
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                    <span>{uploadData?.videoName}</span>
                    <span>{formatFileSize(uploadData?.videoSize || 0)}</span>
                  </div>
                </div>

                {/* Video Details */}
                <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Video Details</h2>
                    </div>
                    <button
                      onClick={() => toggleSection('details')}
                      className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      {expandedSections.details ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {expandedSections.details && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Video Title *
                        </label>
                        <input
                          type="text"
                          value={mintingData.videoTitle}
                          onChange={(e) => setMintingData(prev => ({ ...prev, videoTitle: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter video title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={mintingData.description}
                          onChange={(e) => setMintingData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Describe your video content"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {mintingData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center space-x-1 bg-purple-600/20 text-purple-400 px-3 py-1 rounded-lg text-sm"
                            >
                              <span>{tag}</span>
                              <button
                                onClick={() => removeTag(tag)}
                                className="hover:text-purple-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          onKeyDown={handleTagInput}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Add tags (press Enter)"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Category
                          </label>
                          <select
                            value={mintingData.category}
                            onChange={(e) => setMintingData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="entertainment">Entertainment</option>
                            <option value="education">Education</option>
                            <option value="gaming">Gaming</option>
                            <option value="music">Music</option>
                            <option value="technology">Technology</option>
                            <option value="lifestyle">Lifestyle</option>
                            <option value="sports">Sports</option>
                            <option value="news">News</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Language
                          </label>
                          <select
                            value={mintingData.language}
                            onChange={(e) => setMintingData(prev => ({ ...prev, language: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="it">Italian</option>
                            <option value="pt">Portuguese</option>
                            <option value="ru">Russian</option>
                            <option value="ja">Japanese</option>
                            <option value="ko">Korean</option>
                            <option value="zh">Chinese</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnail Selection */}
                <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Thumbnail Selection</h2>
                    <button
                      onClick={() => setShowAIThumbnail(true)}
                      className="p-2 hover:bg-purple-900/40 rounded-xl transition-colors shadow-md"
                    >
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4">
                    Auto thumbnails are extracted from your video at 25%, 50%, and 75% timestamps. 
                    You can also generate custom AI thumbnails or upload your own.
                  </p>
                  
                  {isGeneratingThumbnails ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-400">Extracting frames from your video...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {thumbnailOptions.map((option) => (
                        <div
                          key={option.id}
                          onClick={() => handleThumbnailSelect(option.url)}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            option.selected
                              ? 'border-purple-500 ring-2 ring-purple-200'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          {!loadedThumbnails.has(option.url) && (
                            <div className="w-full h-32 bg-gray-700 flex items-center justify-center">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-1"></div>
                                <p className="text-xs text-gray-400">Loading...</p>
                              </div>
                            </div>
                          )}
                          <img
                            src={option.url}
                            alt={`Thumbnail option ${option.id}`}
                            className={`w-full h-32 object-cover ${
                              !loadedThumbnails.has(option.url) ? 'hidden' : ''
                            }`}
                            onLoad={() => {
                              setLoadedThumbnails(prev => new Set(prev).add(option.url));
                            }}
                            onError={(e) => {
                              console.error(`Thumbnail failed to load:`, option.url, e);
                              // Fallback to a placeholder if image fails to load
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1280&h=720&fit=crop';
                              setLoadedThumbnails(prev => new Set(prev).add(option.url));
                            }}
                          />
                          <div className="absolute top-2 left-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              option.type === 'auto' ? 'bg-blue-100 text-blue-700' :
                              option.type === 'custom' ? 'bg-green-100 text-green-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {option.type.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Visibility Settings */}
                <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Visibility & Settings</h2>
                    <button
                      onClick={() => toggleSection('advanced')}
                      className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      {expandedSections.advanced ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {expandedSections.advanced && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            value="public"
                            checked={mintingData.visibility === 'public'}
                            onChange={(e) => setMintingData(prev => ({ ...prev, visibility: e.target.value as any }))}
                            className="text-purple-600"
                          />
                          <div className="flex items-center space-x-2">
                            <Globe className="w-5 h-5 text-green-600" />
                            <div>
                              <div className="font-medium text-white">Public</div>
                              <div className="text-sm text-gray-400">Everyone can search for and view</div>
                            </div>
                          </div>
                        </label>
                        
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            value="unlisted"
                            checked={mintingData.visibility === 'unlisted'}
                            onChange={(e) => setMintingData(prev => ({ ...prev, visibility: e.target.value as any }))}
                            className="text-purple-600"
                          />
                          <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5 text-yellow-600" />
                            <div>
                              <div className="font-medium text-white">Unlisted</div>
                              <div className="text-sm text-gray-400">Anyone with the link can view</div>
                            </div>
                          </div>
                        </label>
                        
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            value="private"
                            checked={mintingData.visibility === 'private'}
                            onChange={(e) => setMintingData(prev => ({ ...prev, visibility: e.target.value as any }))}
                            className="text-purple-600"
                          />
                          <div className="flex items-center space-x-2">
                            <Lock className="w-5 h-5 text-red-600" />
                            <div>
                              <div className="font-medium text-white">Private</div>
                              <div className="text-sm text-gray-400">Only you can view</div>
                            </div>
                          </div>
                        </label>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={mintingData.ageRestriction}
                            onChange={(e) => setMintingData(prev => ({ ...prev, ageRestriction: e.target.checked }))}
                            className="text-purple-600"
                          />
                          <span className="text-sm text-white">Age-restricted content (18+)</span>
                        </label>
                        
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={mintingData.allowComments}
                            onChange={(e) => setMintingData(prev => ({ ...prev, allowComments: e.target.checked }))}
                            className="text-purple-600"
                          />
                          <span className="text-sm text-white">Allow comments</span>
                        </label>
                        
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={mintingData.allowRatings}
                            onChange={(e) => setMintingData(prev => ({ ...prev, allowRatings: e.target.checked }))}
                            className="text-purple-600"
                          />
                          <span className="text-sm text-white">Allow ratings</span>
                        </label>
                        
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={mintingData.allowEmbedding}
                            onChange={(e) => setMintingData(prev => ({ ...prev, allowEmbedding: e.target.checked }))}
                            className="text-purple-600"
                          />
                          <span className="text-sm text-white">Allow embedding</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Blockchain Settings */}
                <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Blockchain Settings</h2>
                    <button
                      onClick={() => toggleSection('blockchain')}
                      className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      {expandedSections.blockchain ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  {expandedSections.blockchain && (
                    <div className="space-y-6">
                      <div className="bg-purple-900/20 border border-purple-700/50 rounded-xl p-4">
                        <h3 className="font-medium text-purple-300 mb-2">Network Information</h3>
                        <div className="space-y-2 text-sm text-purple-200">
                          <div className="flex justify-between">
                            <span>Network:</span>
                            <span className="font-medium">Polygon Local</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Chain ID:</span>
                            <span className="font-medium">31337</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Currency:</span>
                            <span className="font-medium">MATIC</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={mintingData.monetization}
                            onChange={(e) => setMintingData(prev => ({ ...prev, monetization: e.target.checked }))}
                            className="text-purple-600"
                          />
                          <span className="text-sm text-white">Enable monetization (earn from views)</span>
                        </label>
                        
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={mintingData.allowEmbedding}
                            onChange={(e) => setMintingData(prev => ({ ...prev, allowEmbedding: e.target.checked }))}
                            className="text-purple-600"
                          />
                          <span className="text-sm text-white">Allow embedding on other platforms</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Minting Progress */}
                {isMinting && (
                  <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
                    <h3 className="font-semibold text-white mb-4">Minting NFT...</h3>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${mintProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-400">{mintProgress}% complete</p>
                  </div>
                )}
                {/* Mint Button */}
                <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in flex flex-col items-center">
                  <button
                    onClick={handleMint}
                    disabled={!selectedThumbnail || !mintingData.videoTitle.trim() || isMinting}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-3 px-6 rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 border-2 border-transparent hover:border-purple-400 animate-glow"
                    style={{ backgroundSize: '200% 200%', animation: 'gradient-x 4s ease infinite' }}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>{isMinting ? 'Minting...' : 'Mint Video NFT'}</span>
                  </button>
                  <p className="text-sm text-gray-400 mt-2 text-center">
                    This will create a unique NFT on the blockchain
                  </p>
                </div>
                {/* NFT Preview */}
                <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
                  <h3 className="font-semibold text-white mb-4">NFT Preview</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token Standard:</span>
                      <span className="font-medium text-white">ERC-721</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network:</span>
                      <span className="font-medium text-white">Polygon</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gas Fee:</span>
                      <span className="font-medium text-white">~0.001 MATIC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Royalty:</span>
                      <span className="font-medium text-white">2.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Thumbnail Preview Modal */}
          {showThumbnailPreview && selectedThumbnail && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl border border-gray-700">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Thumbnail Preview</h2>
                  <button
                    onClick={() => setShowThumbnailPreview(false)}
                    className="p-2 hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="p-6">
                  <img
                    src={selectedThumbnail}
                    alt="Thumbnail preview"
                    className="w-full rounded-xl"
                  />
                  <div className="mt-6 flex justify-center space-x-4">
                    <button
                      onClick={() => setShowThumbnailPreview(false)}
                      className="bg-gray-700 text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = selectedThumbnail;
                        link.download = 'thumbnail.png';
                        link.click();
                      }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 flex items-center space-x-2 transition-all duration-300"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Thumbnail Generator Modal */}
          {showAIThumbnail && (
            <AIThumbnailGenerator
              isOpen={showAIThumbnail}
              onClose={() => setShowAIThumbnail(false)}
              onGenerateThumbnails={handleAISelectThumbnail}
              videoTitle={mintingData.videoTitle}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-x mb-4 drop-shadow-lg">
            Mint Your Video NFT
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Create your video NFT on the blockchain. Set metadata, generate thumbnails, and mint your content.
          </p>
        </div>

        {!isConnected ? (
          <div className="bg-gray-900/80 rounded-2xl p-12 text-center shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
              <Video className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-8">
              You need to connect your wallet to mint video NFTs
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl animate-glow"
            >
              <span>Connect Wallet</span>
              <ChevronDown className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Video Preview */}
              <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Video Preview</h2>
                </div>
                <div className="relative rounded-xl overflow-hidden bg-gray-900">
                  {uploadData && uploadData.videoUrl ? (
                    <video
                      src={uploadData.videoUrl}
                      className="w-full rounded-xl shadow-lg hover:shadow-purple-900/40 transition-shadow duration-300"
                      controls
                      poster={selectedThumbnail || undefined}
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center bg-gray-800 rounded-xl text-gray-400">
                      Video preview not available
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                  <span>{uploadData?.videoName}</span>
                  <span>{formatFileSize(uploadData?.videoSize || 0)}</span>
                </div>
              </div>

              {/* Video Details */}
              <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Video Details</h2>
                  </div>
                  <button
                    onClick={() => toggleSection('details')}
                    className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    {expandedSections.details ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                
                {expandedSections.details && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Video Title *
                      </label>
                      <input
                        type="text"
                        value={mintingData.videoTitle}
                        onChange={(e) => setMintingData(prev => ({ ...prev, videoTitle: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter video title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={mintingData.description}
                        onChange={(e) => setMintingData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Describe your video content"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {mintingData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center space-x-1 bg-purple-600/20 text-purple-400 px-3 py-1 rounded-lg text-sm"
                          >
                            <span>{tag}</span>
                            <button
                              onClick={() => removeTag(tag)}
                              className="hover:text-purple-300"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        onKeyDown={handleTagInput}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Add tags (press Enter)"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          value={mintingData.category}
                          onChange={(e) => setMintingData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="entertainment">Entertainment</option>
                          <option value="education">Education</option>
                          <option value="gaming">Gaming</option>
                          <option value="music">Music</option>
                          <option value="technology">Technology</option>
                          <option value="lifestyle">Lifestyle</option>
                          <option value="sports">Sports</option>
                          <option value="news">News</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Language
                        </label>
                        <select
                          value={mintingData.language}
                          onChange={(e) => setMintingData(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="it">Italian</option>
                          <option value="pt">Portuguese</option>
                          <option value="ru">Russian</option>
                          <option value="ja">Japanese</option>
                          <option value="ko">Korean</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Selection */}
              <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Thumbnail Selection</h2>
                  <button
                    onClick={() => setShowAIThumbnail(true)}
                    className="p-2 hover:bg-purple-900/40 rounded-xl transition-colors shadow-md"
                  >
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-400 mb-4">
                  Auto thumbnails are extracted from your video at 25%, 50%, and 75% timestamps. 
                  You can also generate custom AI thumbnails or upload your own.
                </p>
                
                {isGeneratingThumbnails ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-400">Extracting frames from your video...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {thumbnailOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => handleThumbnailSelect(option.url)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          option.selected
                            ? 'border-purple-500 ring-2 ring-purple-200'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {!loadedThumbnails.has(option.url) && (
                          <div className="w-full h-32 bg-gray-700 flex items-center justify-center">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-1"></div>
                              <p className="text-xs text-gray-400">Loading...</p>
                            </div>
                          </div>
                        )}
                        <img
                          src={option.url}
                          alt={`Thumbnail option ${option.id}`}
                          className={`w-full h-32 object-cover ${
                            !loadedThumbnails.has(option.url) ? 'hidden' : ''
                          }`}
                          onLoad={() => {
                            setLoadedThumbnails(prev => new Set(prev).add(option.url));
                          }}
                          onError={(e) => {
                            console.error(`Thumbnail failed to load:`, option.url, e);
                            // Fallback to a placeholder if image fails to load
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1280&h=720&fit=crop';
                            setLoadedThumbnails(prev => new Set(prev).add(option.url));
                          }}
                        />
                        <div className="absolute top-2 left-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            option.type === 'auto' ? 'bg-blue-100 text-blue-700' :
                            option.type === 'custom' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {option.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Visibility Settings */}
              <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Visibility & Settings</h2>
                  <button
                    onClick={() => toggleSection('advanced')}
                    className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    {expandedSections.advanced ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                
                {expandedSections.advanced && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value="public"
                          checked={mintingData.visibility === 'public'}
                          onChange={(e) => setMintingData(prev => ({ ...prev, visibility: e.target.value as any }))}
                          className="text-purple-600"
                        />
                        <div className="flex items-center space-x-2">
                          <Globe className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium text-white">Public</div>
                            <div className="text-sm text-gray-400">Everyone can search for and view</div>
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value="unlisted"
                          checked={mintingData.visibility === 'unlisted'}
                          onChange={(e) => setMintingData(prev => ({ ...prev, visibility: e.target.value as any }))}
                          className="text-purple-600"
                        />
                        <div className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-yellow-600" />
                          <div>
                            <div className="font-medium text-white">Unlisted</div>
                            <div className="text-sm text-gray-400">Anyone with the link can view</div>
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value="private"
                          checked={mintingData.visibility === 'private'}
                          onChange={(e) => setMintingData(prev => ({ ...prev, visibility: e.target.value as any }))}
                          className="text-purple-600"
                        />
                        <div className="flex items-center space-x-2">
                          <Lock className="w-5 h-5 text-red-600" />
                          <div>
                            <div className="font-medium text-white">Private</div>
                            <div className="text-sm text-gray-400">Only you can view</div>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={mintingData.ageRestriction}
                          onChange={(e) => setMintingData(prev => ({ ...prev, ageRestriction: e.target.checked }))}
                          className="text-purple-600"
                        />
                        <span className="text-sm text-white">Age-restricted content (18+)</span>
                      </label>
                      
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={mintingData.allowComments}
                          onChange={(e) => setMintingData(prev => ({ ...prev, allowComments: e.target.checked }))}
                          className="text-purple-600"
                        />
                        <span className="text-sm text-white">Allow comments</span>
                      </label>
                      
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={mintingData.allowRatings}
                          onChange={(e) => setMintingData(prev => ({ ...prev, allowRatings: e.target.checked }))}
                          className="text-purple-600"
                        />
                        <span className="text-sm text-white">Allow ratings</span>
                      </label>
                      
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={mintingData.allowEmbedding}
                          onChange={(e) => setMintingData(prev => ({ ...prev, allowEmbedding: e.target.checked }))}
                          className="text-purple-600"
                        />
                        <span className="text-sm text-white">Allow embedding</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Blockchain Settings */}
              <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Blockchain Settings</h2>
                  <button
                    onClick={() => toggleSection('blockchain')}
                    className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    {expandedSections.blockchain ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                
                {expandedSections.blockchain && (
                  <div className="space-y-6">
                    <div className="bg-purple-900/20 border border-purple-700/50 rounded-xl p-4">
                      <h3 className="font-medium text-purple-300 mb-2">Network Information</h3>
                      <div className="space-y-2 text-sm text-purple-200">
                        <div className="flex justify-between">
                          <span>Network:</span>
                          <span className="font-medium">Polygon Local</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Chain ID:</span>
                          <span className="font-medium">31337</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Currency:</span>
                          <span className="font-medium">MATIC</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={mintingData.monetization}
                          onChange={(e) => setMintingData(prev => ({ ...prev, monetization: e.target.checked }))}
                          className="text-purple-600"
                        />
                        <span className="text-sm text-white">Enable monetization (earn from views)</span>
                      </label>
                      
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={mintingData.allowEmbedding}
                          onChange={(e) => setMintingData(prev => ({ ...prev, allowEmbedding: e.target.checked }))}
                          className="text-purple-600"
                        />
                        <span className="text-sm text-white">Allow embedding on other platforms</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Minting Progress */}
              {isMinting && (
                <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
                  <h3 className="font-semibold text-white mb-4">Minting NFT...</h3>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${mintProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">{mintProgress}% complete</p>
                </div>
              )}
              {/* Mint Button */}
              <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in flex flex-col items-center">
                <button
                  onClick={handleMint}
                  disabled={!selectedThumbnail || !mintingData.videoTitle.trim() || isMinting}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-3 px-6 rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 border-2 border-transparent hover:border-purple-400 animate-glow"
                  style={{ backgroundSize: '200% 200%', animation: 'gradient-x 4s ease infinite' }}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{isMinting ? 'Minting...' : 'Mint Video NFT'}</span>
                </button>
                <p className="text-sm text-gray-400 mt-2 text-center">
                  This will create a unique NFT on the blockchain
                </p>
              </div>
              {/* NFT Preview */}
              <div className="bg-gray-900/80 rounded-2xl p-8 shadow-2xl border border-gray-800 backdrop-blur-xl animate-fade-in">
                <h3 className="font-semibold text-white mb-4">NFT Preview</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token Standard:</span>
                    <span className="font-medium text-white">ERC-721</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <span className="font-medium text-white">Polygon</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gas Fee:</span>
                    <span className="font-medium text-white">~0.001 MATIC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Royalty:</span>
                    <span className="font-medium text-white">2.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Thumbnail Preview Modal */}
        {showThumbnailPreview && selectedThumbnail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl border border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Thumbnail Preview</h2>
                <button
                  onClick={() => setShowThumbnailPreview(false)}
                  className="p-2 hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-6">
                <img
                  src={selectedThumbnail}
                  alt="Thumbnail preview"
                  className="w-full rounded-xl"
                />
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={() => setShowThumbnailPreview(false)}
                    className="bg-gray-700 text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedThumbnail;
                      link.download = 'thumbnail.png';
                      link.click();
                    }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 flex items-center space-x-2 transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Thumbnail Generator Modal */}
        {showAIThumbnail && (
          <AIThumbnailGenerator
            isOpen={showAIThumbnail}
            onClose={() => setShowAIThumbnail(false)}
            onGenerateThumbnails={handleAISelectThumbnail}
            videoTitle={mintingData.videoTitle}
          />
        )}
      </div>
    </div>
  );
} 