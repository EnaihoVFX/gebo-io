# Gebo Platform Setup Guide

## Quick Start

This guide will help you set up the Gebo Web3 Video Platform with a fully working blockchain boilerplate.

## 1. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# Blockchain Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x06049d835bac69e7751cad2c9ab1aa88808fc1b3
NEXT_PUBLIC_CREATOR_TOKEN_ADDRESS=0x1234567890123456789012345678901234567890

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545

# IPFS Configuration
NEXT_PUBLIC_PINATA_JWT=your-pinata-jwt-token
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your-web3-storage-token

# API Keys (for future features)
NEXT_PUBLIC_JENIUS_API_KEY=your-jenius-api-key
NEXT_PUBLIC_COMET_API_KEY=your-comet-api-key

# App Configuration
NEXT_PUBLIC_APP_NAME=Gebo
NEXT_PUBLIC_APP_DESCRIPTION=Web3 Video Platform
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start Local Blockchain

```bash
# Terminal 1: Start local Hardhat network
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy-video-nft.js --network localhost
npx hardhat run scripts/deploy-creator-token.js --network localhost
```

## 4. Configure MetaMask

1. Open MetaMask
2. Add a new network:
   - Network Name: Local Hardhat
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH
3. Import one of the test accounts from the Hardhat output

## 5. Start Development Server

```bash
npm run dev
```

## 6. Platform Features

### Core Features
- ✅ Video Upload & Minting
- ✅ IPFS Storage Integration
- ✅ NFT Marketplace
- ✅ Creator Tokens
- ✅ Wallet Connection
- ✅ Video Player
- ✅ Search & Discovery

### Blockchain Features
- ✅ Smart Contract Integration
- ✅ Gas Optimization
- ✅ Error Handling
- ✅ Network Detection
- ✅ Transaction Management

### UI/UX Features
- ✅ Modern Design
- ✅ Responsive Layout
- ✅ Loading States
- ✅ Error Messages
- ✅ Progress Indicators

## 7. Testing the Platform

1. **Connect Wallet**: Click "Connect Wallet" in the header
2. **Upload Video**: Go to `/upload` and upload a video
3. **Mint NFT**: Complete the minting process
4. **View Videos**: Check the home page for uploaded videos
5. **Test Features**: Try searching, filtering, and interacting with videos

## 8. Troubleshooting

### Common Issues

**Wallet Connection Issues**
- Ensure MetaMask is installed and unlocked
- Check that you're connected to the correct network
- Try refreshing the page

**Contract Interaction Issues**
- Verify contract addresses in `.env.local`
- Check that contracts are deployed to the correct network
- Ensure you have sufficient ETH for gas fees

**IPFS Upload Issues**
- Configure Pinata JWT token for reliable uploads
- Check internet connection
- Verify file size limits

**Network Issues**
- Ensure Hardhat node is running
- Check RPC URL configuration
- Verify chain ID matches

## 9. Production Deployment

For production deployment:

1. Deploy contracts to a public network (Polygon, Ethereum, etc.)
2. Update environment variables with production addresses
3. Configure production IPFS services
4. Set up proper error monitoring
5. Configure analytics and tracking

## 10. Next Steps

- Add user authentication
- Implement video transcoding
- Add social features
- Integrate payment systems
- Add analytics dashboard
- Implement recommendation engine

## Support

For issues or questions, check the troubleshooting section or create an issue in the repository. 