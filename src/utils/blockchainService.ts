import { ethers } from 'ethers';
import { defaultChain } from '@/config/chains';

// IPFS Configuration
const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
const IPFS_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const IPFS_FALLBACK_API = 'https://api.web3.storage/upload';

// VideoNFT Contract ABI (extracted from the smart contract)
const VIDEO_NFT_ABI = [
  'function mintVideo(string memory videoHash, string memory thumbnailHash, string memory title, string memory description, string memory duration, bool isShortForm) external returns (uint256)',
  'function getVideo(uint256 tokenId) external view returns (tuple(string videoHash, string thumbnailHash, string title, string description, address creator, uint256 timestamp, uint256 views, uint256 likes, string duration, bool isShortForm, uint256 adRevenueGenerated, uint256 lastAdRevenueUpdate))',
  'function getCreatorVideos(address creator) external view returns (uint256[] memory)',
  'function getRecentVideos(uint256 count) external view returns (uint256[] memory)',
  'function getShortFormVideos(uint256 count) external view returns (uint256[] memory)',
  'function listNFT(uint256 tokenId, uint256 price) external',
  'function buyNFT(uint256 tokenId) external payable',
  'function getListing(uint256 tokenId) external view returns (tuple(uint256 tokenId, address seller, uint256 price, bool isListed, uint256 adRevenueShare))',
  'function isListed(uint256 tokenId) external view returns (bool)',
  'function updateViews(uint256 tokenId) external',
  'function updateLikes(uint256 tokenId) external',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function totalSupply() external view returns (uint256)',
  'event VideoMinted(uint256 indexed tokenId, string videoHash, address indexed creator, string title)',
  'event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price)',
  'event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price)',
  'event AdRevenueGenerated(uint256 indexed tokenId, uint256 amount)',
  'event AdRevenueDistributed(uint256 indexed tokenId, address indexed recipient, uint256 amount)'
];

// Contract address (replace with actual deployed contract address)
const VIDEO_NFT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x06049d835bac69e7751cad2c9ab1aa88808fc1b3';

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  creator: string;
  videoHash: string;
  thumbnailHash: string;
  timestamp: number;
  views: number;
  likes: number;
  duration: string;
  isShortForm: boolean;
  adRevenueGenerated: number;
  lastAdRevenueUpdate: number;
  isListed: boolean;
  listingPrice?: number;
  owner: string;
}

export interface UploadResult {
  tokenId: string;
  videoHash: string;
  thumbnailHash: string;
  success: boolean;
  error?: string;
}

export interface NFTListing {
  tokenId: string;
  seller: string;
  price: number;
  isListed: boolean;
  adRevenueShare: number;
}

export interface AdRevenuePrediction {
  predictedRevenue: number;
  confidence: number;
  factors: string[];
  timeframe: string;
  marketSentiment: string;
  audienceDemographics: string[];
  contentCategory: string;
  engagementScore: number;
  viralPotential: number;
}

export interface VideoData {
  videoHash: string;
  thumbnailHash: string;
  title: string;
  description: string;
  duration: string;
  isShortForm?: boolean; // Optional, defaults to false
}

