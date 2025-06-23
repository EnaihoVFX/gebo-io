import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';

const verticalVideos = [
  {
    url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Mobile Gaming Highlights',
    viewers: 7812,
    valuation: '1540',
    change: { percent: 9.1, direction: 'up' as const },
    user: {
      name: 'MobileGamer',
      profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Live Q&A Session',
    viewers: 4523,
    valuation: '980',
    change: { percent: 4.2, direction: 'down' as const },
    user: {
      name: 'QAMaster',
      profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Behind the Scenes',
    viewers: 11034,
    valuation: '2200',
    change: { percent: 18.5, direction: 'up' as const },
    user: {
      name: 'BehindScenes',
      profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Product Unboxing',
    viewers: 9823,
    valuation: '1950',
    change: { percent: 6.8, direction: 'up' as const },
    user: {
      name: 'UnboxPro',
      profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Creative Corner',
    viewers: 6210,
    valuation: '1300',
    change: { percent: 2.3, direction: 'down' as const },
    user: {
      name: 'CreativeMind',
      profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Dance Challenge Compilation',
    viewers: 18456,
    valuation: '3600',
    change: { percent: 25.0, direction: 'up' as const },
    user: {
      name: 'DanceKing',
      profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Fitness Workout Short',
    viewers: 12345,
    valuation: '2450',
    change: { percent: 12.7, direction: 'up' as const },
    user: {
      name: 'FitShorts',
      profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Cooking Quick Tips',
    viewers: 8765,
    valuation: '1780',
    change: { percent: 8.3, direction: 'up' as const },
    user: {
      name: 'QuickChef',
      profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Travel Moments',
    viewers: 15678,
    valuation: '3120',
    change: { percent: 15.9, direction: 'up' as const },
    user: {
      name: 'TravelVlog',
      profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Comedy Skits',
    viewers: 9876,
    valuation: '1980',
    change: { percent: 6.2, direction: 'down' as const },
    user: {
      name: 'ComedyShort',
      profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Art Process',
    viewers: 5432,
    valuation: '1120',
    change: { percent: 3.8, direction: 'up' as const },
    user: {
      name: 'ArtProcess',
      profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Music Covers',
    viewers: 13456,
    valuation: '2670',
    change: { percent: 11.4, direction: 'up' as const },
    user: {
      name: 'MusicCover',
      profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Tech Reviews',
    viewers: 7654,
    valuation: '1540',
    change: { percent: 7.1, direction: 'down' as const },
    user: {
      name: 'TechReview',
      profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Pet Adventures',
    viewers: 11234,
    valuation: '2230',
    change: { percent: 9.6, direction: 'up' as const },
    user: {
      name: 'PetAdventures',
      profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Gaming Stream',
    viewers: 18923,
    valuation: '3780',
    change: { percent: 22.1, direction: 'up' as const },
    user: {
      name: 'GameStream',
      profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Fashion Haul',
    viewers: 14567,
    valuation: '2890',
    change: { percent: 14.3, direction: 'up' as const },
    user: {
      name: 'FashionVlog',
      profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Study With Me',
    viewers: 8765,
    valuation: '1750',
    change: { percent: 5.7, direction: 'up' as const },
    user: {
      name: 'StudyBuddy',
      profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=30&h=30&fit=crop&crop=face'
    }
  },
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=450&h=800&fit=crop&crop=center',
    aspectRatio: '9:16' as const,
    title: 'Morning Routine',
    viewers: 12345,
    valuation: '2460',
    change: { percent: 11.2, direction: 'up' as const },
    user: {
      name: 'MorningVibes',
      profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop&crop=face'
    }
  }
];

export const VerticalVideos: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [onboardingDetails, setOnboardingDetails] = useState<any>(null);
  const videosPerRow = 6;
  const totalPages = Math.ceil(verticalVideos.length / videosPerRow);
  const startIndex = currentPage * videosPerRow;
  const visibleVideos = verticalVideos.slice(startIndex, startIndex + videosPerRow);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const details = localStorage.getItem('onboardingDetails');
      if (details) {
        setOnboardingDetails(JSON.parse(details));
      }
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isHovered && !isTransitioning) {
        handleNext();
      }
    }, 4000); // Increased interval for smoother experience

    return () => clearInterval(intervalId);
  }, [isHovered, isTransitioning, totalPages]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  return (
    <div className="w-full bg-transparent">
      {onboardingDetails && onboardingDetails.username && (
        <div style={{
          color: '#a855f7',
          fontWeight: 600,
          fontSize: '15px',
          marginBottom: '8px',
          marginLeft: '8px',
          letterSpacing: '0.01em',
          textShadow: '0 2px 8px #0008',
        }}>
          {onboardingDetails.username.startsWith('@')
            ? onboardingDetails.username
            : '@' + onboardingDetails.username}
        </div>
      )}
      <section style={{ 
        width: '100%',
        marginBottom: '24px',
        padding: '12px 0',
        overflow: 'visible'
      }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            margin: 0,
            padding: 0,
            borderRadius: '12px',
            overflow: 'visible',
            transform: 'scale(1.02)',
            transformOrigin: 'center top',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {totalPages > 1 && (
            <>
              <button
                onClick={handlePrev}
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  opacity: isHovered ? 1 : 0,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  zIndex: 10,
                  marginRight: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
                  e.currentTarget.style.transform = 'scale(1.15)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                }}
              >
                <ChevronLeft size={24} />
              </button>
            </>
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${videosPerRow}, 1fr)`,
            gap: '16px',
            padding: '8px',
            width: '100%',
            transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
            opacity: isTransitioning ? 0.8 : 1,
          }}>
            {visibleVideos.length === 0 ? (
              <div style={{ gridColumn: `span ${videosPerRow}`, textAlign: 'center', color: '#888', fontSize: '16px', padding: '32px 0' }}>
                No shorts available.
              </div>
            ) : (
              visibleVideos.map((video, index) => (
                <div
                  key={startIndex + index}
                  style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    animation: `fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s both`
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '177.78%', // 9:16 aspect ratio
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: '#1a1a1a',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      border: '1px solid #333333'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.5)';
                      e.currentTarget.style.borderColor = '#4a4a4a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.borderColor = '#333333';
                    }}
                  >
                    <img
                      src={video.url}
                      alt={video.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                  <div style={{
                    padding: '0 4px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <img
                        src={video.user.profilePic}
                        alt={video.user.name}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: '2px solid #333333'
                        }}
                      />
                      <span style={{ 
                        color: '#ffffff', 
                        fontSize: '12px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        {video.user.name}
                      </span>
                    </div>
                    <h3 style={{ 
                      color: '#ffffff', 
                      margin: 0, 
                      fontSize: '14px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textAlign: 'left'
                    }}>
                      {video.title}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                      }}>
                          <span style={{ fontSize: '12px', color: '#a855f7', fontWeight: '600' }}>{video.valuation} POL</span>
                          <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              color: video.change.direction === 'up' ? '#4ade80' : '#f87171',
                          }}>
                              {video.change.direction === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                              <span style={{ fontSize: '12px', fontWeight: '600' }}>{video.change.percent.toFixed(1)}%</span>
                          </div>
                      </div>
                      <span style={{ fontSize: '11px', color: '#888888' }}>{`${(video.viewers / 1000).toFixed(1)}k views`}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {totalPages > 1 && (
            <>
              <button
                onClick={handleNext}
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  opacity: isHovered ? 1 : 0,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  zIndex: 10,
                  marginLeft: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
                  e.currentTarget.style.transform = 'scale(1.15)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}; 