# Gebo - Web3 Video Platform

A decentralized video platform built on Polygon Mumbai that allows creators to upload, enhance, and mint videos as NFTs with ad revenue sharing.

## Features

- **Real Blockchain Integration**: Videos are stored on IPFS and minted as NFTs on Polygon Mumbai
- **Ad Revenue Sharing**: NFT owners earn 80% of ad revenue generated from their videos
- **Jenius MCP Integration**: AI-powered ad revenue predictions and audience insights
- **YouTube-like Interface**: Familiar video browsing and watching experience
- **Short-form Videos**: TikTok-style clips with vertical scrolling
- **NFT Marketplace**: Buy, sell, and trade video NFTs
- **Comet Opik Integration**: Video enhancement and analytics

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Blockchain**: Polygon Mumbai, Solidity, Hardhat
- **Storage**: IPFS (Pinata)
- **AI Services**: Jenius MCP, Comet Opik
- **Web3**: Ethers.js v6

## Smart Contract Features

The `VideoNFT` smart contract includes:

- **Video Minting**: Upload videos to IPFS and mint as ERC-721 NFTs
- **Ad Revenue Management**: Track and distribute ad revenue to NFT owners
- **Marketplace**: List and buy video NFTs
- **View/Like Tracking**: On-chain engagement metrics
- **Short-form Support**: Special handling for clips and shorts

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- MetaMask or other Web3 wallet
- Polygon Mumbai testnet MATIC (get from [faucet](https://faucet.polygon.technology/))

### 2. Clone and Install

```bash
git clone <repository-url>
cd ai-video-dapp
npm install
```

### 3. Environment Variables

Create a `.env.local` file:

```env
# Blockchain
NEXT_PUBLIC_VIDEO_NFT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com

# IPFS (Pinata)
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token

# Jenius MCP
JENIUS_API_KEY=your_jenius_api_key

# Comet Opik
COMET_API_KEY=your_comet_api_key
```

### 4. Deploy Smart Contract

```bash
# Compile contracts
npx hardhat compile

# Deploy to Polygon Mumbai
npx hardhat run scripts/deploy-video-nft.js --network mumbai
```

Copy the deployed contract address to your `.env.local` file.

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to access the platform.

## Usage Guide

### For Creators

1. **Upload Video**: Go to `/upload` and select video + thumbnail files
2. **Add Metadata**: Enter title, description, and mark as short-form if applicable
3. **Mint NFT**: Video is uploaded to IPFS and minted as NFT on blockchain
4. **Earn Revenue**: NFT owners automatically receive 80% of ad revenue

### For Viewers

1. **Browse Videos**: Explore trending videos on the home page
2. **Watch Clips**: Use the `/clips` page for short-form content
3. **View Predictions**: See Jenius MCP ad revenue predictions on video pages
4. **Buy NFTs**: Purchase video NFTs to earn ad revenue

### For NFT Traders

1. **List for Sale**: NFT owners can list videos for sale
2. **Buy NFTs**: Purchase video NFTs to own the content and revenue rights
3. **Track Performance**: Monitor ad revenue and engagement metrics

## API Endpoints

### Jenius MCP Integration

- `POST /api/jenius/predict-revenue`: Get ad revenue predictions
- `POST /api/jenius/audience-insights`: Get audience demographics
- `POST /api/jenius/pricing-insights`: Get optimal NFT pricing

### Comet Opik Integration

- `POST /api/comet/enhance`: AI video enhancement
- `POST /api/comet/analytics`: Video performance analytics

## Smart Contract Functions

### Core Functions

- `mintVideo()`: Mint a new video NFT
- `listNFT()`: List NFT for sale
- `buyNFT()`: Purchase listed NFT
- `updateViews()`: Increment view count
- `updateLikes()`: Increment like count

### Revenue Functions

- `generateAdRevenue()`: Platform adds ad revenue
- `distributeAdRevenue()`: Distribute revenue to NFT owner
- `withdrawPlatformFees()`: Withdraw platform fees

### Query Functions

- `getVideo()`: Get video metadata
- `getRecentVideos()`: Get latest videos
- `getShortFormVideos()`: Get clips/shorts
- `getCreatorVideos()`: Get creator's videos

## Ad Revenue Model

- **80% to NFT Owner**: Current NFT owner receives 80% of ad revenue
- **20% to Platform**: Platform retains 20% for operations
- **Automatic Distribution**: Revenue is distributed automatically
- **Real-time Tracking**: All revenue is tracked on-chain

## Security Features

- **Reentrancy Protection**: Prevents reentrancy attacks
- **Ownership Controls**: Only NFT owners can list for sale
- **Platform Fees**: Transparent 2.5% marketplace fee
- **IPFS Storage**: Decentralized, immutable video storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Email: support@gebo.com

## Roadmap

- [ ] Multi-chain support (Ethereum, Arbitrum)
- [ ] Advanced AI video enhancement
- [ ] Social features (comments, sharing)
- [ ] Mobile app
- [ ] Creator dashboard
- [ ] Advanced analytics
- [ ] Live streaming support
# gebo-io
