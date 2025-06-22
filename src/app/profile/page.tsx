'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Eye, 
  Heart, 
  Clock, 
  Upload,
  User,
  Settings,
  Video,
  TrendingUp,
  DollarSign,
  Users as UsersIcon
} from 'lucide-react';
import { mockVideoService, VideoMetadata } from '@/utils/mockVideoService';

export default function ProfilePage() {
  const [userVideos, setUserVideos] = useState<VideoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    loadUserVideos();
  }, []);

  const loadUserVideos = async () => {
    setIsLoading(true);
    try {
      // Use a consistent demo address for testing
      const userAddress = '0x1234567890123456789012345678901234567890';
      const videos = await mockVideoService.getVideosByCreator(userAddress);
      setUserVideos(videos);
    } catch (error) {
      console.error('Error loading user videos:', error);
      } finally {
      setIsLoading(false);
    }
  };

  const formatViews = (views: number) => {
    if (views < 1000) return views.toString();
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K`;
    return `${(views / 1000000).toFixed(1)}M`;
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

  const totalViews = userVideos.reduce((sum, video) => sum + video.views, 0);
  const totalLikes = userVideos.reduce((sum, video) => sum + video.likes, 0);
  const publicVideos = userVideos.filter(video => video.visibility === 'public');

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8 shadow-2xl border border-gray-700">
          <div className="flex items-start space-x-8">
            <div className="w-28 h-28 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-14 h-14 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-3">Creator Profile</h1>
              <p className="text-gray-400 mb-6 text-lg">0x1234...7890</p>
              <div className="flex items-center space-x-8 text-sm text-gray-400">
                <span className="flex items-center space-x-2 bg-gray-700/50 px-3 py-2 rounded-xl">
                  <Video className="w-4 h-4 text-purple-400" />
                  <span className="font-medium">{userVideos.length} videos</span>
                </span>
                <span className="flex items-center space-x-2 bg-gray-700/50 px-3 py-2 rounded-xl">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">{formatViews(totalViews)} views</span>
                </span>
                <span className="flex items-center space-x-2 bg-gray-700/50 px-3 py-2 rounded-xl">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="font-medium">{formatViews(totalLikes)} likes</span>
                </span>
              </div>
            </div>
            <button className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Videos</p>
                <p className="text-2xl font-bold text-white">{userVideos.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-white">{formatViews(totalViews)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Likes</p>
                <p className="text-2xl font-bold text-white">{formatViews(totalLikes)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Earnings</p>
                <p className="text-2xl font-bold text-white">0 MATIC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-2xl mb-8 shadow-2xl border border-gray-700">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab('videos')}
                className={`py-6 px-1 border-b-2 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'videos'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                Videos ({userVideos.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-6 px-1 border-b-2 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'analytics'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`py-6 px-1 border-b-2 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'earnings'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                Earnings
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'videos' && (
              <div>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-gray-700 rounded-2xl animate-pulse">
                        <div className="w-full h-48 bg-gray-600 rounded-t-2xl"></div>
                        <div className="p-6 space-y-3">
                          <div className="h-4 bg-gray-600 rounded"></div>
                          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userVideos.map((video) => (
                      <Link key={video.id} href={`/video/${video.id}`}>
                        <div className="bg-gray-700 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                          <div className="relative">
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Play className="w-12 h-12 text-white" />
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="font-semibold text-white mb-2 line-clamp-2">{video.title}</h3>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{video.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{formatViews(video.views)}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Heart className="w-3 h-3" />
                                <span>{formatViews(video.likes)}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimeAgo(video.createdAt)}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <TrendingUp className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Analytics Coming Soon
                </h3>
                <p className="text-gray-600">
                  Detailed analytics and insights will be available soon
                </p>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <DollarSign className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Earnings Coming Soon
                </h3>
                <p className="text-gray-600">
                  Track your earnings and revenue will be available soon
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 