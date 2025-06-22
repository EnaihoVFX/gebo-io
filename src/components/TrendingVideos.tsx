'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Eye, 
  Clock, 
  TrendingUp,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { mockVideoService, VideoMetadata } from '@/utils/mockVideoService';

export default function TrendingVideos() {
  const [trendingVideos, setTrendingVideos] = useState<VideoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrendingVideos();
  }, []);

  const loadTrendingVideos = async () => {
    setIsLoading(true);
    try {
      const videos = await mockVideoService.getTrendingVideos();
      setTrendingVideos(videos.slice(0, 4)); // Only show 4 videos
    } catch (error) {
      console.error('Error loading trending videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };

  const formatViews = (views: number) => {
    if (views < 1000) return views.toString();
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K`;
    return `${(views / 1000000).toFixed(1)}M`;
  };

  // Generate random data for the new format
  const generateVideoData = (video: VideoMetadata) => {
    const valuations = ['890', '1240', '2100', '1650', '2800', '1950'];
    const changes = [
      { percent: 7.2, direction: 'up' as const },
      { percent: 3.8, direction: 'down' as const },
      { percent: 12.5, direction: 'up' as const },
      { percent: 8.7, direction: 'up' as const },
      { percent: 15.2, direction: 'up' as const },
      { percent: 9.8, direction: 'up' as const }
    ];
    const users = [
      { name: 'CoffeeLover', profilePic: 'https://picsum.photos/30/30?random=301' },
      { name: 'TechGuru', profilePic: 'https://picsum.photos/30/30?random=302' },
      { name: 'ChefMaria', profilePic: 'https://picsum.photos/30/30?random=303' },
      { name: 'FitLife', profilePic: 'https://picsum.photos/30/30?random=305' }
    ];

    return {
      valuation: valuations[Math.floor(Math.random() * valuations.length)],
      change: changes[Math.floor(Math.random() * changes.length)],
      user: users[Math.floor(Math.random() * users.length)]
    };
  };

  if (isLoading) {
    return (
      <div className="w-full bg-transparent mb-12">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="w-full h-64 bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (trendingVideos.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-transparent mb-12">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-bold text-white">Trending Now</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingVideos.map((video) => {
          const videoData = generateVideoData(video);
          return (
            <Link key={video.id} href={`/video/${video.id}`}>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group border border-gray-700">
                <div className="relative overflow-hidden">
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '56.25%',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: '#1a1a1a',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-full font-medium">
                      TRENDING
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    3:45
                  </div>
                </div>
                <div className="p-4">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <img
                      src={videoData.user.profilePic}
                      alt={videoData.user.name}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    />
                    <span style={{ 
                      color: '#666', 
                      fontSize: '11px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap'
                    }}>
                      {videoData.user.name}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {videoData.valuation} POL
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className={`text-xs font-semibold ${
                        videoData.change.direction === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {videoData.change.direction === 'up' ? '▲' : '▼'} {videoData.change.percent}%
                      </span>
                    </div>
                  </div>
                  {video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {video.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 