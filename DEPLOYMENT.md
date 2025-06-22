# Gebo Platform Deployment Guide

## 🚀 Deploy to Polygon Mumbai

### Step 1: Deploy Smart Contract via Remix IDE

1. **Go to Remix IDE**: https://remix.ethereum.org/
2. **Create new file**: `VideoToken.sol`
3. **Copy contract code** from `contracts/VideoToken.sol`
4. **Compile**: Press Ctrl+S or click "Compile"
5. **Deploy**:
   - Go to "Deploy & Run Transactions"
   - Select "Injected Provider - MetaMask"
   - Make sure MetaMask is connected to **Polygon Mumbai** (Chain ID: 80001)
   - Click "Deploy"
6. **Copy the deployed contract address**

### Step 2: Get Test MATIC

1. Go to: https://faucet.polygon.technology/
2. Connect your MetaMask wallet
3. Select "Mumbai" network
4. Request test MATIC
5. Wait for confirmation (1-2 minutes)

### Step 3: Update Environment

1. Copy `.env.local.example` to `.env.local`
2. Replace `YOUR_CONTRACT_ADDRESS` with your deployed contract address
3. Optionally add API keys for enhanced features

### Step 4: Start the App

```bash
npm run dev
```

Open http://localhost:3000 and connect your MetaMask wallet!

## 🔧 Troubleshooting

- **MetaMask not connecting**: Ensure you're on Mumbai testnet (Chain ID: 80001)
- **Transactions failing**: Check you have enough test MATIC for gas
- **Contract errors**: Verify the contract address in `.env.local` is correct

## 🎉 Success!

Your Gebo platform is now live on Polygon Mumbai with:
- ✅ Real blockchain transactions
- ✅ Dual token economics (NFT + fungible tokens)
- ✅ AI-powered pricing
- ✅ Revenue sharing and staking
- ✅ Modern Web3 UI

## 🚀 Quick Start

Gebo is now fully integrated with Polygon Superchain! Here's how to deploy and run it:

## 📋 Prerequisites

