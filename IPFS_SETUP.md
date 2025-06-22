# IPFS Upload Setup Guide

## The Issue
The minting process was failing because IPFS uploads weren't properly configured. This guide will help you fix this.

## Quick Fix (Development Mode)
If you're just testing in development mode, the app will now use mock IPFS hashes automatically. You can proceed with minting without any additional setup.

## Production Setup

### Option 1: Pinata IPFS (Recommended)
1. Go to [Pinata](https://app.pinata.cloud/developers/api-keys)
2. Create an account and get your JWT token
3. Create a `.env.local` file in your project root with:
   ```
   NEXT_PUBLIC_PINATA_JWT=your_actual_jwt_token_here
   ```

### Option 2: Web3.Storage (Free Alternative)
1. Go to [Web3.Storage](https://web3.storage/)
2. Create an account and get your API token
3. The app will automatically use Web3.Storage as a fallback

### Option 3: No Setup Required
The app now includes fallback mechanisms:
- Tries Pinata first (if configured)
- Falls back to Web3.Storage
- Uses mock hashes in development mode

## Testing Your Setup

1. Visit `/test-mint` in your app
2. Upload a video file
3. Click "Test IPFS Upload"
4. Check the console for detailed logs
5. The environment status will show your configuration

## Troubleshooting

### "IPFS upload failed" Error
- Check your internet connection
- Ensure file size is under 100MB
- Try the test page at `/test-mint`
- Check browser console for detailed error messages

### "No video file available" Error
- Go back to the upload page and re-upload your video
- The file might have been cleared from memory

### Environment Variables Not Working
- Ensure `.env.local` is in the project root
- Restart your development server after adding environment variables
- Check the environment status on the test page

## File Storage Strategy

The app uses a hybrid approach:
1. **Session Storage**: Stores minimal metadata (file name, size, type)
2. **Memory Storage**: Keeps the actual file object in `window.__uploadedVideoFile`
3. **IPFS**: Uploads the file when minting

This approach prevents browser storage quota issues while maintaining functionality.

## Development vs Production

- **Development**: Uses mock hashes if IPFS uploads fail
- **Production**: Requires proper IPFS configuration for real uploads

## Next Steps

1. Test the minting process with the improved error handling
2. If you need real IPFS uploads, configure Pinata or Web3.Storage
3. Deploy your smart contracts if you haven't already
4. Check the `/test-mint` page for debugging information 