import React, { useEffect, useRef, useState } from 'react';

const PolygonMaticIcon = () => (
  <svg width="20" height="20" viewBox="0 0 38 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.447 7.081a4.13 4.13 0 0 0-4.13 0l-3.447 1.99-3.447-1.99a4.13 4.13 0 0 0-4.13 0l-3.447 1.99A4.13 4.13 0 0 0 7 12.061v3.98a4.13 4.13 0 0 0 2.223 3.59l3.447 1.99a4.13 4.13 0 0 0 4.13 0l3.447-1.99 3.447 1.99a4.13 4.13 0 0 0 4.13 0l3.447-1.99A4.13 4.13 0 0 0 37 16.041v-3.98a4.13 4.13 0 0 0-2.223-3.59l-3.447-1.99zm-1.723 2.98 3.447 1.99a1.13 1.13 0 0 1 .61.99v3.98a1.13 1.13 0 0 1-.61.99l-3.447 1.99a1.13 1.13 0 0 1-1.13 0l-3.447-1.99a1.13 1.13 0 0 1-.61-.99v-3.98a1.13 1.13 0 0 1 .61-.99l3.447-1.99a1.13 1.13 0 0 1 1.13 0zm-13.448 0a1.13 1.13 0 0 1 1.13 0l3.447 1.99a1.13 1.13 0 0 1 .61.99v3.98a1.13 1.13 0 0 1-.61.99l-3.447 1.99a1.13 1.13 0 0 1-1.13 0l-3.447-1.99a1.13 1.13 0 0 1-.61-.99v-3.98a1.13 1.13 0 0 1 .61-.99l3.447-1.99z" fill="#8247e5"/>
  </svg>
);

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
    },
    preview: 'https://www.w3schools.com/html/mov_bbb.mp4'
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
    },
    preview: 'https://www.w3schools.com/html/mov_bbb.mp4'
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
    },
    preview: 'https://www.w3schools.com/html/mov_bbb.mp4'
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
    },
    preview: 'https://www.w3schools.com/html/mov_bbb.mp4'
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
    },
    preview: 'https://www.w3schools.com/html/mov_bbb.mp4'
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
    },
    preview: 'https://www.w3schools.com/html/mov_bbb.mp4'
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
    },
    preview: 'https://www.w3schools.com/html/mov_bbb.mp4'
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
    },
    preview: 'https://www.w3schools.com/html/mov_bbb.mp4'
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
    },
    preview: 'https://www.w3schools.com/html/mov_bbb.mp4'
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
    },
    preview: 'https://www.w3schools.com/html/mov_bbb.mp4'
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
    },
    preview: 'https://www.w3schools.com/html/mov_bbb.mp4'
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
    },
    preview: 'https://www.w3schools.com/html/mov_bbb.mp4'
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
  const radius = Math.min(containerSize.width, containerSize.height) * 1.1;
  const itemWidth = Math.min(containerSize.width * 0.35, 480);
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
          padding: '32px 0',
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
          onMouseEnter={() => setIsAutoRotating(false)}
          onMouseLeave={() => setIsAutoRotating(true)}
          onTouchCancel={() => setIsAutoRotating(true)}
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
                    className={`relative w-full h-full rounded-2xl overflow-hidden group glassmorphic-featured-card ${isActive ? 'shadow-2xl hover:scale-105' : 'shadow-xl hover:shadow-lg'}`}
                    style={{
                      border: '1.5px solid rgba(255,255,255,0.35)',
                      background: 'rgba(255,255,255,0.22)',
                      backdropFilter: 'blur(24px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                      boxShadow: isActive ? '0 8px 32px 0 rgba(31, 38, 135, 0.18)' : '0 4px 16px 0 rgba(31, 38, 135, 0.08)',
                      transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    <img
                      src={video.url}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:opacity-0"
                      draggable={false}
                    />
                    {video.preview && (
                      <video
                        src={video.preview}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    )}
                    {/* Radiant glow overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    {/* Live indicator (top-left) */}
                    <div className="absolute top-2 left-2 flex items-center space-x-1">
                      {video.isLive && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Live</span>}
                      <span className="text-[10px] text-white/80 font-semibold">{video.viewers.toLocaleString()} watching</span>
                      <span className="flex items-center gap-1 bg-white/70 rounded-full px-2 py-0.5 shadow-md ml-2" style={{backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)'}}>
                        <img src="/polygon-matic-logo.svg" alt="Polygon MATIC" width={14} height={14} style={{display:'inline',verticalAlign:'middle'}} />
                        <span className="text-[10px] font-semibold text-[#8247e5] ml-1 flex items-center">
                          {video.valuation || '2,340'}
                          {/* Percentage change, colored by direction */}
                          {video.change && (
                            <span style={{
                              color: video.change.direction === 'up' ? '#22c55e' : '#ef4444',
                              marginLeft: '4px',
                              fontWeight: 700
                            }}>
                              {video.change.direction === 'up' ? '+' : '-'}{Math.abs(video.change.percent).toFixed(1)}%
                            </span>
                          )}
                          {video.change && video.change.direction === 'up' && (
                            <svg width="10" height="10" viewBox="0 0 10 10" className="ml-1" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8V2M5 2L2 5M5 2l3 3" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          )}
                          {video.change && video.change.direction === 'down' && (
                            <svg width="10" height="10" viewBox="0 0 10 10" className="ml-1" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 2v6M5 8l3-3M5 8L2 5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          )}
                        </span>
                      </span>
                    </div>
                    {/* Minimal user info (bottom-left) */}
                    <div className="absolute bottom-2 left-2 flex items-center space-x-2 bg-black/40 rounded-lg px-2 py-1">
                      <img src={video.user.profilePic} alt={video.user.name} className="w-6 h-6 rounded-full border border-white/30" />
                      <span className="text-[10px] text-white font-medium truncate max-w-[80px]">{video.user.name}</span>
                      {/* Small follow button with plus */}
                      <button
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.18)',
                          border: '1px solid rgba(255,255,255,0.25)',
                          color: '#8247e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '14px',
                          marginLeft: '4px',
                          boxShadow: '0 2px 8px rgba(130,71,229,0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          backdropFilter: 'blur(8px)',
                        }}
                        title="Follow"
                        aria-label="Follow"
                        tabIndex={0}
                        onMouseEnter={e => (e.currentTarget.style.background = '#8247e5', e.currentTarget.style.color = '#fff')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)', e.currentTarget.style.color = '#8247e5')}
                      >
                        +
                      </button>
                    </div>
                    {/* Minimal title (bottom) */}
                    <div className="absolute bottom-2 right-2 bg-black/40 rounded-lg px-2 py-1">
                      <span className="text-[10px] text-white font-semibold truncate max-w-[120px]">{video.title}</span>
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