1. **Node.js** (v18+)
2. **MetaMask** or other Web3 wallet
3. **MATIC tokens** for gas fees (get from [Polygon Faucet](https://faucet.polygon.technology/))
4. **WalletConnect Project ID** (get from [WalletConnect Cloud](https://cloud.walletconnect.com/))

## 🔧 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_JENIUS_API_KEY=your_jenius_api_key
NEXT_PUBLIC_JENIUS_API_URL=https://api.jenius.com/v1
```

### 3. Deploy Smart Contract

#### Option A: Using Remix IDE (Recommended for demo)
1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create new file `VideoToken.sol`
3. Copy the contract code from `contracts/VideoToken.sol`
4. Compile the contract
5. Deploy to Polygon Mumbai testnet
6. Copy the deployed contract address

#### Option B: Using Hardhat
```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init

# Configure networks in hardhat.config.js
# Add your private key and Polygon Mumbai RPC

# Deploy
npx hardhat run scripts/deploy.js --network mumbai
```

### 4. Update Contract Addresses
Update `src/config/web3.ts` with your deployed contract addresses:
```typescript
export const CONTRACT_ADDRESSES = {
  [polygonMumbai.id]: 'YOUR_DEPLOYED_CONTRACT_ADDRESS',
  [polygonZkEvmTestnet.id]: 'YOUR_DEPLOYED_CONTRACT_ADDRESS',
} as const;
```

## 🌐 Supported Networks

- **Polygon Mumbai** (Testnet) - Recommended for development
- **Polygon zkEVM Testnet** - For testing zkEVM features
- **Polygon Mainnet** - For production
- **Polygon zkEVM** - For production zkEVM

## 💰 Get Test MATIC

1. **Polygon Mumbai**: [Polygon Faucet](https://faucet.polygon.technology/)
2. **zkEVM Testnet**: [zkEVM Faucet](https://portal.zkevm.polygon.technology/)

## 🎯 Features

### Dual Token Model
- **Video Coins** (ERC-1155): Stake to support creators, earn 12.5% APY
- **Video NFTs** (ERC-721): Own videos, receive 20% of ad revenue

### Smart Contract Functions
- `createVideo()`: Mint new video tokens
- `stakeTokens()`: Stake video coins
- `purchaseNFT()`: Buy video NFT
- `claimRewards()`: Claim staking rewards
- `distributeRevenue()`: Distribute ad revenue

### Web3 Integration
- **Wallet Connection**: MetaMask, WalletConnect, RainbowKit
- **Real Transactions**: Actual blockchain interactions
- **IPFS Storage**: Decentralized video storage
- **Jenius MCP**: AI-powered pricing insights
- **Comet Opik**: Quality tracking and analytics

## 🔄 Workflow

1. **Connect Wallet** → MetaMask/WalletConnect
2. **Upload Video** → IPFS storage
3. **Set Prices** → Jenius MCP recommendations
4. **Mint Tokens** → Smart contract deployment
5. **Stake/Buy** → Real blockchain transactions
6. **Track Performance** → Dashboard analytics

## 🛠️ Development

### Run Locally
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## 🔍 Testing

### Test Smart Contract
```bash
npx hardhat test
```

### Test Frontend
```bash
npm run test
```

## 📊 Monitoring

- **Block Explorer**: [PolygonScan](https://mumbai.polygonscan.com/)
- **Contract Events**: Monitor VideoCreated, TokensStaked, NFTPurchased
- **Analytics**: Comet Opik experiment tracking

## 🚨 Important Notes

1. **Gas Fees**: Always have MATIC for transactions
2. **Network Switching**: App automatically detects and switches networks
3. **Contract Verification**: Verify contracts on block explorer for transparency
4. **Security**: Never share private keys or seed phrases

## 🆘 Troubleshooting

### Common Issues
1. **"Wrong Network"**: Switch to Polygon Mumbai in MetaMask
2. **"Insufficient Balance"**: Get test MATIC from faucet
3. **"Contract Not Found"**: Verify contract address is correct
4. **"Transaction Failed"**: Check gas fees and network congestion

### Support
- Check [Polygon Documentation](https://docs.polygon.technology/)
- Visit [Polygon Discord](https://discord.gg/polygon)
- Review [Hardhat Documentation](https://hardhat.org/docs)

## 🎉 Ready to Launch!

Your Gebo platform is now fully functional on Polygon Superchain with:
- ✅ Real blockchain transactions
- ✅ Dual token economics
- ✅ AI-powered insights
- ✅ Quality tracking
- ✅ Revenue sharing

**Happy building! 🚀**

# Smart Contract Deployment Guide

## Issue Resolution

The NFT minting error you're experiencing is because the VideoNFT smart contract hasn't been deployed yet. The app is trying to connect to a placeholder contract address.

## Quick Fix

1. **Deploy the VideoNFT Contract:**

   ```bash
   # Make sure you have a private key with some MATIC for gas fees
   # Add your private key to .env.local:
   echo "PRIVATE_KEY=your_private_key_here" >> .env.local
   
   # Deploy the contract
   npx hardhat run scripts/deploy-video-nft.js --network mumbai
   ```

2. **Update Environment Variables:**
   
   After deployment, copy the contract address and update your `.env.local` file:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Replace with actual deployed address
   ```

3. **Restart the Development Server:**
   
   ```bash
   npm run dev
   ```

## Detailed Steps

### 1. Get MATIC Testnet Tokens

Visit the Polygon Mumbai Faucet to get test MATIC:
- https://faucet.polygon.technology/
- https://mumbaifaucet.com/

### 2. Set Up Your Wallet

1. Install MetaMask if you haven't already
2. Add Polygon Mumbai testnet to MetaMask:
   - Network Name: Polygon Mumbai
   - RPC URL: https://rpc-mumbai.maticvigil.com
   - Chain ID: 80001
   - Currency Symbol: MATIC
   - Block Explorer: https://mumbai.polygonscan.com

### 3. Get Your Private Key

1. Open MetaMask
2. Go to Account Details → Export Private Key
3. Copy the private key (keep it secure!)

### 4. Update Environment File

Add your private key to `.env.local`:
```
PRIVATE_KEY=your_private_key_here
```

### 5. Deploy Contracts

```bash
# Deploy VideoNFT contract
npx hardhat run scripts/deploy-video-nft.js --network mumbai

# Deploy CreatorToken contract (optional)
npx hardhat run scripts/deploy-creator-token.js --network mumbai
```

### 6. Update Contract Addresses

Copy the deployed contract addresses and update `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # VideoNFT address
NEXT_PUBLIC_CREATOR_TOKEN_ADDRESS=0x... # CreatorToken address (if deployed)
```

### 7. Test the App

1. Restart the development server: `npm run dev`
2. Connect your wallet to Polygon Mumbai
3. Try uploading and minting a video

## Troubleshooting

### "Invalid Chain" Error
- Make sure your wallet is connected to Polygon Mumbai (Chain ID: 80001)
- The app will automatically prompt you to switch networks

### "Insufficient Funds" Error
- Get more MATIC from the faucet
- Make sure you have enough for gas fees

### "Contract not deployed" Error
- Follow the deployment steps above
- Make sure the contract address in `.env.local` is correct

### Network Connection Issues
- Try different RPC URLs:
  - https://rpc-mumbai.maticvigil.com
  - https://polygon-testnet.public.blastapi.io
  - https://endpoints.omniatech.io/v1/matic/mumbai/public

## Security Notes

- Never commit your private key to version control
- Use testnet private keys only
- Keep your mainnet private keys secure
- The `.env.local` file is already in `.gitignore`

## Next Steps

After successful deployment:
1. Test video upload and minting
2. Test NFT buying and selling
3. Test creator token functionality
4. Deploy to mainnet when ready (change network config) 