class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;

  async initialize() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Check if contract address is properly configured
        if (VIDEO_NFT_ADDRESS === '0x1234567890123456789012345678901234567890') {
          throw new Error('Contract not deployed. Please deploy the VideoNFT contract first by running: npx hardhat run scripts/deploy-video-nft.js --network mumbai');
        }

        this.provider = new ethers.BrowserProvider(window.ethereum);
        
        // Check current network
        const network = await this.provider.getNetwork();
        console.log('Current network:', network);
        
        // Don't force network switching - let the user choose
        // The app will work with any supported network
        console.log(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
        
        this.signer = await this.provider.getSigner();
        this.contract = new ethers.Contract(VIDEO_NFT_ADDRESS, VIDEO_NFT_ABI, this.signer);
        
        console.log('Blockchain service initialized');
        console.log('Contract address:', VIDEO_NFT_ADDRESS);
      } catch (error) {
        console.error('Failed to initialize blockchain service:', error);
        throw new Error(`Failed to connect to wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      throw new Error('No wallet detected. Please install MetaMask or another Web3 wallet.');
    }
  }

  async uploadToIPFS(file: File, type: 'video' | 'thumbnail'): Promise<string> {
    try {
      // First try Pinata if JWT is configured
      const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;
      if (pinataJWT && pinataJWT !== 'your-pinata-jwt-token' && pinataJWT !== 'your_pinata_jwt_token') {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(IPFS_API_URL, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${pinataJWT}`
            },
            body: formData
          });

          if (response.ok) {
            const data = await response.json();
            console.log('✅ Successfully uploaded to Pinata IPFS:', data.IpfsHash);
            return data.IpfsHash;
          }
        } catch (pinataError) {
          console.warn('Pinata upload failed, trying fallback:', pinataError);
        }
      }

      // Fallback: Use Web3.Storage (free tier, no auth required for small files)
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(IPFS_FALLBACK_API, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Successfully uploaded to Web3.Storage IPFS:', data.cid);
          return data.cid;
        } else {
          throw new Error(`Web3.Storage upload failed: ${response.status} ${response.statusText}`);
        }
      } catch (web3Error) {
        console.error('Web3.Storage upload failed:', web3Error);
        
        // Remove mock hash fallback - require real IPFS upload
        throw new Error('All IPFS upload methods failed. Please configure Pinata JWT token or check your internet connection.');
      }
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error(`Failed to upload to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadToIPFSFromBase64(base64Data: string, fileName: string): Promise<{ success: boolean; hash?: string; error?: string }> {
    try {
      // Convert base64 to blob
      const response = await fetch(base64Data);
      const blob = await response.blob();
      
      // Create file from blob
      const file = new File([blob], fileName, { type: blob.type });
      
      // Upload to IPFS
      const hash = await this.uploadToIPFS(file, 'video');
      
      return {
        success: true,
        hash
      };
    } catch (error) {
      console.error('IPFS upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload to IPFS'
      };
    }
  }

  async uploadToIPFSFromFile(file: File, fileName: string): Promise<{ success: boolean; hash?: string; error?: string }> {
    try {
      // Upload to IPFS using the existing uploadToIPFS method
      const hash = await this.uploadToIPFS(file, 'video');
      
      return {
        success: true,
        hash
      };
    } catch (error) {
      console.error('IPFS upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload to IPFS'
      };
    }
  }

  async uploadToIPFSFromUrl(url: string, fileName: string): Promise<{ success: boolean; hash?: string; error?: string }> {
    try {
      // Fetch the file from the URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch file from URL');
      }
      
      const blob = await response.blob();
      
      // Create file from blob
      const file = new File([blob], fileName, { type: blob.type });
      
      // Upload to IPFS
      const hash = await this.uploadToIPFS(file, 'video');
      
      return {
        success: true,
        hash
      };
    } catch (error) {
      console.error('IPFS upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload to IPFS'
      };
    }
  }

  async mintVideo(
    videoFile: File,
    thumbnailFile: File,
    title: string,
    description: string,
    duration: string,
    isShortForm: boolean = false
  ): Promise<UploadResult> {
    try {
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected');
      }

      // Upload video to IPFS
      const videoHash = await this.uploadToIPFS(videoFile, 'video');
      
      // Upload thumbnail to IPFS
      const thumbnailHash = await this.uploadToIPFS(thumbnailFile, 'thumbnail');

      // Mint NFT on blockchain
      const tx = await this.contract.mintVideo(
        videoHash,
        thumbnailHash,
        title,
        description,
        duration,
        isShortForm
      );

      const receipt = await tx.wait();
      
      // Find the VideoMinted event to get the token ID
      const event = receipt.logs.find((log: any) => 
        log.fragment && log.fragment.name === 'VideoMinted'
      ) as any;

      if (!event || !event.args) {
        throw new Error('Failed to get token ID from transaction - VideoMinted event not found');
      }

      const tokenId = event.args[0].toString();

      return {
        tokenId,
        videoHash,
        thumbnailHash,
        success: true
      };
    } catch (error) {
      console.error('Mint error:', error);
      return {
        tokenId: '',
        videoHash: '',
        thumbnailHash: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getVideo(tokenId: string): Promise<VideoMetadata | null> {
    try {
      if (!this.contract) {
        await this.initialize();
      }

      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const videoData = await this.contract.getVideo(tokenId);
      
      // Handle struct return type
      const video = {
        videoHash: videoData[0],
        thumbnailHash: videoData[1],
        title: videoData[2],
        description: videoData[3],
        creator: videoData[4],
        timestamp: Number(videoData[5]),
        views: Number(videoData[6]),
        likes: Number(videoData[7]),
        duration: videoData[8],
        isShortForm: videoData[9],
        adRevenueGenerated: Number(ethers.formatEther(videoData[10])),
        lastAdRevenueUpdate: Number(videoData[11])
      };

      // Get owner
      const owner = await this.contract.ownerOf(tokenId);
      
      // Get listing info
      let listing = null;
      try {
        const listingData = await this.contract.getListing(tokenId);
        listing = {
          tokenId: listingData[0].toString(),
          seller: listingData[1],
          price: Number(ethers.formatEther(listingData[2])),
          isListed: listingData[3],
          adRevenueShare: Number(listingData[4])
        };
      } catch (error) {
        // NFT not listed
      }

      return {
        id: tokenId,
        title: video.title,
        description: video.description,
        creator: video.creator,
        videoHash: video.videoHash,
        thumbnailHash: video.thumbnailHash,
        timestamp: video.timestamp,
        views: video.views,
        likes: video.likes,
        duration: video.duration,
        isShortForm: video.isShortForm,
        adRevenueGenerated: video.adRevenueGenerated,
        lastAdRevenueUpdate: video.lastAdRevenueUpdate,
        isListed: listing?.isListed || false,
        listingPrice: listing?.price,
        owner: owner
      };
    } catch (error) {
      console.error('Get video error:', error);
      return null;
    }
  }

  async getRecentVideos(count: number = 10): Promise<VideoMetadata[]> {
    try {
      if (!this.contract) {
        await this.initialize();
      }

      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      // First check if there are any videos minted
      try {
        const videoIds = await this.contract.getRecentVideos(count);
        
        // Handle empty result
        if (!videoIds || videoIds.length === 0) {
          console.log('No videos found - returning empty array');
          return [];
        }

        const videos = await Promise.all(
          videoIds.map((id: bigint) => this.getVideo(id.toString()))
        );

        return videos.filter(video => video !== null);
      } catch (error: any) {
        console.warn('getRecentVideos failed, trying alternative approach:', error);
        
        // Fallback: try to get videos by checking token IDs manually
        return this.getRecentVideosFallback(count);
      }
    } catch (error) {
      console.error('Error getting recent videos:', error);
      return [];
    }
  }

  // Fallback method to get recent videos by checking token IDs manually
  private async getRecentVideosFallback(count: number): Promise<VideoMetadata[]> {
    try {
      const videos: VideoMetadata[] = [];
      let tokenId = 1;
      let found = 0;
      
      // Try to find videos by checking token IDs sequentially
      while (found < count && tokenId <= 100) { // Limit to first 100 tokens
        try {
          const video = await this.getVideo(tokenId.toString());
          if (video) {
            videos.push(video);
            found++;
          }
        } catch (error) {
          // Token doesn't exist, continue to next
        }
        tokenId++;
      }
      
      // Return videos in reverse order (most recent first)
      return videos.reverse();
    } catch (error) {
      console.error('Fallback getRecentVideos failed:', error);
      return [];
    }
  }

  async getShortFormVideos(count: number = 10): Promise<VideoMetadata[]> {
    try {
      await this.initialize();

      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const videoIds = await this.contract.getShortFormVideos(count);
      const videos = await Promise.all(
        videoIds.map((id: bigint) => this.getVideo(id.toString()))
      );
      return videos.filter(video => video !== null) as VideoMetadata[];
    } catch (error) {
      console.error('Get short form videos error:', error);
      return [];
    }
  }

  async getVideosByCreator(creatorAddress: string): Promise<VideoMetadata[]> {
    try {
      await this.initialize();

      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const videoIds = await this.contract.getCreatorVideos(creatorAddress);
      const videos = await Promise.all(
        videoIds.map((id: bigint) => this.getVideo(id.toString()))
      );
      return videos.filter(video => video !== null) as VideoMetadata[];
    } catch (error) {
      console.error('Get creator videos error:', error);
      return [];
    }
  }

  async listNFT(tokenId: string, price: number): Promise<boolean> {
    try {
      await this.initialize();

      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const priceWei = ethers.parseEther(price.toString());
      const tx = await this.contract.listNFT(tokenId, priceWei);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('List NFT error:', error);
      return false;
    }
  }

  async buyNFT(tokenId: string, price: number): Promise<boolean> {
    try {
      await this.initialize();

      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const priceWei = ethers.parseEther(price.toString());
      const tx = await this.contract.buyNFT(tokenId, { value: priceWei });
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Buy NFT error:', error);
      return false;
    }
  }

  async getListing(tokenId: string): Promise<NFTListing | null> {
    try {
      await this.initialize();

      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const listingData = await this.contract.getListing(tokenId);
      
      // Handle struct return type
      return {
        tokenId: listingData[0].toString(),
        seller: listingData[1],
        price: Number(ethers.formatEther(listingData[2])),
        isListed: listingData[3],
        adRevenueShare: Number(listingData[4])
      };
    } catch (error) {
      console.error('Get listing error:', error);
      return null;
    }
  }

  async updateViews(tokenId: string): Promise<boolean> {
    try {
      await this.initialize();

      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.contract.updateViews(tokenId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Update views error:', error);
      return false;
    }
  }

  async updateLikes(tokenId: string): Promise<boolean> {
    try {
      await this.initialize();

      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.contract.updateLikes(tokenId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Update likes error:', error);
      return false;
    }
  }

  async getAdRevenuePrediction(video: VideoMetadata): Promise<AdRevenuePrediction> {
    try {
      // Call Jenius MCP API for ad revenue prediction
      const response = await fetch('/api/jenius/predict-revenue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: video.id,
          title: video.title,
          description: video.description,
          views: video.views,
          likes: video.likes,
          duration: video.duration,
          isShortForm: video.isShortForm,
          timestamp: video.timestamp
        })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to get ad revenue prediction:', error);
    }

    // Fallback prediction based on video metrics
    const baseRevenue = video.views * 0.001; // $0.001 per view
    const engagementMultiplier = (video.likes / Math.max(video.views, 1)) * 10;
    const durationMultiplier = video.isShortForm ? 1.5 : 1.0;
    const predictedRevenue = baseRevenue * engagementMultiplier * durationMultiplier;

    return {
      predictedRevenue: Math.round(predictedRevenue * 100) / 100,
      confidence: 0.7,
      factors: ['View count', 'Engagement rate', 'Content duration', 'Format type'],
      timeframe: '30 days',
      marketSentiment: '',
      audienceDemographics: [],
      contentCategory: '',
      engagementScore: 0,
      viralPotential: 0
    };
  }

  getVideoUrl(videoHash: string): string {
    return `${IPFS_GATEWAY}${videoHash}`;
  }

  getThumbnailUrl(thumbnailHash: string): string {
    return `${IPFS_GATEWAY}${thumbnailHash}`;
  }

  async getConnectedAddress(): Promise<string | null> {
    try {
      await this.initialize();
      if (this.signer) {
        return await this.signer.getAddress();
      }
      return null;
    } catch (error) {
      console.error('Get connected address error:', error);
      return null;
    }
  }

  async isOwner(tokenId: string): Promise<boolean> {
    try {
      const address = await this.getConnectedAddress();
      if (!address) return false;

      const video = await this.getVideo(tokenId);
      return video?.owner === address;
    } catch (error) {
      console.error('Check ownership error:', error);
      return false;
    }
  }

  async mintVideoNFT(
    videoData: VideoData,
    onProgress?: (message: string) => void
  ): Promise<string> {
    try {
      console.log('🚀 Starting mintVideoNFT with data:', videoData);
      onProgress?.('Connecting to wallet...');
      const provider = await this.getProvider();
      const signer = await this.getSigner();
      
      if (!signer) {
        throw new Error('No signer available');
      }

      onProgress?.('Getting contract instance...');
      const contract = this.getVideoNFTContract(signer);
      console.log('📋 Contract address:', VIDEO_NFT_ADDRESS);
      
      onProgress?.('Preparing transaction...');
      const {
        videoHash,
        thumbnailHash,
        title,
        description,
        duration,
        isShortForm = false
      } = videoData;

      console.log('📝 Transaction parameters:', {
        videoHash,
        thumbnailHash,
        title,
        description,
        duration,
        isShortForm
      });

      // Try multiple gas strategies
      const gasStrategies = [
        {
          name: 'Local Network Gas',
          gasPrice: ethers.parseUnits('1', 'gwei'), // 1 Gwei for local network
          gasLimit: 5000000, // 5M gas limit
        },
        {
          name: 'High Gas Tip Cap',
          gasPrice: ethers.parseUnits('2000', 'gwei'), // 2000 Gwei
          maxPriorityFeePerGas: ethers.parseUnits('50', 'gwei'), // 50 Gwei tip
          maxFeePerGas: ethers.parseUnits('2050', 'gwei'), // 2050 Gwei max
          gasLimit: 5000000, // 5M gas limit
        },
        {
          name: 'Extreme Gas Tip Cap',
          gasPrice: ethers.parseUnits('3000', 'gwei'), // 3000 Gwei
          maxPriorityFeePerGas: ethers.parseUnits('100', 'gwei'), // 100 Gwei tip
          maxFeePerGas: ethers.parseUnits('3100', 'gwei'), // 3100 Gwei max
          gasLimit: 5000000, // 5M gas limit
        },
        {
          name: 'Legacy High Gas',
          gasPrice: ethers.parseUnits('5000', 'gwei'), // 5000 Gwei legacy
          gasLimit: 5000000, // 5M gas limit
        }
      ];

      let lastError: any;
      
      for (const strategy of gasStrategies) {
        try {
          console.log(`🔄 Trying ${strategy.name}...`);
          onProgress?.(`Trying ${strategy.name}...`);
          
          const tx = await contract.mintVideo(
            videoHash,
            thumbnailHash,
            title,
            description,
            duration,
            isShortForm,
            {
              ...strategy
            }
          );

          console.log('✅ Transaction sent:', tx.hash);
          onProgress?.('Transaction sent! Waiting for confirmation...');
          const receipt = await tx.wait();
          
          if (receipt?.status === 1) {
            console.log('🎉 Transaction confirmed!');
            onProgress?.('Transaction confirmed!');
            return receipt.transactionHash;
          } else {
            throw new Error('Transaction failed');
          }
        } catch (error: any) {
          lastError = error;
          console.log(`❌ ${strategy.name} failed:`, error.message);
          continue;
        }
      }

      // If all strategies fail, try with MetaMask's gas estimation
      try {
        console.log('🔄 Trying with MetaMask gas estimation...');
        onProgress?.('Trying with MetaMask gas estimation...');
        const tx = await contract.mintVideo(
          videoHash,
          thumbnailHash,
          title,
          description,
          duration,
          isShortForm
        );

        console.log('✅ Transaction sent:', tx.hash);
        onProgress?.('Transaction sent! Waiting for confirmation...');
        const receipt = await tx.wait();
        
        if (receipt?.status === 1) {
          console.log('🎉 Transaction confirmed!');
          onProgress?.('Transaction confirmed!');
          return receipt.transactionHash;
        } else {
          throw new Error('Transaction failed');
        }
      } catch (error: any) {
        lastError = error;
        console.log('❌ MetaMask estimation failed:', error.message);
      }

      // If all Amoy strategies fail, suggest switching to Mumbai
      if (lastError?.message?.includes('gas tip cap') || lastError?.message?.includes('gas price below minimum')) {
        throw new Error(`Amoy testnet has very high gas requirements. Consider switching to Polygon Mumbai testnet or using a local Hardhat network for testing. Last error: ${lastError.message}`);
      }

      throw new Error(`All gas strategies failed. Last error: ${lastError?.message || 'Unknown error'}`);

    } catch (error: any) {
      console.error('💥 Mint error:', error);
      throw new Error(`Failed to mint video NFT: ${error.message}`);
    }
  }

  async createCreatorToken(
    title: string,
    description: string,
    initialPrice: number,
    totalSupply: number
  ): Promise<{ success: boolean; tokenAddress?: string; transactionHash?: string; error?: string }> {
    try {
      await this.initialize();

      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      // For demo purposes, we'll simulate creator token creation
      // In a real implementation, this would deploy the CreatorToken contract
      
      // Simulate transaction
      const mockTransactionHash = `0x${Math.random().toString(36).substring(2, 15)}`;
      const mockTokenAddress = `0x${Math.random().toString(36).substring(2, 15)}`;

      return {
        success: true,
        tokenAddress: mockTokenAddress,
        transactionHash: mockTransactionHash
      };
    } catch (error) {
      console.error('Creator token creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create creator token'
      };
    }
  }

  // Simple test function for NFT minting
  async testMintNFT(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing simple NFT minting...');
      console.log('Using contract address:', VIDEO_NFT_ADDRESS);
      
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected or contract not initialized');
      }

      // Simple test data
      const ipfsHash = 'QmTestHash123456789';
      const thumbnailHash = 'QmThumbnailHash123';
      const title = 'Test Video';
      const description = 'Test Description';

      console.log('Attempting simple mint with minimal settings...');

      // Try with absolutely minimal gas settings
      const tx = await this.contract.mintVideo(
        ipfsHash,
        thumbnailHash,
        title,
        description,
        '0:00',
        false,
        {
          gasLimit: 500000 // Fixed gas limit
        }
      );

      console.log('Simple transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Simple transaction confirmed:', receipt?.hash);

      return { success: true };
    } catch (error) {
      console.error('Simple mint test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Direct RPC test function that bypasses MetaMask
  async testDirectMint(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing direct RPC minting...');
      console.log('Using contract address:', VIDEO_NFT_ADDRESS);
      
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected or contract not initialized');
      }

      // Get the signer's address
      const address = await this.signer.getAddress();
      console.log('Signer address:', address);

      // Get current nonce
      const nonce = await this.signer.getNonce();
      console.log('Current nonce:', nonce);

      // Create the transaction data
      const data = this.contract.interface.encodeFunctionData('mintVideo', [
        'QmTestHash123456789',
        'QmThumbnailHash123',
        'Test Video',
        'Test Description',
        '0:00',
        false
      ]);

      // Create transaction with explicit high gas price
      const rawTx = {
        to: VIDEO_NFT_ADDRESS,
        data: data,
        gasLimit: '0x7a120', // 500,000 gas
        gasPrice: '0x59682f400', // 150 Gwei in hex
        nonce: nonce,
        type: 0 // Legacy transaction
      };

      console.log('Raw transaction:', rawTx);

      // Sign the transaction
      const signedTx = await this.signer.signTransaction(rawTx);
      console.log('Signed transaction:', signedTx);

      // Send via direct RPC call
      const txHash = await this.provider!.send('eth_sendRawTransaction', [signedTx]);
      console.log('Transaction hash:', txHash);

      // Wait for confirmation
      const receipt = await this.provider!.waitForTransaction(txHash);
      console.log('Transaction confirmed:', receipt?.hash);

      return { success: true };
    } catch (error) {
      console.error('Direct mint test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Alternative test function using different gas setting approach
  async testAlternativeMint(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing alternative minting approach...');
      console.log('Using contract address:', VIDEO_NFT_ADDRESS);
      
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected or contract not initialized');
      }

      // Get current fee data
      const feeData = await this.provider!.getFeeData();
      console.log('Current fee data:', feeData);

      // Create transaction with very high gas price using a different method
      const tx = await this.contract.mintVideo(
        'QmTestHash123456789',
        'QmThumbnailHash123',
        'Test Video',
        'Test Description',
        '0:00',
        false,
        {
          gasLimit: 1000000, // 1M gas
          gasPrice: ethers.parseUnits('200', 'gwei'), // 200 Gwei - extremely high
          type: 0 // Legacy transaction
        }
      );

      console.log('Alternative transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Alternative transaction confirmed:', receipt?.hash);

      return { success: true };
    } catch (error) {
      console.error('Alternative mint test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Test function using EIP-1559 with very high priority fee
  async testEIP1559Mint(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing EIP-1559 minting with high priority fee...');
      console.log('Using contract address:', VIDEO_NFT_ADDRESS);
      
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected or contract not initialized');
      }

      // Create transaction with EIP-1559 and very high priority fee
      const tx = await this.contract.mintVideo(
        'QmTestHash123456789',
        'QmThumbnailHash123',
        'Test Video',
        'Test Description',
        '0:00',
        false,
        {
          gasLimit: 1000000, // 1M gas
          maxFeePerGas: ethers.parseUnits('300', 'gwei'), // 300 Gwei max fee
          maxPriorityFeePerGas: ethers.parseUnits('100', 'gwei'), // 100 Gwei priority fee
          type: 2 // EIP-1559 transaction
        }
      );

      console.log('EIP-1559 transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('EIP-1559 transaction confirmed:', receipt?.hash);

      return { success: true };
    } catch (error) {
      console.error('EIP-1559 mint test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Diagnostic function to check network and contract status
  async runDiagnostics(): Promise<{ success: boolean; details: string[]; error?: string }> {
    const details: string[] = [];
    
    try {
      console.log('Running blockchain diagnostics...');
      
      // Check if we can initialize
      await this.initialize();
      details.push('✅ Blockchain service initialized');
      
      if (!this.provider || !this.signer) {
        throw new Error('Provider or signer not available');
      }
      
      // Check network
      const network = await this.provider.getNetwork();
      details.push(`✅ Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
      
      // Show network status without forcing a specific network
      if (network.chainId === BigInt(31337)) {
        details.push(`✅ Local Hardhat network - perfect for testing!`);
      } else if (network.chainId === BigInt(80002)) {
        details.push(`⚠️ Polygon Amoy network - may have high gas requirements`);
      } else if (network.chainId === BigInt(80001)) {
        details.push(`✅ Polygon Mumbai network - good for testing`);
      } else {
        details.push(`ℹ️ Network: ${network.name} (Chain ID: ${network.chainId})`);
      }
      
      // Check signer address
      const address = await this.signer.getAddress();
      details.push(`✅ Signer address: ${address}`);
      
      // Check balance
      const balance = await this.provider.getBalance(address);
      details.push(`✅ Balance: ${ethers.formatEther(balance)} MATIC`);
      
      // Check if contract exists
      const code = await this.provider.getCode(VIDEO_NFT_ADDRESS);
      if (code === '0x') {
        details.push(`❌ Contract not found at ${VIDEO_NFT_ADDRESS}`);
      } else {
        details.push(`✅ Contract found at ${VIDEO_NFT_ADDRESS}`);
      }
      
      // Check current gas price
      const feeData = await this.provider.getFeeData();
      details.push(`✅ Current gas price: ${feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') + ' Gwei' : 'Unknown'}`);
      
      if (feeData.maxFeePerGas) {
        details.push(`✅ Max fee per gas: ${ethers.formatUnits(feeData.maxFeePerGas, 'gwei')} Gwei`);
      }
      
      if (feeData.maxPriorityFeePerGas) {
        details.push(`✅ Max priority fee per gas: ${ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei')} Gwei`);
      }
      
      // Try to estimate gas for a simple transaction
      try {
        if (this.contract) {
          const gasEstimate = await this.contract.mintVideo.estimateGas(
            'QmTest',
            'QmThumbnail',
            'Test',
            'Test',
            '0:00',
            false
          );
          details.push(`✅ Gas estimation successful: ${gasEstimate.toString()} gas`);
        }
      } catch (gasError) {
        details.push(`❌ Gas estimation failed: ${gasError instanceof Error ? gasError.message : 'Unknown error'}`);
      }
      
      return { success: true, details };
      
    } catch (error) {
      console.error('Diagnostic error:', error);
      return {
        success: false,
        details,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Function to override MetaMask's gas settings using eth_sendTransaction
  async testMetaMaskOverride(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing MetaMask gas override...');
      
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected or contract not initialized');
      }

      // Get the signer's address
      const address = await this.signer.getAddress();
      console.log('Signer address:', address);

      // Get current nonce and convert to hex
      const nonce = await this.signer.getNonce();
      const nonceHex = '0x' + nonce.toString(16);
      console.log('Current nonce:', nonce, 'Hex:', nonceHex);

      // Create the transaction data
      const data = this.contract.interface.encodeFunctionData('mintVideo', [
        'QmTestHash123456789',
        'QmThumbnailHash123',
        'Test Video',
        'Test Description',
        '0:00',
        false
      ]);

      // Create transaction with explicit gas settings for MetaMask (all in hex)
      const transactionRequest = {
        to: VIDEO_NFT_ADDRESS,
        data: data,
        gas: '0x7a120', // 500,000 gas in hex
        gasPrice: '0x59682f400', // 150 Gwei in hex
        nonce: nonceHex, // Nonce in hex format
        from: address,
        value: '0x0'
      };

      console.log('Transaction request:', transactionRequest);

      // Try to send transaction directly through MetaMask
      const txHash = await this.provider!.send('eth_sendTransaction', [transactionRequest]);
      console.log('Transaction hash:', txHash);

      // Wait for confirmation
      const receipt = await this.provider!.waitForTransaction(txHash);
      console.log('Transaction confirmed:', receipt?.hash);

      return { success: true };
    } catch (error) {
      console.error('MetaMask override test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Function to try with even higher gas price
  async testUltraHighGas(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing with ultra high gas price...');
      
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected or contract not initialized');
      }

      // Create transaction with extremely high gas price
      const tx = await this.contract.mintVideo(
        'QmTestHash123456789',
        'QmThumbnailHash123',
        'Test Video',
        'Test Description',
        '0:00',
        false,
        {
          gasLimit: 1000000, // 1M gas
          gasPrice: ethers.parseUnits('500', 'gwei'), // 500 Gwei - extremely high
          type: 0 // Legacy transaction
        }
      );

      console.log('Ultra high gas transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Ultra high gas transaction confirmed:', receipt?.hash);

      return { success: true };
    } catch (error) {
      console.error('Ultra high gas test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Function that estimates gas first, then sends with custom gas price
  async testEstimateThenSend(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing estimate gas then send with custom price...');
      
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected or contract not initialized');
      }

      // Get the signer's address
      const address = await this.signer.getAddress();
      console.log('Signer address:', address);

      // Get current nonce and convert to hex
      const nonce = await this.signer.getNonce();
      const nonceHex = '0x' + nonce.toString(16);
      console.log('Current nonce:', nonce, 'Hex:', nonceHex);

      // Create the transaction data
      const data = this.contract.interface.encodeFunctionData('mintVideo', [
        'QmTestHash123456789',
        'QmThumbnailHash123',
        'Test Video',
        'Test Description',
        '0:00',
        false
      ]);

      // First, estimate gas using eth_estimateGas
      const estimateRequest = {
        to: VIDEO_NFT_ADDRESS,
        data: data,
        from: address,
        value: '0x0'
      };

      console.log('Estimating gas with:', estimateRequest);
      const estimatedGas = await this.provider!.send('eth_estimateGas', [estimateRequest]);
      console.log('Estimated gas:', estimatedGas);

      // Add 50% buffer to estimated gas
      const gasLimit = '0x' + (parseInt(estimatedGas, 16) * 1.5).toString(16);
      console.log('Gas limit with buffer:', gasLimit);

      // Create transaction with estimated gas and our custom gas price
      const transactionRequest = {
        to: VIDEO_NFT_ADDRESS,
        data: data,
        gas: gasLimit,
        gasPrice: '0x59682f400', // 150 Gwei in hex
        nonce: nonceHex,
        from: address,
        value: '0x0'
      };

      console.log('Transaction request:', transactionRequest);

      // Send transaction with our custom gas price
      const txHash = await this.provider!.send('eth_sendTransaction', [transactionRequest]);
      console.log('Transaction hash:', txHash);

      // Wait for confirmation
      const receipt = await this.provider!.waitForTransaction(txHash);
      console.log('Transaction confirmed:', receipt?.hash);

      return { success: true };
    } catch (error) {
      console.error('Estimate then send test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Function to try with even higher gas price (1000 Gwei)
  async testExtremeGas(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing with extreme gas price (1000 Gwei)...');
      
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected or contract not initialized');
      }

      // Create transaction with extremely high gas price
      const tx = await this.contract.mintVideo(
        'QmTestHash123456789',
        'QmThumbnailHash123',
        'Test Video',
        'Test Description',
        '0:00',
        false,
        {
          gasLimit: 1000000, // 1M gas
          gasPrice: ethers.parseUnits('1000', 'gwei'), // 1000 Gwei - extremely high
          type: 0 // Legacy transaction
        }
      );

      console.log('Extreme gas transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Extreme gas transaction confirmed:', receipt?.hash);

      return { success: true };
    } catch (error) {
      console.error('Extreme gas test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Function to test on Polygon
  async testPolygonMint(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing minting on current network...');
      
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected or contract not initialized');
      }

      // Check current network
      const network = await this.provider!.getNetwork();
      console.log('Current network:', network);

      // Get current fee data
      const feeData = await this.provider!.getFeeData();
      console.log('Fee data:', {
        gasPrice: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') + ' Gwei' : 'null',
        maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') + ' Gwei' : 'null',
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') + ' Gwei' : 'null'
      });

      // Try using EIP-1559 with high priority fee
      const tx = await this.contract.mintVideo(
        'QmTestHash123456789',
        'QmThumbnailHash123',
        'Test Video',
        'Test Description',
        '0:00',
        false,
        {
          gasLimit: 1000000, // 1M gas
          maxFeePerGas: ethers.parseUnits('500', 'gwei'), // 500 Gwei max fee
          maxPriorityFeePerGas: ethers.parseUnits('100', 'gwei'), // 100 Gwei priority fee
          type: 2 // EIP-1559 transaction
        }
      );

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt?.hash);

      return { success: true };
    } catch (error) {
      console.error('Mint test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Polygon legacy transaction approach
  async testPolygonLegacy(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing Polygon legacy transaction...');
      
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected or contract not initialized');
      }

      // For Polygon, try legacy transaction with high gas price
      const tx = await this.contract.mintVideo(
        'QmTestHash123456789',
        'QmThumbnailHash123',
        'Test Video',
        'Test Description',
        '0:00',
        false,
        {
          gasLimit: 1000000, // 1M gas
          gasPrice: ethers.parseUnits('150', 'gwei'), // 150 Gwei gas price
          type: 0 // Legacy transaction
        }
      );

      console.log('Polygon legacy transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Polygon legacy transaction confirmed:', receipt?.hash);

      return { success: true };
    } catch (error) {
      console.error('Polygon legacy test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Function to bypass MetaMask using a different approach
  async testBypassMetaMask(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing bypass MetaMask approach...');
      
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected or contract not initialized');
      }

      // Get the signer's address
      const address = await this.signer.getAddress();
      console.log('Signer address:', address);

      // Get current nonce and convert to hex
      const nonce = await this.signer.getNonce();
      const nonceHex = '0x' + nonce.toString(16);
      console.log('Current nonce:', nonce, 'Hex:', nonceHex);

      // Create the transaction data
      const data = this.contract.interface.encodeFunctionData('mintVideo', [
        'QmTestHash123456789',
        'QmThumbnailHash123',
        'Test Video',
        'Test Description',
        '0:00',
        false
      ]);

      // Try using a different approach - create transaction without gas settings first
      const txRequest = {
        to: VIDEO_NFT_ADDRESS,
        data: data,
        from: address,
        nonce: nonceHex,
        value: '0x0'
      };

      console.log('Transaction request:', txRequest);

      // Try to send with minimal settings and let MetaMask handle gas
      const txHash = await this.provider!.send('eth_sendTransaction', [txRequest]);
      console.log('Transaction hash:', txHash);

      // Wait for confirmation
      const receipt = await this.provider!.waitForTransaction(txHash);
      console.log('Transaction confirmed:', receipt?.hash);

      return { success: true };
    } catch (error) {
      console.error('Bypass MetaMask test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Function to test on Polygon Mumbai instead of Amoy
  async testMumbaiMint(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing minting on Polygon Mumbai...');
      
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected or contract not initialized');
      }

      // Check current network
      const network = await this.provider!.getNetwork();
      console.log('Current network:', network);
      
      if (network.chainId !== BigInt(80001)) {
        console.log('Not on Mumbai, attempting to switch...');
        // Try to switch to Mumbai
        try {
          await this.provider!.send('wallet_switchEthereumChain', [{ chainId: '0x13881' }]); // Mumbai chain ID
          console.log('Switched to Mumbai');
        } catch (switchError) {
          console.log('Could not switch to Mumbai:', switchError);
          return {
            success: false,
            error: 'Please manually switch to Polygon Mumbai in MetaMask'
          };
        }
      }

      // Get current fee data for Mumbai
      const feeData = await this.provider!.getFeeData();
      console.log('Mumbai fee data:', {
        gasPrice: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') + ' Gwei' : 'null',
        maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') + ' Gwei' : 'null',
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') + ' Gwei' : 'null'
      });

      // Try minting on Mumbai with standard gas settings
      const tx = await this.contract.mintVideo(
        'QmTestHash123456789',
        'QmThumbnailHash123',
        'Test Video',
        'Test Description',
        '0:00',
        false,
        {
          gasLimit: 1000000, // 1M gas
          gasPrice: ethers.parseUnits('50', 'gwei'), // 50 Gwei gas price
          type: 0 // Legacy transaction
        }
      );

      console.log('Mumbai transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Mumbai transaction confirmed:', receipt?.hash);

      return { success: true };
    } catch (error) {
      console.error('Mumbai mint test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Function to test on local hardhat network
  async testLocalNetwork(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing on local hardhat network...');
      
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected or contract not initialized');
      }

      // Check current network
      const network = await this.provider!.getNetwork();
      console.log('Current network:', network);
      
      if (network.chainId !== BigInt(31337)) {
        console.log('Not on local hardhat network, attempting to switch...');
        // Try to switch to local hardhat network
        try {
          await this.provider!.send('wallet_switchEthereumChain', [{ chainId: '0x7a69' }]); // Hardhat chain ID
          console.log('Switched to local hardhat network');
        } catch (switchError) {
          console.log('Could not switch to local hardhat network:', switchError);
          return {
            success: false,
            error: 'Please start local hardhat network and switch to it in MetaMask'
          };
        }
      }

      // Get current fee data for local network
      const feeData = await this.provider!.getFeeData();
      console.log('Local network fee data:', {
        gasPrice: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') + ' Gwei' : 'null',
        maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') + ' Gwei' : 'null',
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') + ' Gwei' : 'null'
      });

      // Try minting on local network with standard gas settings
      const tx = await this.contract.mintVideo(
        'QmTestHash123456789',
        'QmThumbnailHash123',
        'Test Video',
        'Test Description',
        '0:00',
        false,
        {
          gasLimit: 1000000, // 1M gas
          gasPrice: ethers.parseUnits('1', 'gwei'), // 1 Gwei gas price (very low for local)
          type: 0 // Legacy transaction
        }
      );

      console.log('Local network transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Local network transaction confirmed:', receipt?.hash);

      return { success: true };
    } catch (error) {
      console.error('Local network mint test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Function to try with extremely high gas price
  async testAmoyExtreme(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Testing with extremely high gas price...');
      
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected or contract not initialized');
      }

      // Check current network
      const network = await this.provider!.getNetwork();
      console.log('Current network:', network);

      // Try with extremely high gas price
      const tx = await this.contract.mintVideo(
        'QmTestHash123456789',
        'QmThumbnailHash123',
        'Test Video',
        'Test Description',
        '0:00',
        false,
        {
          gasLimit: 2000000, // 2M gas
          gasPrice: ethers.parseUnits('2000', 'gwei'), // 2000 Gwei - extremely high
          type: 0 // Legacy transaction
        }
      );

      console.log('Extreme gas transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Extreme gas transaction confirmed:', receipt?.hash);

      return { success: true };
    } catch (error) {
      console.error('Extreme gas test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Method to check current network status
  async getCurrentNetwork(): Promise<{ chainId: number; name: string; isLocal: boolean }> {
    try {
      const provider = await this.getProvider();
      const network = await provider.getNetwork();
      
      return {
        chainId: Number(network.chainId),
        name: network.name || 'Unknown',
        isLocal: network.chainId === BigInt(31337)
      };
    } catch (error) {
      console.error('Failed to get current network:', error);
      return {
        chainId: 0,
        name: 'Unknown',
        isLocal: false
      };
    }
  }

  // Method to check if local Hardhat node is running
  async checkLocalNode(): Promise<{ isRunning: boolean; error?: string }> {
    try {
      console.log('🔍 Checking if local Hardhat node is running...');
      
      // Try to connect to local Hardhat node
      const localProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      
      // Try to get the latest block
      const blockNumber = await localProvider.getBlockNumber();
      console.log('✅ Local Hardhat node is running, latest block:', blockNumber);
      
      return { isRunning: true };
    } catch (error) {
      console.error('❌ Local Hardhat node is not accessible:', error);
      return {
        isRunning: false,
        error: error instanceof Error ? error.message : 'Local node not accessible'
      };
    }
  }

  // Method to help users switch to local Hardhat network
  async switchToLocalNetwork(): Promise<{ success: boolean; error?: string }> {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        console.log('🔄 Switching to local Hardhat network...');
        
        // Check current network first
        const currentProvider = new ethers.BrowserProvider(window.ethereum);
        const currentNetwork = await currentProvider.getNetwork();
        console.log('📋 Current network before switch:', currentNetwork);
        
        // Add local Hardhat network to MetaMask
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x7A69', // 31337 in hex
              chainName: 'Hardhat Local',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['http://127.0.0.1:8545'],
              blockExplorerUrls: []
            }]
          });
          console.log('✅ Local network added to MetaMask');
        } catch (addError: any) {
          // Network might already exist, that's okay
          if (addError.code !== 4902) {
            console.log('⚠️ Network add warning:', addError.message);
          }
        }

        // Switch to local network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7A69' }]
        });
        console.log('✅ Switched to local network');

        // Wait a moment for the switch to complete
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Re-initialize with local network
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        
        // Verify we're on the correct network
        const network = await this.provider.getNetwork();
        console.log('📋 Current network after switch:', network);
        
        if (network.chainId !== BigInt(31337)) {
          throw new Error(`Failed to switch to local network. Current chain ID: ${network.chainId}, expected: 31337`);
        }
        
        console.log('✅ Successfully connected to local Hardhat network');
        return { success: true };
      } else {
        throw new Error('No wallet detected');
      }
    } catch (error) {
      console.error('❌ Failed to switch to local network:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to switch to local network'
      };
    }
  }

  // Helper methods
  private async getProvider(): Promise<ethers.BrowserProvider> {
    if (!this.provider) {
      await this.initialize();
    }
    return this.provider!;
  }

  private async getSigner(): Promise<ethers.JsonRpcSigner> {
    if (!this.signer) {
      await this.initialize();
    }
    return this.signer!;
  }

  private getVideoNFTContract(signer: ethers.JsonRpcSigner): ethers.Contract {
    return new ethers.Contract(VIDEO_NFT_ADDRESS, VIDEO_NFT_ABI, signer);
  }

  // Method to mint on local network with simple gas settings
  async mintOnLocalNetwork(
    videoData: VideoData,
    onProgress?: (message: string) => void
  ): Promise<string> {
    try {
      console.log('🚀 Starting local network mint...');
      onProgress?.('Connecting to local network...');
      
      const provider = await this.getProvider();
      const signer = await this.getSigner();
      
      if (!signer) {
        throw new Error('No signer available');
      }

      // Check if we're on local network
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(31337)) {
        throw new Error('Not on local Hardhat network. Please switch to local network first.');
      }

      // Verify contract is deployed on current network
      onProgress?.('Verifying contract deployment...');
      const contractVerification = await this.verifyContractOnNetwork();
      if (!contractVerification.isDeployed) {
        throw new Error(`Contract verification failed: ${contractVerification.error}`);
      }

      onProgress?.('Getting contract instance...');
      const contract = this.getVideoNFTContract(signer);
      
      onProgress?.('Preparing transaction...');
      const {
        videoHash,
        thumbnailHash,
        title,
        description,
        duration,
        isShortForm = false
      } = videoData;

      console.log('📝 Local transaction parameters:', {
        videoHash,
        thumbnailHash,
        title,
        description,
        duration,
        isShortForm
      });

      // Use very simple gas settings for local network
      const tx = await contract.mintVideo(
        videoHash,
        thumbnailHash,
        title,
        description,
        duration,
        isShortForm,
        {
          gasLimit: 1000000, // 1M gas limit
          gasPrice: ethers.parseUnits('1', 'gwei'), // 1 Gwei - very low for local
        }
      );

      console.log('✅ Local transaction sent:', tx.hash);
      onProgress?.('Transaction sent! Waiting for confirmation...');
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        console.log('🎉 Local transaction confirmed!');
        onProgress?.('Transaction confirmed!');
        return receipt.transactionHash;
      } else {
        throw new Error('Local transaction failed');
      }

    } catch (error: any) {
      console.error('💥 Local mint error:', error);
      throw new Error(`Failed to mint on local network: ${error.message}`);
    }
  }

  // Method to verify contract is deployed on current network
  async verifyContractOnNetwork(): Promise<{ isDeployed: boolean; error?: string }> {
    try {
      console.log('🔍 Verifying contract on current network...');
      
      const provider = await this.getProvider();
      const network = await provider.getNetwork();
      console.log('📋 Current network:', network);
      
      // Check if contract exists at the address
      const code = await provider.getCode(VIDEO_NFT_ADDRESS);
      console.log('📄 Contract code length:', code.length);
      
      if (code === '0x' || code === '0x0') {
        return {
          isDeployed: false,
          error: `Contract not found at ${VIDEO_NFT_ADDRESS} on network ${network.name} (Chain ID: ${network.chainId})`
        };
      }
      
      console.log('✅ Contract is deployed on current network');
      return { isDeployed: true };
    } catch (error) {
      console.error('❌ Contract verification failed:', error);
      return {
        isDeployed: false,
        error: error instanceof Error ? error.message : 'Contract verification failed'
      };
    }
  }

  // Test basic MetaMask connection and transaction
  async testBasicConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔍 Testing basic MetaMask connection...');
      
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not detected');
      }

      // Test basic connection
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      console.log('✅ Connected to MetaMask, address:', address);

      // Test network
      const network = await provider.getNetwork();
      console.log('✅ Network:', network);

      // Test balance
      const balance = await provider.getBalance(address);
      console.log('✅ Balance:', ethers.formatEther(balance), 'ETH');

      // Test contract existence
      const code = await provider.getCode(VIDEO_NFT_ADDRESS);
      console.log('✅ Contract code length:', code.length);

      if (code === '0x' || code === '0x0') {
        throw new Error(`Contract not found at ${VIDEO_NFT_ADDRESS}`);
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Basic connection test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Very simple mint method that lets MetaMask handle everything
  async simpleMint(): Promise<string> {
    try {
      console.log('🚀 Starting simple mint...');
      
      const provider = await this.getProvider();
      const signer = await this.getSigner();
      
      if (!signer) {
        throw new Error('No signer available');
      }

      // Check if we're on local network
      const network = await provider.getNetwork();
      console.log('📋 Current network:', network);
      
      if (network.chainId !== BigInt(31337)) {
        throw new Error('Not on local Hardhat network. Please switch to local network first.');
      }

      // Verify contract is deployed
      const code = await provider.getCode(VIDEO_NFT_ADDRESS);
      if (code === '0x' || code === '0x0') {
        throw new Error(`Contract not found at ${VIDEO_NFT_ADDRESS}`);
      }

      console.log('✅ Contract verified, creating transaction...');
      
      const contract = this.getVideoNFTContract(signer);
      
      // Use the simplest possible transaction - let MetaMask handle everything
      const tx = await contract.mintVideo(
        'QmTestHash123456789',
        'QmThumbnailHash123',
        'Test Video',
        'Test Description',
        '0:00',
        false
        // No gas settings - let MetaMask handle it
      );

      console.log('✅ Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        console.log('🎉 Transaction confirmed!');
        return receipt.transactionHash;
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: any) {
      console.error('💥 Simple mint error:', error);
      throw new Error(`Failed to mint: ${error.message}`);
    }
  }

  // Bulletproof minting method following Polygon documentation
  async bulletproofMint(
    videoData: VideoData,
    onProgress?: (message: string) => void
  ): Promise<string> {
    try {
      console.log('🚀 Starting bulletproof mint...');
      onProgress?.('Initializing bulletproof mint...');
      
      // Step 1: Get provider and signer
      const provider = await this.getProvider();
      const signer = await this.getSigner();
      
      if (!signer) {
        throw new Error('No signer available');
      }

      // Step 2: Get current network and verify
      const network = await provider.getNetwork();
      console.log('📋 Current network:', network);
      onProgress?.(`Connected to ${network.name} (Chain ID: ${network.chainId})`);

      // Step 3: Switch MetaMask to correct network if needed
      if (network.chainId !== BigInt(31337)) {
        onProgress?.('Switching MetaMask to local network...');
        const switchResult = await this.switchMetaMaskNetwork();
        if (!switchResult.success) {
          throw new Error(`Failed to switch network: ${switchResult.error}`);
        }
        onProgress?.('Successfully switched to local network');
        
        // Wait a moment for the switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the updated network
        const updatedNetwork = await provider.getNetwork();
        console.log('📋 Updated network:', updatedNetwork);
      }

      // Step 4: Get signer address and balance
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      console.log('💰 Balance:', ethers.formatEther(balance), 'ETH');
      onProgress?.(`Wallet balance: ${ethers.formatEther(balance)} ETH`);

      if (balance === BigInt(0)) {
        throw new Error('Insufficient balance for gas fees');
      }

      // Step 5: Verify contract deployment
      onProgress?.('Verifying contract deployment...');
      const code = await provider.getCode(VIDEO_NFT_ADDRESS);
      if (code === '0x' || code === '0x0') {
        throw new Error(`Contract not deployed at ${VIDEO_NFT_ADDRESS} on network ${network.name}`);
      }
      console.log('✅ Contract verified');

      // Step 6: Get current fee data
      onProgress?.('Getting current gas prices...');
      const feeData = await provider.getFeeData();
      console.log('📊 Fee data:', {
        gasPrice: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') + ' Gwei' : 'null',
        maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') + ' Gwei' : 'null',
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') + ' Gwei' : 'null'
      });

      // Step 7: Prepare transaction data
      onProgress?.('Preparing transaction...');
      const {
        videoHash,
        thumbnailHash,
        title,
        description,
        duration,
        isShortForm = false
      } = videoData;

      const contract = this.getVideoNFTContract(signer);

      // Step 8: Estimate gas first
      onProgress?.('Estimating gas...');
      let gasEstimate;
      try {
        gasEstimate = await contract.mintVideo.estimateGas(
          videoHash,
          thumbnailHash,
          title,
          description,
          duration,
          isShortForm
        );
        console.log('✅ Gas estimate:', gasEstimate.toString());
        onProgress?.(`Gas estimate: ${gasEstimate.toString()}`);
      } catch (gasError) {
        console.warn('⚠️ Gas estimation failed, using fallback:', gasError);
        gasEstimate = BigInt(1000000); // 1M gas fallback
        onProgress?.('Using fallback gas limit: 1,000,000');
      }

      // Step 9: Calculate optimal gas settings based on network
      let txOptions: any = {
        gasLimit: gasEstimate * BigInt(120) / BigInt(100) // Add 20% buffer
      };

      if (network.chainId === BigInt(31337)) {
        // Local Hardhat network - use simple settings
        txOptions.gasPrice = ethers.parseUnits('1', 'gwei');
        console.log('🔧 Using local network settings');
      } else if (network.chainId === BigInt(80002)) {
        // Polygon Amoy - use EIP-1559 with high priority fee
        const baseFee = ethers.parseUnits('50', 'gwei'); // Use fixed base fee for Amoy
        const priorityFee = ethers.parseUnits('50', 'gwei'); // 50 Gwei priority fee
        const maxFeePerGas = baseFee * BigInt(2) + priorityFee; // 2x base fee + priority
        
        txOptions.maxFeePerGas = maxFeePerGas;
        txOptions.maxPriorityFeePerGas = priorityFee;
        txOptions.type = 2; // EIP-1559
        console.log('🔧 Using Polygon Amoy EIP-1559 settings');
      } else if (network.chainId === BigInt(80001)) {
        // Polygon Mumbai - use moderate settings
        txOptions.gasPrice = ethers.parseUnits('50', 'gwei');
        console.log('🔧 Using Polygon Mumbai settings');
      } else {
        // Other networks - use current gas price with buffer
        const currentGasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei');
        txOptions.gasPrice = currentGasPrice * BigInt(120) / BigInt(100); // 20% buffer
        console.log('🔧 Using default network settings');
      }

      console.log('📝 Transaction options:', txOptions);
      onProgress?.('Transaction prepared with optimal gas settings');

      // Step 10: Send transaction
      onProgress?.('Sending transaction...');
      const tx = await contract.mintVideo(
        videoHash,
        thumbnailHash,
        title,
        description,
        duration,
        isShortForm,
        txOptions
      );

      console.log('✅ Transaction sent:', tx.hash);
      onProgress?.(`Transaction sent! Hash: ${tx.hash}`);

      // Step 11: Wait for confirmation
      onProgress?.('Waiting for confirmation...');
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        console.log('🎉 Transaction confirmed!');
        onProgress?.('Transaction confirmed successfully!');
        
        // Step 12: Get transaction details
        const gasUsed = receipt.gasUsed;
        const effectiveGasPrice = receipt.effectiveGasPrice;
        const totalCost = gasUsed * effectiveGasPrice;
        
        console.log('📊 Transaction details:', {
          gasUsed: gasUsed.toString(),
          effectiveGasPrice: ethers.formatUnits(effectiveGasPrice, 'gwei') + ' Gwei',
          totalCost: ethers.formatEther(totalCost) + ' ETH'
        });
        
        onProgress?.(`Gas used: ${gasUsed.toString()}, Cost: ${ethers.formatEther(totalCost)} ETH`);
        
        return receipt.transactionHash;
      } else {
        throw new Error('Transaction failed - status 0');
      }

    } catch (error: any) {
      console.error('💥 Bulletproof mint error:', error);
      
      // Provide specific error messages
      let errorMessage = error.message;
      
      if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was rejected by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient balance for gas fees. Please add more ETH/MATIC to your wallet.';
      } else if (error.message.includes('gas price below minimum')) {
        errorMessage = 'Gas price too low for this network. Please try again.';
      } else if (error.message.includes('nonce too low')) {
        errorMessage = 'Transaction nonce issue. Please refresh and try again.';
      } else if (error.message.includes('replacement transaction underpriced')) {
        errorMessage = 'Transaction replacement issue. Please wait and try again.';
      }
      
      throw new Error(`Bulletproof mint failed: ${errorMessage}`);
    }
  }

  // Switch MetaMask to the correct network
  async switchMetaMaskNetwork(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔄 Switching MetaMask network...');
      
      const provider = await this.getProvider();
      const network = await provider.getNetwork();
      
      // Get the target network configuration
      let targetNetwork;
      if (network.chainId === BigInt(31337)) {
        // Already on local network
        return { success: true };
      } else {
        // Switch to local Hardhat network
        targetNetwork = {
          chainId: '0x7A69', // 31337 in hex
          chainName: 'Hardhat Local',
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['http://127.0.0.1:8545'],
          blockExplorerUrls: []
        };
      }

      // Try to switch network using MetaMask's wallet_switchChain
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchChain',
          params: [{ chainId: targetNetwork.chainId }]
        });
        console.log('✅ Successfully switched to target network');
        return { success: true };
      } catch (switchError: any) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          console.log('📝 Adding network to MetaMask...');
          try {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [targetNetwork]
            });
            console.log('✅ Successfully added and switched to target network');
            return { success: true };
          } catch (addError: any) {
            console.error('❌ Failed to add network:', addError);
            return { 
              success: false, 
              error: `Failed to add network to MetaMask: ${addError.message}` 
            };
          }
        } else {
          console.error('❌ Failed to switch network:', switchError);
          return { 
            success: false, 
            error: `Failed to switch network: ${switchError.message}` 
          };
        }
      }
    } catch (error: any) {
      console.error('💥 Network switching error:', error);
      return { 
        success: false, 
        error: `Network switching failed: ${error.message}` 
      };
    }
  }

  // Test contract connection and basic functions
  async testContractConnection(): Promise<{ success: boolean; details: string[]; error?: string }> {
    const details: string[] = [];
    
    try {
      details.push('🔍 Testing contract connection...');
      
      if (!this.contract) {
        await this.initialize();
      }

      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      details.push('✅ Contract initialized successfully');

      // Test basic contract functions
      try {
        const totalSupply = await this.contract.totalSupply();
        details.push(`📊 Total supply: ${totalSupply.toString()}`);
      } catch (error) {
        details.push(`⚠️ Total supply check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test getRecentVideos
      try {
        const recentVideos = await this.contract.getRecentVideos(5);
        details.push(`📹 Recent videos: ${recentVideos.length} found`);
        
        if (recentVideos.length > 0) {
          details.push(`📋 Video IDs: ${recentVideos.map((id: bigint) => id.toString()).join(', ')}`);
          
          // Test getting a specific video
          try {
            const video = await this.getVideo(recentVideos[0].toString());
            if (video) {
              details.push(`✅ Video data retrieved: ${video.title}`);
            } else {
              details.push('⚠️ Video data retrieval failed');
            }
          } catch (error) {
            details.push(`⚠️ Video data retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } catch (error) {
        details.push(`⚠️ getRecentVideos failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test contract address
      const code = await this.provider?.getCode(VIDEO_NFT_ADDRESS);
      if (code && code !== '0x') {
        details.push(`✅ Contract deployed at: ${VIDEO_NFT_ADDRESS}`);
      } else {
        details.push(`❌ No contract found at: ${VIDEO_NFT_ADDRESS}`);
      }

      return { success: true, details };
    } catch (error) {
      details.push(`❌ Contract test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, details, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const blockchainService = new BlockchainService(); 