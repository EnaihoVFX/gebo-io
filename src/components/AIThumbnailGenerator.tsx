'use client';

import { useState } from 'react';
import { X, Sparkles, Download, RefreshCw } from 'lucide-react';

interface AIThumbnailGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateThumbnails: (imageUrls: string[]) => void;
  videoTitle?: string;
}

export default function AIThumbnailGenerator({ 
  isOpen, 
  onClose, 
  onGenerateThumbnails, 
  videoTitle 
}: AIThumbnailGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const generateThumbnail = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your thumbnail');
      return;
    }

    setIsGenerating(true);
    setError('');
    setIsUsingFallback(false);

    try {
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          videoTitle: videoTitle
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate thumbnail');
      }

      const data = await response.json();
      
      console.log('AI Thumbnail API response:', data);
      
      if (data.images && data.images.length > 0) {
        console.log('Generated image URLs:', data.images);
        
        // Return the original URLs, let the parent component handle proxy conversion
        onGenerateThumbnails(data.images);
        onClose();
        
        if (data.fallback) {
          setIsUsingFallback(true);
          setError('AI generation failed, showing sample images. You can still use these or try again.');
        }
      } else {
        setError('No images were generated. Please try again.');
      }
    } catch (err) {
      setError('Failed to generate thumbnail. Please check your API key and try again.');
      console.error('Thumbnail generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectThumbnail = (imageUrl: string) => {
    onGenerateThumbnails([imageUrl]);
    onClose();
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thumbnail-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred, darkened background overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-all duration-300"
        aria-hidden="true"
        onClick={onClose}
      />
      {/* Modal content */}
      <div className="relative z-10 bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-purple-800 shadow-2xl rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">AI Thumbnail Generator</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>
        {/* Content */}
        <div className="p-6">
          {/* Prompt Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Describe your thumbnail
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A futuristic gaming setup with neon lights, professional streaming background, high quality, cinematic lighting"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
              rows={3}
            />
            {videoTitle && (
              <p className="text-sm text-gray-500 mt-2">
                Video title: "{videoTitle}"
              </p>
            )}
          </div>
          {/* Generate Button */}
          <div className="mb-6">
            <button
              onClick={generateThumbnail}
              disabled={isGenerating || !prompt.trim()}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Thumbnails</span>
                </>
              )}
            </button>
          </div>
          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 border rounded-lg ${
              isUsingFallback 
                ? 'bg-yellow-900/30 border-yellow-700' 
                : 'bg-red-900/30 border-red-700'
            }`}>
              <p className={`text-sm ${
                isUsingFallback ? 'text-yellow-300' : 'text-red-300'
              }`}>
                {error}
              </p>
            </div>
          )}
          {/* Tips */}
          <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <h4 className="font-medium text-blue-200 mb-2">Tips for better thumbnails:</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Be specific about the style, colors, and mood you want</li>
              <li>• Mention "high quality", "professional", or "cinematic" for better results</li>
              <li>• Include relevant objects or themes from your video</li>
              <li>• Specify lighting conditions (e.g., "neon lights", "natural lighting")</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 