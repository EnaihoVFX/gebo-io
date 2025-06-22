'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Heart, Share2, Eye } from 'lucide-react';
import { useAccount } from 'wagmi';
import { blockchainService } from '@/utils/blockchainService';

interface VideoPlayerProps {
  videoHash: string;
  thumbnailHash: string;
  title: string;
  description: string;
  creator: string;
  tokenId: string;
  views: number;
  likes: number;
  duration: string;
  isShortForm?: boolean;
}

export default function VideoPlayer({ 
  videoHash,
  thumbnailHash,
  title,
  description,
  creator,
  tokenId,
  views,
  likes,
  duration: durationString,
  isShortForm = false
}: VideoPlayerProps) {
  const { isConnected, address } = useAccount();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [currentViews, setCurrentViews] = useState(views);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoUrl = blockchainService.getVideoUrl(videoHash);
  const thumbnailUrl = blockchainService.getThumbnailUrl(thumbnailHash);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setError('Failed to load video');
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

      if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
      } else {
      video.requestFullscreen();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleLike = async () => {
    if (!isConnected) {
      alert('Please connect your wallet to like videos');
      return;
    }

    try {
      await blockchainService.updateLikes(tokenId);
      setCurrentLikes(prev => prev + (isLiked ? -1 : 1));
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to update likes:', error);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/video/${tokenId}`;
    navigator.clipboard.writeText(url);
    alert('Video URL copied to clipboard!');
  };

  const updateViews = async () => {
    try {
      await blockchainService.updateViews(tokenId);
      setCurrentViews(prev => prev + 1);
    } catch (error) {
      console.error('Failed to update views:', error);
    }
  };

  useEffect(() => {
    // Update views when video starts playing
    if (isPlaying && currentTime > 1) {
      updateViews();
    }
  }, [isPlaying, currentTime]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) {
      return '0';
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Video Container */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-lg">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Video Element */}
      <video
        ref={videoRef}
          className="w-full h-auto"
          poster={thumbnailUrl}
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={videoDuration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(videoDuration)}
              </div>
            </div>

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="mt-6 space-y-4">
        {/* Title and Creator */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{formatNumber(currentViews)} views</span>
            <span>•</span>
            <span>{durationString}</span>
            {isShortForm && (
              <>
                <span>•</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                  Short Form
                </span>
              </>
            )}
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
              {creator.slice(2, 4).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {creator.slice(0, 6)}...{creator.slice(-4)}
              </p>
              <p className="text-sm text-gray-600">Creator</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{formatNumber(currentLikes)}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
        </button>
          </div>
        </div>

        {/* Description */}
        {description && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
          </div>
        )}

        {/* NFT Info */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-medium text-purple-900 mb-2">NFT Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-purple-700">Token ID:</span>
              <span className="ml-2 font-mono text-purple-900">#{tokenId}</span>
            </div>
            <div>
              <span className="text-purple-700">Creator:</span>
              <span className="ml-2 font-mono text-purple-900">
                {creator.slice(0, 6)}...{creator.slice(-4)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
} 