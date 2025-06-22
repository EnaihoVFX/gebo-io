import { polygon, polygonZkEvm, polygonZkEvmTestnet } from 'viem/chains';
import { defineChain } from 'viem';
import { polygonAmoy } from 'wagmi/chains';

// Local Hardhat network configuration
export const localHardhat = defineChain({
  id: 31337,
  name: 'Hardhat Local',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Local',
      url: '',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1,
    },
  },
});

// Polygon Superchain configuration
export const polygonSuperchain = {
  // Mainnet chains
  polygon: polygon,
  polygonZkEvm: polygonZkEvm,
  
  // Testnet chains
  polygonAmoy: defineChain({
    id: 80002,
    name: 'Polygon Amoy',
    network: 'amoy',
    nativeCurrency: {
      decimals: 18,
      name: 'MATIC',
      symbol: 'MATIC',
    },
    rpcUrls: {
      default: {
        http: [
          'https://rpc-amoy.polygon.technology',
          'https://polygon-amoy-bor-rpc.publicnode.com',
          'https://polygon-amoy.drpc.org'
        ],
      },
      public: {
        http: [
          'https://rpc-amoy.polygon.technology',
          'https://polygon-amoy-bor-rpc.publicnode.com',
          'https://polygon-amoy.drpc.org'
        ],
      },
    },
    blockExplorers: {
      default: {
        name: 'PolygonScan',
        url: 'https://www.oklink.com/amoy',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 1,
      },
    },
  }),
  polygonMumbai: defineChain({
    id: 80001,
    name: 'Polygon Mumbai',
    network: 'mumbai',
    nativeCurrency: {
      decimals: 18,
      name: 'MATIC',
      symbol: 'MATIC',
    },
    rpcUrls: {
      default: {
        http: ['https://rpc-mumbai.maticvigil.com'],
      },
      public: {
        http: ['https://rpc-mumbai.maticvigil.com'],
      },
    },
    blockExplorers: {
      default: {
        name: 'PolygonScan',
        url: 'https://mumbai.polygonscan.com',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 25770160,
      },
    },
  }),
  polygonZkEvmTestnet: polygonZkEvmTestnet,
};

// Function to get the appropriate default chain based on environment
export function getDefaultChain() {
  // Check if we're in development and local Hardhat is available
  if (typeof window !== 'undefined' && window.ethereum) {
    // Try to detect if we're on local network
    const currentChainId = window.ethereum.chainId;
    if (currentChainId === '0x7A69' || currentChainId === '31337') {
      return localHardhat;
    }
  }
  
  // Default to Amoy for production or when local is not available
  return polygonSuperchain.polygonAmoy;
}

// Default chain for the app
export const defaultChain = getDefaultChain();

// Supported chains
export const supportedChains = [
  {
    ...polygon,
    id: 137,
    name: 'Polygon Mainnet',
    network: 'polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ['https://polygon-rpc.com'] },
      public: { http: ['https://polygon-rpc.com'] },
    },
  },
  {
    ...polygonAmoy,
    id: 80002,
    name: 'Polygon Amoy',
    network: 'polygon-amoy',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ['https://rpc-amoy.polygon.technology'] },
      public: { http: ['https://rpc-amoy.polygon.technology'] },
    },
  },
  {
    id: 137,
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
  localHardhat,
  polygonSuperchain.polygonAmoy,
  polygonSuperchain.polygonMumbai,
  polygonSuperchain.polygonZkEvmTestnet,
  polygonSuperchain.polygon,
  polygonSuperchain.polygonZkEvm,
]; 