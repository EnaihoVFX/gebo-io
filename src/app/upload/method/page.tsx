'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  Sparkles,
  Edit3,
  Settings,
  ArrowLeft
} from 'lucide-react';

interface VideoData {
  videoFile: File;
  videoUrl: string;
  videoSize: number;
  videoType: string;
  videoName: string;
}

export default function UploadMethodPage() {
  const router = useRouter();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [uploadChoice, setUploadChoice] = useState<'direct' | 'ai-enhanced' | 'manual-edit'>('direct');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const storedVideoData = localStorage.getItem('videoData');
    const fileInMemory = (window as any).__uploadedVideoFile;
    
    if (storedVideoData && fileInMemory) {
      try {
        const parsed = JSON.parse(storedVideoData);
        setVideoData({
          videoFile: fileInMemory,
          videoUrl: parsed.videoUrl,
          videoSize: parsed.videoSize,
          videoType: parsed.videoType,
          videoName: parsed.videoName,
        });
      } catch (error) {
        console.error('Error parsing video data:', error);
        router.push('/upload');
      }
    } else {
      console.log('No video data found, redirecting to upload');
      router.push('/upload');
    }
  }, [router]);

  const handleSubmit = async () => {
    if (!videoData) return;

    setIsUploading(true);

    try {
      // Ensure we have a proper File object with all properties
      const file = videoData.videoFile;
      
      console.log('Starting upload with video data:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });

      // Validate that we have a proper file
      if (!file.name || !file.size || !file.type) {
        throw new Error('Invalid file object. Please try uploading again.');
      }

      const videoFormData = new FormData();
      videoFormData.append('file', file);

      console.log('FormData created, sending request...');

      const videoResponse = await fetch('/api/upload-ipfs', {
        method: 'POST',
        body: videoFormData,
      });

      console.log('Response received:', {
        status: videoResponse.status,
        ok: videoResponse.ok
      });

      if (!videoResponse.ok) {
        const errorText = await videoResponse.text();
        console.error('Upload failed with response:', errorText);
        throw new Error(`Failed to upload video: ${videoResponse.status} ${errorText}`);
      }

      const responseData = await videoResponse.json();
      console.log('Upload successful, response data:', responseData);

      const uploadInfo = {
        videoHash: responseData.hash,
        videoSize: videoData.videoSize,
        videoType: videoData.videoType,
        videoName: videoData.videoName,
        uploadChoice: uploadChoice,
        videoUrl: videoData.videoUrl,
      };

      localStorage.setItem('uploadData', JSON.stringify(uploadInfo));
      
      (window as any).__uploadedVideoFile = file;
      sessionStorage.setItem('uploadedVideo', JSON.stringify({
        name: videoData.videoName,
        size: videoData.videoSize,
        type: videoData.videoType,
        preview: videoData.videoUrl
      }));
      
      router.push('/smart-edit');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!videoData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading video data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <button
              onClick={() => router.push('/upload')}
              className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </button>
            <h1 className="text-4xl font-bold text-white">Choose Upload Method</h1>
          </div>
          <p className="text-gray-400 text-lg mb-6">Select how you want to process your video</p>
          <div className="inline-flex items-center space-x-2 bg-gray-800 rounded-xl px-4 py-2 border border-gray-700">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-300">
              {videoData.videoName} ({(videoData.videoSize / (1024 * 1024)).toFixed(2)} MB)
            </span>
          </div>
        </div>

        {/* Upload Method Selection */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-2xl mb-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Upload Method</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setUploadChoice('direct')}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                uploadChoice === 'direct'
                  ? 'border-purple-500 bg-gradient-to-br from-purple-900/50 to-pink-900/50 shadow-lg shadow-purple-500/20'
                  : 'border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  uploadChoice === 'direct' 
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                    : 'bg-gray-600'
                }`}>
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2 text-lg">Direct Upload</h3>
                <p className="text-sm text-gray-400 mb-3">Quick and simple upload process</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>• AI enhancement</div>
                  <div>• Optional manual edit</div>
                  <div>• Mint as NFT</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setUploadChoice('ai-enhanced')}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                uploadChoice === 'ai-enhanced'
                  ? 'border-purple-500 bg-gradient-to-br from-purple-900/50 to-pink-900/50 shadow-lg shadow-purple-500/20'
                  : 'border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  uploadChoice === 'ai-enhanced' 
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                    : 'bg-gray-600'
                }`}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2 text-lg">AI Enhanced</h3>
                <p className="text-sm text-gray-400 mb-3">Advanced AI processing</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>• AI enhancement</div>
                  <div>• Manual edit</div>
                  <div>• Mint as NFT</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setUploadChoice('manual-edit')}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                uploadChoice === 'manual-edit'
                  ? 'border-purple-500 bg-gradient-to-br from-purple-900/50 to-pink-900/50 shadow-lg shadow-purple-500/20'
                  : 'border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  uploadChoice === 'manual-edit' 
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                    : 'bg-gray-600'
                }`}>
                  <Edit3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2 text-lg">Manual Edit</h3>
                <p className="text-sm text-gray-400 mb-3">Full creative control</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>• AI enhancement</div>
                  <div>• Manual edit</div>
                  <div>• Mint as NFT</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-2xl">
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <span>Continue with {uploadChoice === 'direct' ? 'Direct Upload' : uploadChoice === 'ai-enhanced' ? 'AI Enhancement' : 'Manual Edit'}</span>
                <Upload className="w-5 h-5" />
              </>
            )}
          </button>
          
          <p className="text-sm text-gray-400 mt-4 text-center">
            Your video will be processed according to your selected method
          </p>
        </div>
      </div>
    </div>
  );
}
