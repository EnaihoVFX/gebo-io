'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockVideoService, VideoMetadata } from '@/utils/mockVideoService';
import { Play } from 'lucide-react';

interface VideoSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoSearch({ isOpen, onClose }: VideoSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VideoMetadata[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          event.preventDefault();
          if (results.length > 0) {
            handleVideoSelect(results[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // Get recent videos and filter by search query
      const allVideos = await mockVideoService.getRecentVideos(50);
      const filtered = allVideos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.creator.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setResults(filtered);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVideoSelect = (video: VideoMetadata) => {
    onClose();
    router.push(`/video/${video.id}`);
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
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center pt-20">
      <div 
        ref={searchRef}
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-96 overflow-hidden"
      >
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search videos on the blockchain..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 pl-10 pr-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 && query.length >= 2 && !isSearching && (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>No videos found for "{query}"</p>
              <p className="text-sm mt-2">Try searching for different keywords</p>
            </div>
          )}
          
          {query.length < 2 && (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">🎬</div>
              <p>Start typing to search videos on the blockchain...</p>
            </div>
          )}

          {results.map((video, index) => (
            <div
              key={video.id}
              onClick={() => handleVideoSelect(video)}
              className={`p-4 cursor-pointer transition-colors ${
                index === selectedIndex ? 'bg-red-50 border-l-4 border-red-500' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="relative flex-shrink-0">
                  <div
                    style={{
                      position: 'relative',
                      width: '80px',
                      height: '48px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: 'rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
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
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                    2:30
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{video.title}</h3>
                  <p className="text-sm text-gray-500">{video.creator.slice(0, 6)}...{video.creator.slice(-4)}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                    <span>{formatViews(video.views)} views</span>
                    <span>•</span>
                    <span>{formatTimeAgo(new Date(video.createdAt).getTime())}</span>
                  </div>
                </div>
                
                {index === selectedIndex && (
                  <div className="text-red-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex justify-between items-center">
            <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
            <span>{results.length} results from blockchain</span>
          </div>
        </div>
      </div>
    </div>
  );
} 