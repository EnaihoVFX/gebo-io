'use client';

import { useState, useEffect, useRef } from 'react';
import { blockchainService, VideoMetadata } from '@/utils/blockchainService';
import { useRouter } from 'next/navigation';

export default function ClipsPage() {
  const [clips, setClips] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadClips();
  }, []);

  useEffect(() => {
    // Auto-play current clip when it changes
    if (videoRefs.current[currentClipIndex]) {
      const video = videoRefs.current[currentClipIndex];
      if (video && isPlaying) {
        video.play().catch(console.error);
      }
    }
  }, [currentClipIndex, isPlaying]);

  const loadClips = async () => {
    setLoading(true);
    try {
      const shortFormVideos = await blockchainService.getShortFormVideos(20);
      setClips(shortFormVideos);
    } catch (error) {
      console.error('Failed to load clips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (index: number) => {
    setCurrentClipIndex(index);
    setIsPlaying(true);
  };

  const handleVideoEnd = () => {
    // Auto-advance to next clip
    if (currentClipIndex < clips.length - 1) {
      setCurrentClipIndex(currentClipIndex + 1);
    }
  };

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentClipIndex < clips.length - 1) {
      setCurrentClipIndex(currentClipIndex + 1);
    } else if (direction === 'up' && currentClipIndex > 0) {
      setCurrentClipIndex(currentClipIndex - 1);
    }
  };

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return 'now';
    }
  };

  const handleLike = async (clip: VideoMetadata) => {
    try {
      await blockchainService.updateLikes(clip.id);
      // Refresh clips to get updated like count
      loadClips();
    } catch (error) {
      console.error('Failed to like clip:', error);
    }
  };

  const handleView = async (clip: VideoMetadata) => {
    try {
      await blockchainService.updateViews(clip.id);
    } catch (error) {
      console.error('Failed to update view:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading clips...</p>
        </div>
      </div>
    );
  }

  if (clips.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-white mb-2">No clips found</h3>
          <p className="text-gray-400 mb-6">Be the first to upload a short-form video!</p>
          <button
            onClick={() => router.push('/upload')}
            className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors"
          >
            Upload Clip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-white font-bold text-lg">Clips</h1>
          <button
            onClick={() => router.push('/upload')}
            className="bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700 transition-colors"
          >
            Upload
          </button>
        </div>
      </div>

      {/* Clips Container */}
      <div className="pt-16 pb-4">
        {clips.map((clip, index) => (
          <div
            key={clip.id}
            className={`relative h-screen flex items-center justify-center ${
              index === currentClipIndex ? 'block' : 'hidden'
            }`}
          >
            {/* Video Player */}
            <div className="relative w-full h-full max-w-md mx-auto">
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={blockchainService.getVideoUrl(clip.videoHash)}
                className="w-full h-full object-cover rounded-lg"
                loop
                muted={!isPlaying}
                onEnded={handleVideoEnd}
                onLoadedData={() => {
                  if (index === currentClipIndex && isPlaying) {
                    videoRefs.current[index]?.play().catch(console.error);
                  }
                }}
                onError={(e) => {
                  console.error('Video error:', e);
                  const target = e.target as HTMLVideoElement;
                  target.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&ix=${clip.id}`;
                }}
              />
              
              {/* Play Button Overlay */}
              {!isPlaying && index === currentClipIndex && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 hover:bg-opacity-30 transition-all"
                  >
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Video Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/50 to-transparent">
                <div className="flex items-end justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                      {clip.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-2">
                      {clip.creator.slice(0, 6)}...{clip.creator.slice(-4)}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatViews(clip.views)} views • {formatTimeAgo(clip.timestamp)}
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col items-center space-y-4 ml-4">
                    <button
                      onClick={() => handleLike(clip)}
                      className="flex flex-col items-center text-white"
                    >
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-1">
                        <span className="text-2xl">❤️</span>
                      </div>
                      <span className="text-xs">{formatViews(clip.likes)}</span>
                    </button>
                    
                    <button
                      onClick={() => router.push(`/video/${clip.id}`)}
                      className="flex flex-col items-center text-white"
                    >
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-1">
                        <span className="text-2xl">💬</span>
                      </div>
                      <span className="text-xs">Comment</span>
                    </button>
                    
                    <button
                      onClick={() => router.push(`/video/${clip.id}`)}
                      className="flex flex-col items-center text-white"
                    >
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-1">
                        <span className="text-2xl">📤</span>
                      </div>
                      <span className="text-xs">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-2">
          {clips.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentClipIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentClipIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => handleScroll('up')}
        disabled={currentClipIndex === 0}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 text-white bg-black bg-opacity-50 rounded-full p-2 disabled:opacity-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      
      <button
        onClick={() => handleScroll('down')}
        disabled={currentClipIndex === clips.length - 1}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 text-white bg-black bg-opacity-50 rounded-full p-2 disabled:opacity-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Keyboard Navigation */}
      <div className="fixed top-4 right-4 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
        ↑↓ to navigate • Space to play/pause
      </div>
    </div>
  );
} 