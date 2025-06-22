export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  language: string;
  visibility: 'public' | 'unlisted' | 'private';
  thumbnailUrl: string;
  videoUrl: string;
  videoHash: string;
  thumbnailHash: string;
  creator: string;
  creatorAddress: string;
  createdAt: string;
  views: number;
  likes: number;
  dislikes: number;
  monetization: boolean;
  ageRestriction: boolean;
  allowComments: boolean;
  allowRatings: boolean;
  allowEmbedding: boolean;
  tokenId?: string;
  contractAddress?: string;
  blockchainTx?: string;
}

class MockVideoService {
  private videos: VideoMetadata[] = [];
  private nextId = 1;

  constructor() {
    // Initialize with sample videos
    this.initializeSampleVideos();
  }

  private initializeSampleVideos() {
    const sampleVideos: Omit<VideoMetadata, 'id' | 'createdAt' | 'views' | 'likes' | 'dislikes' | 'tokenId' | 'contractAddress' | 'blockchainTx'>[] = [
      {
        title: "Amazing Sunset Timelapse",
        description: "A beautiful timelapse of a sunset over the mountains. Captured over 3 hours and compressed into 2 minutes of pure magic.",
        tags: ["timelapse", "sunset", "nature", "mountains", "photography"],
        category: "Entertainment",
        language: "en",
        visibility: "public",
        thumbnailUrl: "https://picsum.photos/400/240?random=10",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        videoHash: "QmSampleVideo1",
        thumbnailHash: "QmSampleThumbnail1",
        creator: "NatureVideos",
        creatorAddress: "0x1234567890123456789012345678901234567890",
        monetization: true,
        ageRestriction: false,
        allowComments: true,
        allowRatings: true,
        allowEmbedding: true,
      },
      {
        title: "Cooking Masterclass: Perfect Pasta",
        description: "Learn how to make the perfect pasta from scratch with our step-by-step guide. From dough to plate in under 30 minutes.",
        tags: ["cooking", "pasta", "recipe", "food", "tutorial"],
        category: "Lifestyle",
        language: "en",
        visibility: "public",
        thumbnailUrl: "https://picsum.photos/400/240?random=11",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        videoHash: "QmSampleVideo2",
        thumbnailHash: "QmSampleThumbnail2",
        creator: "ChefMaster",
        creatorAddress: "0x1234567890123456789012345678901234567890",
        monetization: false,
        ageRestriction: false,
        allowComments: true,
        allowRatings: true,
        allowEmbedding: true,
      },
      {
        title: "Gaming Highlights: Epic Win Streak",
        description: "Watch this incredible gaming session where we achieved a 15-game win streak in competitive play. Amazing plays and strategies!",
        tags: ["gaming", "highlights", "competitive", "strategy", "esports"],
        category: "Gaming",
        language: "en",
        visibility: "public",
        thumbnailUrl: "https://picsum.photos/400/240?random=12",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        videoHash: "QmSampleVideo3",
        thumbnailHash: "QmSampleThumbnail3",
        creator: "ProGamer",
        creatorAddress: "0x1234567890123456789012345678901234567890",
        monetization: true,
        ageRestriction: false,
        allowComments: true,
        allowRatings: true,
        allowEmbedding: false,
      },
      {
        title: "Tech Review: Latest Smartphone",
        description: "Comprehensive review of the newest smartphone release. We test camera quality, performance, battery life, and more.",
        tags: ["tech", "review", "smartphone", "camera", "performance"],
        category: "Technology",
        language: "en",
        visibility: "public",
        thumbnailUrl: "https://picsum.photos/400/240?random=13",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        videoHash: "QmSampleVideo4",
        thumbnailHash: "QmSampleThumbnail4",
        creator: "TechReviewer",
        creatorAddress: "0x1234567890123456789012345678901234567890",
        monetization: true,
        ageRestriction: false,
        allowComments: true,
        allowRatings: true,
        allowEmbedding: true,
      },
      {
        title: "Music Cover: Popular Song",
        description: "Beautiful acoustic cover of a popular song. Performed live with guitar and vocals in a cozy studio setting.",
        tags: ["music", "cover", "acoustic", "guitar", "live"],
        category: "Music",
        language: "en",
        visibility: "public",
        thumbnailUrl: "https://picsum.photos/400/240?random=14",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        videoHash: "QmSampleVideo5",
        thumbnailHash: "QmSampleThumbnail5",
        creator: "MusicArtist",
        creatorAddress: "0x1234567890123456789012345678901234567890",
        monetization: false,
        ageRestriction: false,
        allowComments: true,
        allowRatings: true,
        allowEmbedding: true,
      },
      {
        title: "Educational: Math Made Easy",
        description: "Learn advanced calculus concepts in a simple, easy-to-understand way. Perfect for students and math enthusiasts.",
        tags: ["education", "math", "calculus", "tutorial", "learning"],
        category: "Education",
        language: "en",
        visibility: "public",
        thumbnailUrl: "https://picsum.photos/400/240?random=15",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        videoHash: "QmSampleVideo6",
        thumbnailHash: "QmSampleThumbnail6",
        creator: "MathTeacher",
        creatorAddress: "0x1234567890123456789012345678901234567890",
        monetization: false,
        ageRestriction: false,
        allowComments: true,
        allowRatings: true,
        allowEmbedding: true,
      }
    ];

    // Add sample videos with proper metadata
    sampleVideos.forEach((video, index) => {
      const sampleVideo: VideoMetadata = {
        ...video,
        id: `video_${this.nextId++}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
        views: Math.floor(Math.random() * 10000) + 100,
        likes: Math.floor(Math.random() * 500) + 10,
        dislikes: Math.floor(Math.random() * 50),
        tokenId: `#${Math.floor(Math.random() * 1000000)}`,
        contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
        blockchainTx: '0x' + Math.random().toString(16).substr(2, 64),
      };
      this.videos.push(sampleVideo);
    });
  }

