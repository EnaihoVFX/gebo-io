# Gebo Web3 Video Platform - Complete Setup Guide

This guide will walk you through setting up the complete Gebo platform with creator tokens, live market valuation, and investor data features.

## Prerequisites

- Node.js 18+ and npm
- MetaMask or other Web3 wallet
- Polygon Mumbai testnet MATIC (get from [faucet](https://faucet.polygon.technology/))
- Git

## Step 1: Clone and Install

```bash
git clone <repository-url>
cd ai-video-dapp
npm install
```

## Step 2: Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Blockchain Configuration
NEXT_PUBLIC_VIDEO_NFT_ADDRESS=your_video_nft_contract_address
NEXT_PUBLIC_CREATOR_TOKEN_ADDRESS=your_creator_token_contract_address
NEXT_PUBLIC_POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com

# IPFS Configuration (Pinata)
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token

# AI Services
JENIUS_API_KEY=your_jenius_api_key
COMET_API_KEY=your_comet_api_key

# Optional: For production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Step 3: Smart Contract Deployment

### 3.1 Configure Hardhat

Update `hardhat.config.js` to include your private key and API keys:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: process.env.NEXT_PUBLIC_POLYGON_MUMBAI_RPC,
      accounts: [process.env.PRIVATE_KEY], // Your wallet private key
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY, // For contract verification
  },
};
```

### 3.2 Deploy VideoNFT Contract

```bash
# Compile contracts
npx hardhat compile

# Deploy VideoNFT contract
npx hardhat run scripts/deploy-video-nft.js --network mumbai
```

Copy the deployed address and add it to your `.env.local`:
```env
NEXT_PUBLIC_VIDEO_NFT_ADDRESS=0x... # Address from deployment
```

### 3.3 Deploy CreatorToken Contract

```bash
# Deploy CreatorToken contract
npx hardhat run scripts/deploy-creator-token.js --network mumbai
```

Copy the deployed address and add it to your `.env.local`:
```env
NEXT_PUBLIC_CREATOR_TOKEN_ADDRESS=0x... # Address from deployment
```

## Step 4: IPFS Setup (Pinata)

### 4.1 Create Pinata Account

1. Go to [Pinata](https://pinata.cloud/)
2. Create an account
3. Go to API Keys section
4. Create a new API key with upload permissions

### 4.2 Get JWT Token

1. In Pinata dashboard, go to API Keys
2. Create a new key with the following permissions:
   - `pinFileToIPFS`
   - `pinJSONToIPFS`
3. Copy the JWT token and add to `.env.local`:
   ```env
   NEXT_PUBLIC_PINATA_JWT=pnta_...
   ```

## Step 5: AI Services Setup

### 5.1 Jenius MCP (Optional)

For real ad revenue predictions:

1. Sign up at [Jenius](https://jenius.com)
2. Get your API key
3. Add to `.env.local`:
   ```env
   JENIUS_API_KEY=your_jenius_api_key
   ```

**Note**: The app works with algorithmic fallback predictions if no API key is provided.

### 5.2 Comet Opik (Optional)

For video enhancement and analytics:

1. Sign up at [Comet](https://comet.com)
2. Get your API key
3. Add to `.env.local`:
   ```env
   COMET_API_KEY=your_comet_api_key
   ```

## Step 6: Run the Application

```bash
# Start development server
npm run dev
```

Visit `http://localhost:3000` to access the platform.

## Step 7: Testing the Platform

### 7.1 Test Video Upload and NFT Minting

1. Connect your MetaMask wallet to Polygon Mumbai
2. Go to `/upload`
3. Upload a video file and thumbnail
4. Fill in title and description
5. Click "Upload & Mint NFT"
6. Approve the transaction in MetaMask

### 7.2 Test Creator Token Registration

1. Go to any video page
2. If you're the creator, you'll see "Register Creator Token"
3. Click to register your creator token
4. Approve the transaction

### 7.3 Test Creator Token Trading

1. Go to a video with a registered creator token
2. Click "Show Investor Data" to see trading interface
3. Buy some creator tokens
4. View live market data and growth metrics

## Step 8: Production Deployment

### 8.1 Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 8.2 Environment Variables in Production

Set these environment variables in your Vercel dashboard:

- `NEXT_PUBLIC_VIDEO_NFT_ADDRESS`
- `NEXT_PUBLIC_CREATOR_TOKEN_ADDRESS`
- `NEXT_PUBLIC_PINATA_JWT`
- `JENIUS_API_KEY` (optional)
- `COMET_API_KEY` (optional)

### 8.3 Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update `NEXT_PUBLIC_APP_URL` in environment variables

## Step 9: Monitoring and Analytics

### 9.1 Contract Monitoring

- Use [PolygonScan](https://mumbai.polygonscan.com/) to monitor contract transactions
- Set up alerts for important events

### 9.2 Platform Analytics

The platform includes built-in analytics:
- Video views and engagement
- Creator token trading volume
- Ad revenue generation
- User growth metrics

## Step 10: Advanced Configuration

### 10.1 Custom Token Economics

Edit `contracts/CreatorToken.sol` to modify:
- Base token price
- Price multiplier
- Platform fees
- Revenue sharing ratios

### 10.2 Custom Video Categories

Update the video upload form to include:
- Content categories
- Age restrictions
- Geographic restrictions

### 10.3 Enhanced AI Features

Integrate additional AI services:
- Content moderation
- Automatic tagging
- Thumbnail generation
- Video transcription

## Troubleshooting

### Common Issues

1. **Contract Deployment Fails**
   - Ensure you have enough MATIC in your wallet
   - Check your private key is correct
   - Verify network configuration

2. **IPFS Upload Fails**
   - Verify Pinata JWT token is correct
   - Check file size limits (Pinata: 1GB)
   - Ensure proper file format

3. **Wallet Connection Issues**
   - Clear browser cache
   - Ensure MetaMask is connected to Polygon Mumbai
   - Check if wallet is locked

4. **Transaction Failures**
   - Ensure sufficient MATIC for gas fees
   - Check transaction parameters
   - Verify contract addresses are correct

### Support

For additional help:
- Check the [GitHub issues](https://github.com/your-repo/issues)
- Join our [Discord community](https://discord.gg/gebo)
- Email: support@gebo.com

## Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **Environment Variables**: Keep sensitive data in `.env.local`
3. **Contract Verification**: Always verify contracts on PolygonScan
4. **Access Control**: Implement proper access controls for admin functions
5. **Input Validation**: Validate all user inputs on both frontend and smart contracts

## Performance Optimization

1. **IPFS Gateway**: Use multiple IPFS gateways for redundancy
2. **Caching**: Implement proper caching for video metadata
3. **CDN**: Use CDN for static assets
4. **Database**: Consider adding a database for complex queries
5. **Indexing**: Index blockchain events for faster queries

## Next Steps

After successful setup, consider:

1. **Multi-chain Support**: Deploy to Ethereum mainnet
2. **Mobile App**: Build React Native mobile app
3. **Advanced Analytics**: Implement detailed creator analytics
4. **Social Features**: Add comments, likes, and sharing
5. **Live Streaming**: Integrate live streaming capabilities
6. **DAO Governance**: Implement community governance
7. **Advanced AI**: Add more sophisticated AI features

---

**Congratulations!** You now have a fully functional Web3 video platform with creator tokens, live market data, and investor features. 🎉 