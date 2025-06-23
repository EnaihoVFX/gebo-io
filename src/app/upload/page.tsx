'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface UploadData {
  videoFile: File | null;
  videoUrl: string;
  videoSize: number;
  videoType: string;
}

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadData, setUploadData] = useState<UploadData>({
    videoFile: null,
    videoUrl: '',
    videoSize: 0,
    videoType: '',
  });

  const handleVideoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setUploadData({
        videoFile: file,
        videoUrl: URL.createObjectURL(file),
        videoSize: file.size,
        videoType: file.type,
      });
    }
  }, []);

  const handleContinue = () => {
    if (!uploadData.videoFile) return;
    
    // Store video data for the next page
    const videoInfo = {
      videoFile: uploadData.videoFile,
      videoUrl: uploadData.videoUrl,
      videoSize: uploadData.videoSize,
      videoType: uploadData.videoType,
      videoName: uploadData.videoFile.name,
    };
    
    // Store the actual File object in memory for the next page
    (window as any).__uploadedVideoFile = uploadData.videoFile;
    
    // Store metadata in localStorage (File objects can't be serialized)
    localStorage.setItem('videoData', JSON.stringify({
      videoUrl: uploadData.videoUrl,
      videoSize: uploadData.videoSize,
      videoType: uploadData.videoType,
      videoName: uploadData.videoFile.name,
    }));
    
    // Navigate to upload method selection
    router.push('/upload/method');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center py-8 px-2">
      <div className="glassmorphic-main-card animate-fade-in-up relative w-full max-w-7xl mx-auto p-0 md:p-6 rounded-3xl border border-white/15 shadow-2xl backdrop-blur-2xl bg-white/5" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.18)',background:'linear-gradient(135deg,rgba(255,255,255,0.10) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.10) 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="glassmorphic-featured-card mb-6 p-6">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">Upload Your Video</h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Share your content with the world. Upload, enhance, and mint your videos as NFTs on the blockchain.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Upload Area */}
              <div className="space-y-8">
                {/* Video Upload Section */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl">
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Upload Video File</h2>
                    </div>
                    
                    {!uploadData.videoUrl ? (
                      <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center bg-gray-700/50 hover:bg-gray-700/70 transition-all duration-300">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Upload className="w-10 h-10 text-purple-400" />
                        </div>
                        <p className="text-gray-300 text-lg mb-2 font-medium">Drag and drop your video here</p>
                        <p className="text-gray-500 mb-6">or</p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                        >
                          Select Video File
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                        <p className="text-sm text-gray-500 mt-6">
                          Supported formats: MP4, MOV, AVI, WebM (Max 100MB)
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="relative rounded-xl overflow-hidden bg-gray-900">
                          <video
                            src={uploadData.videoUrl}
                            className="w-full rounded-xl"
                            controls
                          />
                        </div>
                        <div className="flex items-center justify-between bg-gray-700/50 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </div>
                            <span className="text-sm text-gray-300 font-medium">
                              {uploadData.videoFile?.name}
                            </span>
                          </div>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                          >
                            Change
                          </button>
                        </div>
                        <div className="text-sm text-gray-400 bg-gray-700/30 rounded-lg p-3">
                          Size: {(uploadData.videoSize / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Continue Button */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-2xl">
                  <button
                    onClick={handleContinue}
                    disabled={!uploadData.videoFile}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span>Continue to Upload Method</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <p className="text-sm text-gray-400 mt-4 text-center">
                    Next: Choose your upload method and processing options
                  </p>
                </div>
              </div>

              {/* Info Panel */}
              <div className="space-y-8">
                {/* Upload Info */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Upload Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-400">File size limit:</span>
                      <span className="font-semibold text-white">100 MB</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-400">Supported formats:</span>
                      <span className="font-semibold text-white">MP4, MOV, AVI, WebM</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-400">Storage:</span>
                      <span className="font-semibold text-green-400">IPFS (Decentralized)</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-400">Processing:</span>
                      <span className="font-semibold text-purple-400">Choose on next page</span>
                    </div>
                  </div>
                </div>

                {/* Upload Flow Info */}
                <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-700/50 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Upload Flow</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5 shadow-lg">
                        1
                      </div>
                      <div>
                        <div className="font-semibold text-white mb-1">Upload Video</div>
                        <div className="text-blue-300">Select and upload your video file</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5 shadow-lg">
                        2
                      </div>
                      <div>
                        <div className="font-semibold text-white mb-1">Choose Method</div>
                        <div className="text-purple-300">Select upload method and processing options</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5 shadow-lg">
                        3
                      </div>
                      <div>
                        <div className="font-semibold text-white mb-1">AI Enhancement</div>
                        <div className="text-pink-300">Optional AI enhancement and improvement</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5 shadow-lg">
                        4
                      </div>
                      <div>
                        <div className="font-semibold text-white mb-1">Mint NFT</div>
                        <div className="text-green-300">Create and mint your video as an NFT</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 