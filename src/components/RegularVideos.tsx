import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';

const regularVideos = [
  {
    url: 'https://picsum.photos/800/450?random=10',
    aspectRatio: '16:9' as const,
    title: 'Morning Coffee & Chat',
    viewers: 5432,
    valuation: '890',
    change: { percent: 7.2, direction: 'up' as const },
    user: {
      name: 'CoffeeLover',
      profilePic: 'https://picsum.photos/30/30?random=301'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=11',
    aspectRatio: '16:9' as const,
    title: 'Tech Review: Latest Gadgets',
    viewers: 7891,
    valuation: '1240',
    change: { percent: 3.8, direction: 'down' as const },
    user: {
      name: 'TechGuru',
      profilePic: 'https://picsum.photos/30/30?random=302'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=12',
    aspectRatio: '16:9' as const,
    title: 'Cooking Masterclass: Pasta',
    viewers: 12345,
    valuation: '2100',
    change: { percent: 12.5, direction: 'up' as const },
    user: {
      name: 'ChefMaria',
      profilePic: 'https://picsum.photos/30/30?random=303'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=13',
    aspectRatio: '16:9' as const,
    title: 'Travel Vlog: Tokyo Streets',
    viewers: 6543,
    valuation: '1100',
    change: { percent: 1.9, direction: 'down' as const },
    user: {
      name: 'Wanderlust',
      profilePic: 'https://picsum.photos/30/30?random=304'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=14',
    aspectRatio: '16:9' as const,
    title: 'Fitness Challenge Day 30',
    viewers: 9876,
    valuation: '1650',
    change: { percent: 8.7, direction: 'up' as const },
    user: {
      name: 'FitLife',
      profilePic: 'https://picsum.photos/30/30?random=305'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=15',
    aspectRatio: '16:9' as const,
    title: 'Music Production Tips',
    viewers: 4321,
    valuation: '720',
    change: { percent: 5.3, direction: 'up' as const },
    user: {
      name: 'MusicMaker',
      profilePic: 'https://picsum.photos/30/30?random=306'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=16',
    aspectRatio: '16:9' as const,
    title: 'Gaming Tournament Finals',
    viewers: 15678,
    valuation: '2800',
    change: { percent: 15.2, direction: 'up' as const },
    user: {
      name: 'GameMaster',
      profilePic: 'https://picsum.photos/30/30?random=307'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=17',
    aspectRatio: '16:9' as const,
    title: 'Art Tutorial: Watercolors',
    viewers: 8765,
    valuation: '1450',
    change: { percent: 2.1, direction: 'down' as const },
    user: {
      name: 'ArtStudio',
      profilePic: 'https://picsum.photos/30/30?random=308'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=18',
    aspectRatio: '16:9' as const,
    title: 'Book Review: New Releases',
    viewers: 11234,
    valuation: '1950',
    change: { percent: 9.8, direction: 'up' as const },
    user: {
      name: 'BookWorm',
      profilePic: 'https://picsum.photos/30/30?random=309'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=19',
    aspectRatio: '16:9' as const,
    title: 'DIY Home Projects',
    viewers: 5678,
    valuation: '950',
    change: { percent: 4.5, direction: 'up' as const },
    user: {
      name: 'DIYExpert',
      profilePic: 'https://picsum.photos/30/30?random=310'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=20',
    aspectRatio: '16:9' as const,
    title: 'Science Explained Simply',
    viewers: 13456,
    valuation: '2300',
    change: { percent: 11.3, direction: 'up' as const },
    user: {
      name: 'ScienceGuy',
      profilePic: 'https://picsum.photos/30/30?random=311'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=21',
    aspectRatio: '16:9' as const,
    title: 'Pet Care & Training Tips',
    viewers: 7654,
    valuation: '1280',
    change: { percent: 6.7, direction: 'down' as const },
    user: {
      name: 'PetLover',
      profilePic: 'https://picsum.photos/30/30?random=312'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=22',
    aspectRatio: '16:9' as const,
    title: 'Photography Masterclass',
    viewers: 9876,
    valuation: '1670',
    change: { percent: 8.9, direction: 'up' as const },
    user: {
      name: 'PhotoPro',
      profilePic: 'https://picsum.photos/30/30?random=313'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=23',
    aspectRatio: '16:9' as const,
    title: 'Language Learning Tips',
    viewers: 6543,
    valuation: '1120',
    change: { percent: 3.2, direction: 'down' as const },
    user: {
      name: 'LanguageLearner',
      profilePic: 'https://picsum.photos/30/30?random=314'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=24',
    aspectRatio: '16:9' as const,
    title: 'Garden & Plant Care',
    viewers: 4321,
    valuation: '890',
    change: { percent: 5.7, direction: 'up' as const },
    user: {
      name: 'GardenGuru',
      profilePic: 'https://picsum.photos/30/30?random=315'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=25',
    aspectRatio: '16:9' as const,
    title: 'Car Maintenance Guide',
    viewers: 8765,
    valuation: '1450',
    change: { percent: 7.4, direction: 'up' as const },
    user: {
      name: 'CarExpert',
      profilePic: 'https://picsum.photos/30/30?random=316'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=26',
    aspectRatio: '16:9' as const,
    title: 'Yoga & Meditation',
    viewers: 12345,
    valuation: '2100',
    change: { percent: 12.8, direction: 'up' as const },
    user: {
      name: 'YogaMaster',
      profilePic: 'https://picsum.photos/30/30?random=317'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=27',
    aspectRatio: '16:9' as const,
    title: 'Baking Tutorial: Cakes',
    viewers: 7654,
    valuation: '1280',
    change: { percent: 4.1, direction: 'down' as const },
    user: {
      name: 'BakingPro',
      profilePic: 'https://picsum.photos/30/30?random=318'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=28',
    aspectRatio: '16:9' as const,
    title: 'Investment Strategies',
    viewers: 15678,
    valuation: '2890',
    change: { percent: 16.3, direction: 'up' as const },
    user: {
      name: 'InvestorGuru',
      profilePic: 'https://picsum.photos/30/30?random=319'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=29',
    aspectRatio: '16:9' as const,
    title: 'Sketching & Drawing',
    viewers: 5432,
    valuation: '980',
    change: { percent: 2.8, direction: 'up' as const },
    user: {
      name: 'SketchArtist',
      profilePic: 'https://picsum.photos/30/30?random=320'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=30',
    aspectRatio: '16:9' as const,
    title: 'Movie Reviews & Analysis',
    viewers: 11234,
    valuation: '1950',
    change: { percent: 9.5, direction: 'up' as const },
    user: {
      name: 'MovieCritic',
      profilePic: 'https://picsum.photos/30/30?random=321'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=31',
    aspectRatio: '16:9' as const,
    title: 'Fashion & Style Tips',
    viewers: 9876,
    valuation: '1670',
    change: { percent: 6.9, direction: 'down' as const },
    user: {
      name: 'Fashionista',
      profilePic: 'https://picsum.photos/30/30?random=322'
    }
  },
  {
    url: 'https://picsum.photos/800/450?random=32',
    aspectRatio: '16:9' as const,
    title: 'Woodworking Projects',
    viewers: 6543,
    valuation: '1120',
    change: { percent: 8.2, direction: 'up' as const },
    user: {
      name: 'WoodWorker',
      profilePic: 'https://picsum.photos/30/30?random=323'
    }
  }
];

export const RegularVideos: React.FC = () => {
  return (
    <div className="w-full bg-transparent">
      <section style={{ 
        width: '100%',
        marginBottom: '32px',
        padding: '16px 0',
        overflow: 'visible'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          width: '100%',
          overflow: 'visible'
        }}>
          {regularVideos.map((video, index) => {
            const slug = video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return (
              <Link key={index} href={`/video/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div
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
                      paddingTop: '56.25%', // 16:9 aspect ratio
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
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}; 