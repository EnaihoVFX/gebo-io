import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Video {
  url: string;
  aspectRatio: string;
  title?: string;
  description?: string;
}

interface VideoCarouselProps {
  videos: Video[];
  videosPerRow?: number;
  isSlider?: boolean;
  showTitleBelow?: boolean;
}

export const VideoCarousel: React.FC<VideoCarouselProps> = ({
  videos,
  videosPerRow = 4,
  isSlider = true,
  showTitleBelow = false
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const totalPages = Math.ceil(videos.length / videosPerRow);

  useEffect(() => {
    if (isSlider && !isHovered && !isTransitioning) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isSlider, isHovered, isTransitioning, totalPages]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const visibleVideos = isSlider
    ? videos.slice(currentPage * videosPerRow, (currentPage + 1) * videosPerRow)
    : videos;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        marginBottom: '32px',
        overflow: 'visible'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${videosPerRow}, 1fr)`,
          gap: '16px',
          width: '100%',
          overflow: 'visible',
          transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
          opacity: isTransitioning ? 0.8 : 1,
        }}
      >
        {visibleVideos.map((video, index) => (
          <div
            key={index}
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: video.aspectRatio === '9:16' ? '177.78%' : '56.25%',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.1)',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              animation: `fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s both`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <img
              src={video.url}
              alt={video.title || `Video ${index + 1}`}
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
        ))}
      </div>

      {isSlider && (
        <>
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '-48px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: isHovered ? 1 : 0,
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              animation: isHovered ? 'slideInLeft 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.15)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ChevronLeft style={{ color: '#fff', width: '24px', height: '24px' }} />
          </button>

          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '-48px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: isHovered ? 1 : 0,
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              animation: isHovered ? 'slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.15)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ChevronRight style={{ color: '#fff', width: '24px', height: '24px' }} />
          </button>
        </>
      )}

      {showTitleBelow && (
        <div style={{ marginTop: '16px' }}>
          {visibleVideos.map((video, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '4px' }}>
                {video.title}
              </h3>
              {video.description && (
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  {video.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 