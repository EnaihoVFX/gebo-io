# Gebo Web3 Video Platform - Complete Setup Guide

## 🎉 Platform Features

Your Gebo platform now includes:

### ✨ YouTube/Twitch-like Layout
- Modern sidebar navigation with expandable sections
- Video grid layout with hover effects
- Category filtering and sorting options
- Professional video cards with thumbnails

### 🎨 Advanced Thumbnail System
- **Auto-generated thumbnails**: 3 thumbnails automatically generated from your video
- **Custom thumbnails**: Upload your own thumbnail image
- **AI-generated thumbnails**: Use Replicate AI to generate custom thumbnails
- **Thumbnail preview**: Popup modal to preview selected thumbnails
- **Thumbnail selection**: Choose from multiple options during minting

### 🔗 Fixed Blockchain Integration
- **Polygon Local Network**: Properly configured as "Polygon Local" with MATIC currency
- **Chain ID 31337**: Correct hardhat local network configuration
- **No more MetaMask warnings**: Suppressed development errors
- **Proper network detection**: Shows as Polygon with MATIC symbol

### 📱 Enhanced User Experience
- **Expandable sections**: Details, visibility, blockchain settings, and advanced options
- **Progress indicators**: Upload and minting progress bars
- **Error handling**: Comprehensive error messages and fallbacks
- **Responsive design**: Works on desktop and mobile devices

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file with:

```bash
# Blockchain Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_VIDEO_NFT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_CREATOR_TOKEN_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_CHAIN_ID=31337

# IPFS Configuration
PINATA_JWT=your_pinata_jwt_token_here
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_web3_storage_token_here

# AI Services (Optional)
REPLICATE_API_KEY=your_replicate_api_key_here
```

### 2. Start Local Blockchain

```bash
# Terminal 1: Start Hardhat network
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Start Development Server

```bash
npm run dev
```

## 🎬 Upload & Mint Flow

### Step 1: Upload Video
1. Go to `/upload`
2. Drag & drop or select a video file
3. Auto-generated thumbnails will be created
4. Choose thumbnail type:
   - **Auto**: Select from 3 auto-generated thumbnails
   - **Custom**: Upload your own thumbnail
   - **AI**: Generate custom thumbnails with AI
5. Fill in video details (title, description, tags, etc.)
6. Configure visibility and blockchain settings
7. Click "Upload & Continue to Mint"

### Step 2: Mint NFT
1. Review video preview
2. **Select thumbnail**: Choose from available options or generate new AI thumbnails
3. **Preview thumbnail**: Click to see full-size preview
4. Edit video details if needed
5. Configure blockchain settings
6. Click "Mint Video NFT"

## 🤖 AI Thumbnail Generation

### Setup Replicate API
1. Get API key from [Replicate](https://replicate.com/)
2. Add to `.env.local`: `REPLICATE_API_KEY=your_key_here`
3. Restart development server

### Using AI Thumbnails
1. Click "Generate AI" button in thumbnail section
2. Describe your desired thumbnail
3. AI generates 3 variations
4. Select one or generate more
5. Download or use directly

### Best Practices
- Be specific about style, colors, and mood
- Include "high quality", "professional", or "cinematic"
- Mention relevant objects or themes
- Specify lighting conditions

## 🔧 Technical Details

### Network Configuration
- **Local Network**: Chain ID 31337, RPC http://127.0.0.1:8545
- **Currency**: MATIC (Polygon)
- **Network Name**: Polygon Local
- **No MetaMask warnings**: Properly configured

### File Storage
- **Videos**: Uploaded to IPFS via Pinata
- **Thumbnails**: Stored in localStorage for selection
- **Metadata**: Stored on blockchain as NFT

### Smart Contracts
- **VideoNFT**: ERC-721 for video NFTs
- **CreatorToken**: ERC-20 for creator tokens
- **Deployed**: On local hardhat network

## 🎯 Key Features

### Thumbnail System
- ✅ Auto-generation from video frames
- ✅ Custom upload support
- ✅ AI generation with Replicate
- ✅ Multiple selection options
- ✅ Preview modal
- ✅ Download functionality

### Blockchain Integration
- ✅ Polygon network configuration
- ✅ Proper chain ID (31337)
- ✅ MATIC currency display
- ✅ No MetaMask warnings
- ✅ Contract deployment ready

### User Interface
- ✅ YouTube/Twitch-like layout
- ✅ Expandable sections
- ✅ Progress indicators
- ✅ Error handling
- ✅ Responsive design

## 🐛 Troubleshooting

### MetaMask Issues
- Network should show as "Polygon Local"
- Currency should be "MATIC"
- Chain ID should be 31337
- If issues persist, manually add network in MetaMask

### Thumbnail Issues
- Ensure video file is valid
- Check browser console for errors
- Try different video formats
- Clear localStorage if needed

### AI Generation Issues
- Verify Replicate API key
- Check network connection
- Try simpler prompts
- Monitor API usage/credits

## 🚀 Next Steps

1. **Deploy to Testnet**: Use Polygon Amoy testnet
2. **Add More AI Features**: Video enhancement, auto-tagging
3. **Implement Creator Tokens**: Token sales and revenue sharing
4. **Add Social Features**: Comments, likes, sharing
5. **Mobile App**: React Native version

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify environment variables
3. Ensure contracts are deployed
4. Test with different video files

Your Gebo platform is now ready for Web3 video creation and NFT minting! 🎉 