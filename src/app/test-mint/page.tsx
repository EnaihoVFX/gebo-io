'use client';

import { useState, useEffect } from 'react';
import { blockchainService } from '@/utils/blockchainService';

export default function TestMintPage() {
  const [testFile, setTestFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [envStatus, setEnvStatus] = useState<any>(null);

  useEffect(() => {
    // Check environment variables
    const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    
    setEnvStatus({
      pinataJWT: pinataJWT ? (pinataJWT.includes('your') ? 'Not configured' : 'Configured') : 'Not set',
      contractAddress: contractAddress ? (contractAddress.includes('0x1234567890123456789012345678901234567890') ? 'Not deployed' : 'Configured') : 'Not set',
      nodeEnv: process.env.NODE_ENV
    });
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTestFile(file);
      setError(null);
      setUploadResult(null);
    }
  };

  const testIPFSUpload = async () => {
    if (!testFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      console.log('🧪 Testing IPFS upload with file:', testFile.name, testFile.size);
      
      const result = await blockchainService.uploadToIPFSFromFile(testFile, testFile.name);
      
      console.log('📤 Upload result:', result);
      setUploadResult(result);
      
      if (result.success) {
        console.log('✅ IPFS upload test successful!');
      } else {
        console.error('❌ IPFS upload test failed:', result.error);
        setError(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ IPFS upload test error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsUploading(false);
    }
  };

  const testSimpleMint = async () => {
    if (!testFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      console.log('🧪 Testing simple mint with file:', testFile.name);
      
      const result = await blockchainService.simpleMint();
      
      console.log('📤 Mint result:', result);
      setUploadResult({ success: true, transactionHash: result });
      
    } catch (error) {
      console.error('❌ Simple mint test error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">IPFS Upload Test</h1>
          <p className="text-lg text-gray-600">
            Test IPFS upload functionality and debug issues
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">File Selection</h2>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          {testFile && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p><strong>Selected file:</strong> {testFile.name}</p>
              <p><strong>Size:</strong> {(testFile.size / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>Type:</strong> {testFile.type}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="flex space-x-4">
            <button
              onClick={testIPFSUpload}
              disabled={!testFile || isUploading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Test IPFS Upload'}
            </button>
            <button
              onClick={testSimpleMint}
              disabled={isUploading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Minting...' : 'Test Simple Mint'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-700 whitespace-pre-line">{error}</p>
          </div>
        )}

        {uploadResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-green-800 font-semibold mb-2">Result</h3>
            <pre className="text-green-700 text-sm overflow-auto">
              {JSON.stringify(uploadResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mt-6">
          <h3 className="font-semibold mb-2">Debug Information</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Check browser console for detailed logs</li>
            <li>• IPFS upload uses fallback methods if Pinata fails</li>
            <li>• Development mode uses mock hashes if all uploads fail</li>
            <li>• File size limit: 100MB</li>
          </ul>
        </div>

        {envStatus && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h3 className="text-blue-800 font-semibold mb-2">Environment Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Pinata JWT:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  envStatus.pinataJWT === 'Configured' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {envStatus.pinataJWT}
                </span>
              </div>
              <div>
                <span className="font-medium">Contract Address:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  envStatus.contractAddress === 'Configured' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {envStatus.contractAddress}
                </span>
              </div>
              <div>
                <span className="font-medium">Node Environment:</span>
                <span className="ml-2 px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                  {envStatus.nodeEnv}
                </span>
              </div>
            </div>
            {envStatus.pinataJWT !== 'Configured' && (
              <p className="text-blue-700 text-sm mt-2">
                💡 To use Pinata IPFS, set NEXT_PUBLIC_PINATA_JWT in your .env.local file
              </p>
            )}
            {envStatus.contractAddress !== 'Configured' && (
              <p className="text-blue-700 text-sm mt-1">
                💡 To deploy contracts, run: npx hardhat run scripts/deploy-video-nft.js --network mumbai
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 