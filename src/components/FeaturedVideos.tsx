import React, { useEffect, useRef, useState } from 'react';

const featuredVideos = [
  {
    url: 'https://picsum.photos/800/450?random=1',
    aspectRatio: '16:9' as const,
    title: 'Gaming Marathon Stream',
    isLive: true,
    viewers: 12847,
    valuation: '2340',
    change: { percent: 12.4, direction: 'up' },
    user: {
      name: 'GamerPro',
      profilePic: 'https://picsum.photos/40/40?random=101',
      followers: 125000
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=2',
    aspectRatio: '16:9' as const,
    title: 'Music Production Live',
    isLive: true,
    viewers: 8293,
    valuation: '1850',
    change: { percent: 5.7, direction: 'up' },
    user: {
      name: 'MusicMaker',
      profilePic: 'https://picsum.photos/40/40?random=102',
      followers: 89000
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=3',
    aspectRatio: '16:9' as const,
    title: 'Cooking with Chef Max',
    isLive: true,
    viewers: 15632,
    valuation: '3120',
    change: { percent: 8.9, direction: 'down' },
    user: {
      name: 'ChefMax',
      profilePic: 'https://picsum.photos/40/40?random=103',
      followers: 234000
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=4',
    aspectRatio: '16:9' as const,
    title: 'Art & Design Workshop',
    isLive: true,
    viewers: 6547,
    valuation: '1290',
    change: { percent: 15.2, direction: 'up' },
    user: {
      name: 'ArtStudio',
      profilePic: 'https://picsum.photos/40/40?random=104',
      followers: 67000
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=5',
    aspectRatio: '16:9' as const,
    title: 'Tech Talk & Reviews',
    isLive: true,
    viewers: 23481,
    valuation: '4560',
    change: { percent: 3.1, direction: 'down' },
    user: {
      name: 'TechGuru',
      profilePic: 'https://picsum.photos/40/40?random=105',
      followers: 456000
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=6',
    aspectRatio: '16:9' as const,
    title: 'Fitness & Wellness',
    isLive: true,
    viewers: 9876,
    valuation: '2100',
    change: { percent: 21.8, direction: 'up' },
    user: {
      name: 'FitLife',
      profilePic: 'https://picsum.photos/40/40?random=106',
      followers: 178000
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=7',
    aspectRatio: '16:9' as const,
    title: 'Travel Adventures Live',
    isLive: true,
    viewers: 14567,
    valuation: '2890',
    change: { percent: 14.3, direction: 'up' },
    user: {
      name: 'TravelBug',
      profilePic: 'https://picsum.photos/40/40?random=107',
      followers: 203000
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=8',
    aspectRatio: '16:9' as const,
    title: 'Comedy Night Special',
    isLive: true,
    viewers: 18765,
    valuation: '3450',
    change: { percent: 7.8, direction: 'up' },
    user: {
      name: 'ComedyKing',
      profilePic: 'https://picsum.photos/40/40?random=108',
      followers: 312000
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=9',
    aspectRatio: '16:9' as const,
    title: 'Science & Discovery',
    isLive: true,
    viewers: 11234,
    valuation: '1980',
    change: { percent: 9.2, direction: 'down' },
    user: {
      name: 'ScienceExplorer',
      profilePic: 'https://picsum.photos/40/40?random=109',
      followers: 156000
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=10',
    aspectRatio: '16:9' as const,
    title: 'Business & Finance Tips',
    isLive: true,
    viewers: 8765,
    valuation: '1670',
    change: { percent: 11.5, direction: 'up' },
    user: {
      name: 'FinanceGuru',
      profilePic: 'https://picsum.photos/40/40?random=110',
      followers: 134000
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=11',
    aspectRatio: '16:9' as const,
    title: 'Gaming Tournament Finals',
    isLive: true,
    viewers: 29876,
    valuation: '5230',
    change: { percent: 18.7, direction: 'up' },
    user: {
      name: 'TournamentPro',
      profilePic: 'https://picsum.photos/40/40?random=111',
      followers: 567000
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=12',
    aspectRatio: '16:9' as const,
    title: 'Music Concert Live',
    isLive: true,
    viewers: 34567,
    valuation: '6780',
    change: { percent: 22.1, direction: 'up' },
    user: {
      name: 'LiveMusic',
      profilePic: 'https://picsum.photos/40/40?random=112',
      followers: 789000
    }
  }
];

export const FeaturedVideos: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalRotation, setTotalRotation] = useState(0); // Track continuous rotation
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const itemAngle = 360 / featuredVideos.length;

  // Dynamic sizing - much larger radius to prevent overlap
  const radius = Math.min(containerSize.width, containerSize.height) * 0.8;
  const itemWidth = Math.min(containerSize.width * 0.25, 350);
  const itemHeight = itemWidth * 0.56; // 16:9 aspect ratio

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredVideos.length);
      setTotalRotation(prev => prev + itemAngle);
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging, featuredVideos.length, itemAngle]);

  // Handle container resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setStartX(e.clientX);
    setDragDistance(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    // Allow both left and right drag with limited distance
    setDragDistance(Math.max(Math.min(deltaX, itemWidth * 0.3), -itemWidth * 0.3));
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Drag threshold based on item width
    const threshold = itemWidth * 0.2; // 20% of item width
    
    if (dragDistance < -threshold) {
      // Dragged left - go to next video (infinite loop)
      setCurrentIndex(prev => (prev + 1) % featuredVideos.length);
      setTotalRotation(prev => prev + itemAngle); // Increase continuous rotation
    } else if (dragDistance > threshold) {
      // Dragged right - go to previous video (infinite loop)
      setCurrentIndex(prev => (prev - 1 + featuredVideos.length) % featuredVideos.length);
      setTotalRotation(prev => prev - itemAngle); // Decrease continuous rotation
    }
    
    setDragDistance(0);
    
    // Resume auto-rotation after a delay
    setTimeout(() => setIsAutoRotating(true), 2000);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setStartX(e.touches[0].clientX);
    setDragDistance(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - startX;
    // Allow both left and right swipe with limited distance
    setDragDistance(Math.max(Math.min(deltaX, itemWidth * 0.3), -itemWidth * 0.3));
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Touch threshold
    const threshold = itemWidth * 0.15; // 15% of item width for touch
    
    if (dragDistance < -threshold) {
      // Swiped left - go to next video (infinite loop)
      setCurrentIndex(prev => (prev + 1) % featuredVideos.length);
      setTotalRotation(prev => prev + itemAngle); // Increase continuous rotation
    } else if (dragDistance > threshold) {
      // Swiped right - go to previous video (infinite loop)
      setCurrentIndex(prev => (prev - 1 + featuredVideos.length) % featuredVideos.length);
      setTotalRotation(prev => prev - itemAngle); // Decrease continuous rotation
    }
    
    setDragDistance(0);
    
    // Resume auto-rotation after a delay
    setTimeout(() => setIsAutoRotating(true), 2000);
  };

  const currentRotation = totalRotation - (dragDistance * 0.05); // Use continuous rotation

  return (
    <div className="w-full bg-transparent">
      <div 
        ref={containerRef}
        className="relative w-full flex items-center justify-center overflow-visible"
        style={{
          padding: '10px 0',
          margin: '0',
          minHeight: '600px'
        }}
      >
        {/* 3D Carousel Container */}
        <div 
          ref={carouselRef}
          className="relative cursor-grab active:cursor-grabbing select-none"
          style={{
            width: containerSize.width,
            height: containerSize.height,
            perspective: `${radius * 2}px`,
            transformStyle: 'preserve-3d'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 3D Carousel Items */}
          <div
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${-currentRotation}deg)`,
              transition: isDragging 
                ? 'none' 
                : 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            {featuredVideos.map((video, index) => {
              const angle = index * itemAngle;
              const isActive = index === currentIndex;
              
              // Calculate distance from current for scaling
              let distanceFromCurrent = Math.abs(index - currentIndex);
              if (distanceFromCurrent > featuredVideos.length / 2) {
                distanceFromCurrent = featuredVideos.length - distanceFromCurrent;
              }
              
              const scale = isActive ? 1.0 : Math.max(0.4, 1 - (distanceFromCurrent * 0.25));
              const opacity = isActive ? 1 : Math.max(0.3, 1 - (distanceFromCurrent * 0.3));
              
              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    width: `${itemWidth}px`,
                    height: `${itemHeight}px`,
                    left: '50%',
                    top: '50%',
                    transform: `
                      translate(-50%, -50%)
                      rotateY(${angle}deg)
                      translateZ(${radius}px)
                      scale(${scale})
                    `,
                    transformStyle: 'preserve-3d',
                    opacity: opacity,
                    zIndex: isActive ? 10 : 1,
                    transition: isDragging 
                      ? 'none' 
                      : 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                >
                  <div
                    className={`relative w-full h-full rounded-2xl overflow-hidden group ${
                      isActive 
                        ? 'shadow-2xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-400/60 hover:scale-105' 
                        : 'shadow-xl shadow-black/20 hover:shadow-lg hover:shadow-white/20'
                    }`}
                    style={{
                      border: isActive 
                        ? '1px solid rgba(59, 130, 246, 0.7)' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    <img
                      src={video.url}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      draggable={false}
                    />
                    
                    {/* Radiant glow overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    {/* Live indicator (top-left) */}
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <div className="flex items-center bg-red-600 px-2 py-1 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                        <span className="text-white text-xs font-bold">LIVE</span>
                      </div>
                    </div>

                    {/* Live stats overlay (only for active/center video) */}
                    {isActive && (
                      <div className="absolute top-3 right-3 flex flex-col items-end space-y-2">
                        {/* Viewers count */}
                        <div 
                          className="px-3 py-1 rounded-full text-[10px] font-semibold text-white flex items-center space-x-1"
                          style={{
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)'
                          }}
                        >
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span>{video.viewers?.toLocaleString()}</span>
                        </div>
                        
                        {/* Token valuation */}
                        <div 
                          className="px-3 py-1 rounded-full text-[10px] font-bold text-purple-300 flex items-center space-x-1"
                          style={{
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)'
                          }}
                        >
                          <svg className="w-2.5 h-2.5 text-purple-400" viewBox="0 0 38 33" fill="currentColor">
                            <path d="M29 10.2c-.7-.4-1.6-.4-2.4 0L21 13.5l-3.8 2.1-5.5 3.3c-.7.4-1.6-.4-2.4 0L7 17.2c-.7-.4-1.2-1.2-1.2-2.1v-4c0-.8.4-1.6 1.2-2.1l2.3-1.3c.7-.4 1.6-.4 2.4 0L14 9.1c.7.4 1.2 1.2 1.2 2.1v3.3l3.8-2.2V9c0-.8-.4-1.6-1.2-2.1l-6-3.5c-.7-.4-1.6-.4-2.4 0L3.2 7.8c-.7.4-1.2 1.2-1.2 2.1v7.3c0 .8.4 1.6 1.2 2.1l6.2 3.6c.7.4 1.6.4 2.4 0L17 20.8l3.8-2.1 5.5-3.2c.7-.4 1.6-.4 2.4 0l2.3 1.3c.7.4 1.2 1.2 1.2 2.1v4c0 .8-.4 1.6-1.2 2.1L29 26.3c-.7.4-1.6.4-2.4 0l-2.3-1.3c-.7-.4-1.2-1.2-1.2-2.1V19.6l-3.8 2.2v3.3c0 .8.4 1.6 1.2 2.1l6.2 3.6c.7.4 1.6.4 2.4 0l6.2-3.6c.7-.4 1.2-1.2 1.2-2.1V17.8c0-.8-.4-1.6-1.2-2.1L29 10.2z"/>
                          </svg>
                          <span>{video.valuation}</span>
                          <span className={`ml-2 flex items-center text-[10px] font-bold ${video.change.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                            {video.change.direction === 'up' ? '▲' : '▼'}&nbsp;{video.change.percent}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Stream title bar */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 p-4"
                      style={{
                        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4))'
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        {/* User Profile */}
                        <div className="flex items-center space-x-2">
                          <img
                            src={video.user.profilePic}
                            alt={video.user.name}
                            className="w-6 h-6 rounded-full border border-white/20"
                            draggable={false}
                          />
                          <span className={`text-white font-semibold ${
                            isActive ? 'text-sm' : 'text-xs'
                          }`}>
                            {video.user.name}
                          </span>
                          <span className={`text-gray-400 ${
                            isActive ? 'text-[10px]' : 'text-[8px]'
                          }`}>
                            {video.user.followers >= 1000000 
                              ? `${(video.user.followers / 1000000).toFixed(1)}M` 
                              : video.user.followers >= 1000 
                                ? `${(video.user.followers / 1000).toFixed(1)}K` 
                                : video.user.followers
                            }
                          </span>
                        </div>

                        {/* Follow Button */}
                        <button 
                          className={`px-3 py-1 rounded-full font-semibold transition-all duration-200 hover:scale-105 border ${
                            isActive 
                              ? 'bg-purple-600 hover:bg-purple-500 text-white text-xs shadow-lg shadow-purple-500/30 border-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' 
                              : 'bg-purple-500/60 hover:bg-purple-500/80 text-white text-[10px] shadow-md shadow-purple-500/20 border-blue-400/60 shadow-[0_0_6px_rgba(96,165,250,0.4)]'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle follow logic here
                          }}
                        >
                          Follow
                        </button>
                      </div>
                      
                      <h3 className={`text-white font-semibold truncate ${
                        isActive ? 'text-lg' : 'text-sm'
                      }`}>
                        {video.title}
                      </h3>
                      {!isActive && (
                        <div className="flex items-center space-x-2 mt-1 text-[9px] text-gray-300">
                          <span className="flex items-center space-x-0.5">
                            <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                            <span>{video.viewers?.toLocaleString()}</span>
                          </span>
                          <span className="flex items-center space-x-0.5 text-purple-300">
                            <svg className="w-2 h-2 text-purple-400" viewBox="0 0 38 33" fill="currentColor">
                              <path d="M29 10.2c-.7-.4-1.6-.4-2.4 0L21 13.5l-3.8 2.1-5.5 3.3c-.7.4-1.6-.4-2.4 0L7 17.2c-.7-.4-1.2-1.2-1.2-2.1v-4c0-.8.4-1.6 1.2-2.1l2.3-1.3c.7-.4 1.6-.4 2.4 0L14 9.1c.7.4 1.2 1.2 1.2 2.1v3.3l3.8-2.2V9c0-.8-.4-1.6-1.2-2.1l-6-3.5c-.7-.4-1.6-.4-2.4 0L3.2 7.8c-.7.4-1.2 1.2-1.2 2.1v7.3c0 .8.4 1.6 1.2 2.1l6.2 3.6c.7.4 1.6.4 2.4 0L17 20.8l3.8-2.1 5.5-3.2c.7-.4 1.6-.4 2.4 0l2.3 1.3c.7.4 1.2 1.2 1.2 2.1v4c0 .8-.4 1.6-1.2 2.1L29 26.3c-.7.4-1.6.4-2.4 0l-2.3-1.3c-.7-.4-1.2-1.2-1.2-2.1V19.6l-3.8 2.2v3.3c0 .8.4 1.6 1.2 2.1l6.2 3.6c.7.4 1.6.4 2.4 0l6.2-3.6c.7-.4 1.2-1.2 1.2-2.1V17.8c0-.8-.4-1.6-1.2-2.1L29 10.2z"/>
                            </svg>
                            <span>{video.valuation}</span>
                            <span className={`ml-1 flex items-center text-[9px] ${video.change.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                             {video.change.direction === 'up' ? '▲' : '▼'}&nbsp;{video.change.percent}%
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};