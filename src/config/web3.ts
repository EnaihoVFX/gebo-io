import { createConfig, http } from 'wagmi';
import { metaMask, walletConnect } from 'wagmi/connectors';
import { polygon, polygonAmoy } from 'wagmi/chains';

// Configure supported chains
const chains = [
  polygon,
  polygonAmoy,
  {
    id: 31337,
    name: 'Polygon Local',
    network: 'polygon-local',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ['http://127.0.0.1:8545'] },
      public: { http: ['http://127.0.0.1:8545'] },
    },
    blockExplorers: {
      default: { name: 'Local', url: 'http://127.0.0.1:8545' },
    },
  },
] as const;

// Create wagmi config with conditional WalletConnect
const connectors = [
  metaMask(),
];

// Only add WalletConnect if we're in the browser and have a project ID
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
  try {
    connectors.push(
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      })
    );
  } catch (error) {
    // Silently handle WalletConnect errors
  }
}

// Create wagmi config
export const config = createConfig({
  chains,
  connectors,
  transports: {
    [polygon.id]: http('https://polygon-rpc.com'),
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology'),
    [31337]: http('http://127.0.0.1:8545'), // Local
  },
});

// Contract addresses
export const CONTRACT_ADDRESSES: Record<number, string> = {
  [polygon.id]: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x06049d835bac69e7751cad2c9ab1aa88808fc1b3',
  [polygonAmoy.id]: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MUMBAI || '0x1234567890123456789012345678901234567890',
  31337: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x06049d835bac69e7751cad2c9ab1aa88808fc1b3', // Local hardhat
};

// Video NFT contract addresses
export const VIDEO_NFT_ADDRESSES: Record<number, string> = {
  [polygon.id]: process.env.NEXT_PUBLIC_VIDEO_NFT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  [polygonAmoy.id]: process.env.NEXT_PUBLIC_VIDEO_NFT_ADDRESS_MUMBAI || '0x1234567890123456789012345678901234567890',
  31337: process.env.NEXT_PUBLIC_VIDEO_NFT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // Local hardhat
};

// Creator Token contract addresses
export const CREATOR_TOKEN_ADDRESSES: Record<number, string> = {
  [polygon.id]: process.env.NEXT_PUBLIC_CREATOR_TOKEN_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  [polygonAmoy.id]: process.env.NEXT_PUBLIC_CREATOR_TOKEN_ADDRESS_MUMBAI || '0x1234567890123456789012345678901234567890',
  31337: process.env.NEXT_PUBLIC_CREATOR_TOKEN_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', // Local hardhat
};

// Utility functions
export const getContractAddress = (chainId: number) => {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[31337];
};

export const getVideoNFTAddress = (chainId: number) => {
  return VIDEO_NFT_ADDRESSES[chainId] || VIDEO_NFT_ADDRESSES[31337];
};

export const getCreatorTokenAddress = (chainId: number) => {
  return CREATOR_TOKEN_ADDRESSES[chainId] || CREATOR_TOKEN_ADDRESSES[31337];
};

// Network information
export const getNetworkInfo = (chainId: number) => {
  const chain = chains.find((chain: any) => chain.id === chainId);
  return {
    name: chain?.name || 'Unknown Network',
    currency: chain?.nativeCurrency?.symbol || 'ETH',
    explorer: chain?.blockExplorers?.default?.url || '',
  };
};

// Check if chain is supported
export const isChainSupported = (chainId: number) => {
  return chains.some((chain: any) => chain.id === chainId);
};

// Get default chain
export const getDefaultChain = () => {
  return chains[2]; // Polygon Local
};

// VideoNFT Contract ABI
export const VIDEO_NFT_ABI = [
  'function mint(string memory tokenURI) public returns (uint256)',
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
  'function ownerOf(uint256 tokenId) public view returns (address)',
  'function balanceOf(address owner) public view returns (uint256)',
  'function transferFrom(address from, address to, uint256 tokenId) public',
  'function approve(address to, uint256 tokenId) public',
  'function getApproved(uint256 tokenId) public view returns (address)',
  'function setApprovalForAll(address operator, bool approved) public',
  'function isApprovedForAll(address owner, address operator) public view returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)'
];

// CreatorToken Contract ABI
export const CREATOR_TOKEN_ABI = [
  'function name() public view returns (string memory)',
  'function symbol() public view returns (string memory)',
  'function decimals() public view returns (uint8)',
  'function totalSupply() public view returns (uint256)',
  'function balanceOf(address account) public view returns (uint256)',
  'function transfer(address to, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) public returns (bool)',
  'function mint(address to, uint256 amount) public',
  'function burn(uint256 amount) public',
  'function sellTokens(uint256 amount) public',
  'function buyTokens() public payable',
  'function getTokenPrice() public view returns (uint256)',
  'function getCreatorRevenue() public view returns (uint256)',
  'function withdrawRevenue() public',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event TokensSold(address indexed tokenAddress, address indexed seller, uint256 amount, uint256 revenue)'
]; 