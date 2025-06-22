'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Heart, 
  Share2, 
  Download,
  Eye,
  Clock,
  User,
  Tag,
  Globe,
  Lock,
  Users,
  Sparkles
} from 'lucide-react';
import { mockVideoService, VideoMetadata } from '@/utils/mockVideoService';

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  
  const [video, setVideo] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLiked, setUserLiked] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState<VideoMetadata[]>([]);

  useEffect(() => {
    loadVideo();
  }, [videoId]);

  const loadVideo = async () => {
    if (!videoId) return;
    
    setIsLoading(true);
    try {
      const videoData = await mockVideoService.getVideoById(videoId);
      if (videoData) {
      setVideo(videoData);
        // Increment view count
        await mockVideoService.incrementViews(videoId);
        
        // Load related videos
        const allVideos = await mockVideoService.getPublicVideos();
        const related = allVideos
          .filter(v => v.id !== videoId && v.category === videoData.category)
          .slice(0, 6);
        setRelatedVideos(related);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error loading video:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!video) return;
    
    try {
      const result = await mockVideoService.toggleLike(video.id, 'user-address');
      setUserLiked(result.userLiked);
      setVideo(prev => prev ? { ...prev, likes: result.likes } : null);
    } catch (error) {
      console.error('Error liking video:', error);
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

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="w-4 h-4 text-green-600" />;
      case 'unlisted':
        return <Users className="w-4 h-4 text-yellow-600" />;
      case 'private':
        return <Lock className="w-4 h-4 text-red-600" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Video not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden mb-6">
              <div className="relative aspect-video">
                <video
                  className="w-full h-full object-cover"
                  poster={video.thumbnailUrl}
                  controls
                  preload="metadata"
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {video.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                  <span>{formatViews(video.views)} views</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(video.createdAt)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      {getVisibilityIcon(video.visibility)}
                      <span className="capitalize">{video.visibility}</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      userLiked
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${userLiked ? 'fill-current' : ''}`} />
                    <span>{formatViews(video.likes)}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                    </button>
              </div>
            </div>

            {/* Creator Info */}
              <div className="flex items-center space-x-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                  </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{video.creator}</h3>
                  <p className="text-sm text-gray-600">{video.creatorAddress}</p>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Subscribe
                </button>
            </div>

              {/* Description */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
            </div>

              {/* Tags */}
              {video.tags.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* NFT Info */}
              {video.tokenId && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">NFT Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Token ID:</span>
                      <span className="ml-2 font-mono">{video.tokenId}</span>
                  </div>
                    <div>
                      <span className="text-gray-600">Contract:</span>
                      <span className="ml-2 font-mono">{video.contractAddress}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Transaction:</span>
                      <span className="ml-2 font-mono">{video.blockchainTx}</span>
                  </div>
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <span className="ml-2 capitalize">{video.category}</span>
                    </div>
                  </div>
                </div>
                  )}
                </div>
              </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Videos */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Related Videos</h3>
              <div className="space-y-4">
                {relatedVideos.map((relatedVideo) => (
                  <div
                    key={relatedVideo.id}
                    onClick={() => router.push(`/video/${relatedVideo.id}`)}
                    className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <img
                      src={relatedVideo.thumbnailUrl}
                      alt={relatedVideo.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                        {relatedVideo.title}
                      </h4>
                      <p className="text-xs text-gray-600">{relatedVideo.creator}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <span>{formatViews(relatedVideo.views)} views</span>
                        <span>•</span>
                        <span>{formatTimeAgo(relatedVideo.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

            {/* Video Stats */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Video Statistics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-medium">{formatViews(video.views)}</span>
                    </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Likes:</span>
                  <span className="font-medium">{formatViews(video.likes)}</span>
                  </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dislikes:</span>
                  <span className="font-medium">{formatViews(video.dislikes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium capitalize">{video.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium uppercase">{video.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monetization:</span>
                  <span className="font-medium">{video.monetization ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 