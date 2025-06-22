import { ethers } from 'ethers';

// CreatorToken Contract ABI
const CREATOR_TOKEN_ABI = [
  'function registerCreator(string memory name, string memory symbol, string memory description, string memory avatarHash) external returns (uint256)',
  'function buyCreatorTokens(address creator, uint256 amount) external payable',
  'function sellCreatorTokens(address creator, uint256 amount) external',
  'function updateCreatorMetrics(address creator, uint256 views, uint256 likes, uint256 revenue) external',
  'function getCreator(address creator) external view returns (uint256 creatorId, address creatorAddress, string memory name, string memory symbol, string memory description, string memory avatarHash, uint256 totalSupply, uint256 circulatingSupply, uint256 marketCap, uint256 totalRevenue, uint256 totalViews, uint256 totalLikes, uint256 tokenPrice, uint256 lastPriceUpdate, uint256 growthRate, uint256 investorCount, bool isActive, uint256 createdAt)',
  'function getInvestor(address creator, address investor) external view returns (uint256 tokenBalance, uint256 totalInvested, uint256 averageBuyPrice, uint256 lastInvestment, uint256 profitLoss, bool isInvestor)',
  'function getMarketData(address creator) external view returns (uint256 currentPrice, uint256 priceChange24h, uint256 volume24h, uint256 marketCap, uint256 growthRate, uint256 estimatedGrowth, uint256 investorCount, uint256 totalRevenue, uint256 revenueGrowth)',
  'function calculateTokenCost(address creator, uint256 amount) external view returns (uint256)',
  'function calculateTokenValue(address creator, uint256 amount) external view returns (uint256)',
  'function getTokenPrice(address creator) external view returns (uint256)',
  'function isCreator(address creator) external view returns (bool)',
  'function isInvestor(address creator, address investor) external view returns (bool)',
  'event CreatorRegistered(uint256 indexed creatorId, address indexed creatorAddress, string name, string symbol)',
  'event TokensMinted(address indexed creator, address indexed investor, uint256 amount, uint256 price)',
  'event TokensBurned(address indexed creator, address indexed investor, uint256 amount, uint256 price)',
  'event MarketDataUpdated(address indexed creator, uint256 price, uint256 marketCap, uint256 growthRate)',
  'event RevenueDistributed(address indexed creator, uint256 amount)'
];

// Contract address
const CREATOR_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CREATOR_TOKEN_ADDRESS || '0x1234567890123456789012345678901234567890';

export interface CreatorData {
  creatorId: string;
  creatorAddress: string;
  name: string;
  symbol: string;
  description: string;
  avatarHash: string;
  totalSupply: number;
  circulatingSupply: number;
  marketCap: number;
  totalRevenue: number;
  totalViews: number;
  totalLikes: number;
  tokenPrice: number;
  lastPriceUpdate: number;
  growthRate: number;
  investorCount: number;
  isActive: boolean;
  createdAt: number;
}

export interface InvestorData {
  tokenBalance: number;
  totalInvested: number;
  averageBuyPrice: number;
  lastInvestment: number;
  profitLoss: number;
  isInvestor: boolean;
}

export interface MarketData {
  currentPrice: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  growthRate: number;
  estimatedGrowth: number;
  investorCount: number;
  totalRevenue: number;
  revenueGrowth: number;
}

export interface CreatorTokenInfo {
  creator: CreatorData;
  marketData: MarketData;
  investorData?: InvestorData;
  isCreator: boolean;
  isInvestor: boolean;
}

