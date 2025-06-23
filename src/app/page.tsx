'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Eye, 
  Heart, 
  Clock, 
  Search,
  Upload,
  User
} from 'lucide-react';
import { mockVideoService, VideoMetadata } from '@/utils/mockVideoService';
import TrendingVideos from '@/components/TrendingVideos';
import { FeaturedVideos } from '@/components/FeaturedVideos';
import { VerticalVideos } from '@/components/VerticalVideos';
import { RegularVideos } from '@/components/RegularVideos';

const categories = [
  'All',
  'Entertainment',
  'Gaming',
  'Music',
  'Education',
  'News',
  'Sports',
  'Technology',
  'Lifestyle'
];

export default function Home() {
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const publicVideos = await mockVideoService.getPublicVideos();
      setVideos(publicVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadVideos();
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await mockVideoService.searchVideos(searchQuery);
      setVideos(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    setIsLoading(true);
    
    try {
      if (category === 'All') {
        const publicVideos = await mockVideoService.getPublicVideos();
        setVideos(publicVideos);
      } else {
        const categoryVideos = await mockVideoService.getVideosByCategory(category);
        setVideos(categoryVideos);
      }
    } catch (error) {
      console.error('Category filter error:', error);
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

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10">
        {/* Featured Videos */}
        <section className="px-4 pt-0 pb-1">
          <div className="max-w-7xl mx-auto">
            <FeaturedVideos />
          </div>
        </section>
        {/* Shorts (Vertical Videos) - move higher, reduce spacing */}
        <section className="px-4 pt-1 pb-1">
          <div className="max-w-7xl mx-auto">
            <VerticalVideos />
          </div>
        </section>
        {/* Regular Videos - no header */}
        <section className="px-4 pt-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <RegularVideos />
          </div>
        </section>
        <div className="w-full h-0.5 bg-gradient-to-r from-pink-900 via-blue-900 to-purple-900 opacity-10 mb-2" />
        {/* Trending Videos - no header */}
        <section className="px-4 pt-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <TrendingVideos />
          </div>
        </section>
      </div>
    </div>
  );
}