  // Simulate minting a video NFT
  async mintVideo(metadata: Omit<VideoMetadata, 'id' | 'createdAt' | 'views' | 'likes' | 'dislikes' | 'tokenId' | 'contractAddress' | 'blockchainTx'>): Promise<VideoMetadata> {
    const video: VideoMetadata = {
      ...metadata,
      id: `video_${this.nextId++}`,
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      dislikes: 0,
      tokenId: `#${Math.floor(Math.random() * 1000000)}`,
      contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
      blockchainTx: '0x' + Math.random().toString(16).substr(2, 64),
    };

    this.videos.push(video);
    
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return video;
  }

  // Get all public videos
  async getPublicVideos(): Promise<VideoMetadata[]> {
    return this.videos.filter(video => video.visibility === 'public');
  }

  // Get videos by creator
  async getVideosByCreator(creatorAddress: string): Promise<VideoMetadata[]> {
    return this.videos.filter(video => video.creatorAddress === creatorAddress);
  }

  // Get video by ID
  async getVideoById(id: string): Promise<VideoMetadata | null> {
    return this.videos.find(video => video.id === id) || null;
  }

  // Search videos
  async searchVideos(query: string): Promise<VideoMetadata[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.videos.filter(video => 
      video.visibility === 'public' && (
        video.title.toLowerCase().includes(lowercaseQuery) ||
        video.description.toLowerCase().includes(lowercaseQuery) ||
        video.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        video.category.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  // Get trending videos (most viewed in last 7 days)
  async getTrendingVideos(): Promise<VideoMetadata[]> {
    return this.videos
      .filter(video => video.visibility === 'public')
      .sort((a, b) => b.views - a.views)
      .slice(0, 20);
  }

  // Increment view count
  async incrementViews(videoId: string): Promise<void> {
    const video = this.videos.find(v => v.id === videoId);
    if (video) {
      video.views++;
    }
  }

  // Like/unlike video
  async toggleLike(videoId: string, userAddress: string): Promise<{ likes: number; userLiked: boolean }> {
    const video = this.videos.find(v => v.id === videoId);
    if (video) {
      // Simulate like toggle (in real app, you'd track user likes)
      video.likes++;
      return { likes: video.likes, userLiked: true };
    }
    return { likes: 0, userLiked: false };
  }

  // Get video statistics
  async getVideoStats(videoId: string): Promise<{ views: number; likes: number; dislikes: number } | null> {
    const video = this.videos.find(v => v.id === videoId);
    if (video) {
      return {
        views: video.views,
        likes: video.likes,
        dislikes: video.dislikes
      };
    }
    return null;
  }

  // Get categories
  async getCategories(): Promise<string[]> {
    const categories = [...new Set(this.videos.map(video => video.category))];
    return categories.sort();
  }

  // Get videos by category
  async getVideosByCategory(category: string): Promise<VideoMetadata[]> {
    return this.videos.filter(video => 
      video.visibility === 'public' && video.category === category
    );
  }

  // Get recent videos (for search functionality)
  async getRecentVideos(count: number = 10): Promise<VideoMetadata[]> {
    return this.videos
      .filter(video => video.visibility === 'public')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, count);
  }

  // Get thumbnail URL (for search functionality)
  getThumbnailUrl(thumbnailHash: string): string {
    // For demo purposes, return a base64 encoded placeholder image
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNjM2NmYxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5WaWRlbzwvdGV4dD4KPC9zdmc+";
  }

  // Simulate blockchain transaction
  async simulateBlockchainTransaction(action: string, data: any): Promise<{
    success: boolean;
    txHash: string;
    blockNumber: number;
    gasUsed: number;
  }> {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      txHash: '0x' + Math.random().toString(16).substr(2, 64),
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
      gasUsed: Math.floor(Math.random() * 500000) + 100000,
    };
  }
}

// Create singleton instance
export const mockVideoService = new MockVideoService(); 