class CreatorTokenService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;

  async initialize() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        this.contract = new ethers.Contract(CREATOR_TOKEN_ADDRESS, CREATOR_TOKEN_ABI, this.signer);
      } catch (error) {
        console.error('Failed to initialize creator token service:', error);
      }
    }
  }

  async registerCreator(
    name: string,
    symbol: string,
    description: string,
    avatarHash: string
  ): Promise<boolean> {
    try {
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected');
      }

      const tx = await this.contract.registerCreator(name, symbol, description, avatarHash);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Failed to register creator:', error);
      return false;
    }
  }

  async buyCreatorTokens(creatorAddress: string, amount: number): Promise<boolean> {
    try {
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected');
      }

      const cost = await this.contract.calculateTokenCost(creatorAddress, amount);
      const tx = await this.contract.buyCreatorTokens(creatorAddress, amount, { value: cost });
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Failed to buy creator tokens:', error);
      return false;
    }
  }

  async sellCreatorTokens(creatorAddress: string, amount: number): Promise<boolean> {
    try {
      await this.initialize();

      if (!this.contract || !this.signer) {
        throw new Error('Wallet not connected');
      }

      const tx = await this.contract.sellCreatorTokens(creatorAddress, amount);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Failed to sell creator tokens:', error);
      return false;
    }
  }

  async getCreatorTokenInfo(creatorAddress: string, investorAddress?: string): Promise<CreatorTokenInfo | null> {
    try {
      await this.initialize();

      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const [creator, marketData, isCreator, isInvestor] = await Promise.all([
        this.contract.getCreator(creatorAddress),
        this.contract.getMarketData(creatorAddress),
        this.contract.isCreator(creatorAddress),
        investorAddress ? this.contract.isInvestor(creatorAddress, investorAddress) : false
      ]);

      let investorData: InvestorData | undefined;
      if (investorAddress) {
        const investor = await this.contract.getInvestor(creatorAddress, investorAddress);
        investorData = {
          tokenBalance: Number(ethers.formatEther(investor.tokenBalance)),
          totalInvested: Number(ethers.formatEther(investor.totalInvested)),
          averageBuyPrice: Number(ethers.formatEther(investor.averageBuyPrice)),
          lastInvestment: Number(investor.lastInvestment),
          profitLoss: Number(ethers.formatEther(investor.profitLoss)),
          isInvestor: investor.isInvestor
        };
      }

      return {
        creator: {
          creatorId: creator.creatorId.toString(),
          creatorAddress: creator.creatorAddress,
          name: creator.name,
          symbol: creator.symbol,
          description: creator.description,
          avatarHash: creator.avatarHash,
          totalSupply: Number(ethers.formatEther(creator.totalSupply)),
          circulatingSupply: Number(ethers.formatEther(creator.circulatingSupply)),
          marketCap: Number(ethers.formatEther(creator.marketCap)),
          totalRevenue: Number(ethers.formatEther(creator.totalRevenue)),
          totalViews: Number(creator.totalViews),
          totalLikes: Number(creator.totalLikes),
          tokenPrice: Number(ethers.formatEther(creator.tokenPrice)),
          lastPriceUpdate: Number(creator.lastPriceUpdate),
          growthRate: Number(creator.growthRate),
          investorCount: Number(creator.investorCount),
          isActive: creator.isActive,
          createdAt: Number(creator.createdAt)
        },
        marketData: {
          currentPrice: Number(ethers.formatEther(marketData.currentPrice)),
          priceChange24h: Number(marketData.priceChange24h),
          volume24h: Number(ethers.formatEther(marketData.volume24h)),
          marketCap: Number(ethers.formatEther(marketData.marketCap)),
          growthRate: Number(marketData.growthRate),
          estimatedGrowth: Number(marketData.estimatedGrowth),
          investorCount: Number(marketData.investorCount),
          totalRevenue: Number(ethers.formatEther(marketData.totalRevenue)),
          revenueGrowth: Number(marketData.revenueGrowth)
        },
        investorData,
        isCreator,
        isInvestor
      };
    } catch (error) {
      console.error('Failed to get creator token info:', error);
      return null;
    }
  }

  async calculateTokenCost(creatorAddress: string, amount: number): Promise<number> {
    try {
      await this.initialize();

      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const cost = await this.contract.calculateTokenCost(creatorAddress, ethers.parseEther(amount.toString()));
      return Number(ethers.formatEther(cost));
    } catch (error) {
      console.error('Failed to calculate token cost:', error);
      return 0;
    }
  }

  async calculateTokenValue(creatorAddress: string, amount: number): Promise<number> {
    try {
      await this.initialize();

      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const value = await this.contract.calculateTokenValue(creatorAddress, ethers.parseEther(amount.toString()));
      return Number(ethers.formatEther(value));
    } catch (error) {
      console.error('Failed to calculate token value:', error);
      return 0;
    }
  }

  async getTokenPrice(creatorAddress: string): Promise<number> {
    try {
      await this.initialize();

      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const price = await this.contract.getTokenPrice(creatorAddress);
      return Number(ethers.formatEther(price));
    } catch (error) {
      console.error('Failed to get token price:', error);
      return 0;
    }
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

  formatPrice(price: number): string {
    if (price >= 1) {
      return `${price.toFixed(4)} ETH`;
    } else if (price >= 0.001) {
      return `${(price * 1000).toFixed(2)} mETH`;
    } else {
      return `${(price * 1000000).toFixed(2)} μETH`;
    }
  }

  formatMarketCap(marketCap: number): string {
    if (marketCap >= 1000000) {
      return `${(marketCap / 1000000).toFixed(2)}M ETH`;
    } else if (marketCap >= 1000) {
      return `${(marketCap / 1000).toFixed(2)}K ETH`;
    } else {
      return `${marketCap.toFixed(2)} ETH`;
    }
  }

  formatGrowthRate(rate: number): string {
    return `${rate.toFixed(2)}%`;
  }

  getGrowthColor(rate: number): string {
    if (rate > 0) return 'text-green-600';
    if (rate < 0) return 'text-red-600';
    return 'text-gray-600';
  }
}

export const creatorTokenService = new CreatorTokenService(); 