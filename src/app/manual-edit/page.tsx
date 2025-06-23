'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Scissors, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Volume2, 
  VolumeX,
  Type,
  Palette,
  Zap,
  Settings,
  Save,
  Undo,
  Redo,
  Maximize,
  Minimize,
  Clock,
  Layers,
  Music,
  Image,
  Square,
  Circle,
  Triangle,
  Bot,
  Send,
  Sparkles,
  Wand2,
  Download,
  Upload,
  Share2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Star,
  Heart,
  Flame,
  Mic,
  Camera,
  Film,
  Clapperboard,
  SkipForward,
  SkipBack,
  ChevronDown,
  Plus,
  Trash2,
  Copy,
  Move3D,
  Crop,
  Filter,
  Keyboard,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VideoLayer {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'text' | 'image' | 'effect';
  startTime: number;
  endTime: number;
  track: number;
  locked: boolean;
  visible: boolean;
  volume?: number;
  content?: any;
  color: string;
}

interface TextOverlay {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  style: {
    fontSize: number;
    color: string;
    fontFamily: string;
    bold: boolean;
    italic: boolean;
  };
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AIVideoEditor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const [videoFileName, setVideoFileName] = useState('my_video.mp4');
  const [videoDuration, setVideoDuration] = useState(60);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [activeTab, setActiveTab] = useState('media');
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [layers, setLayers] = useState<VideoLayer[]>([
    {
      id: 'video-main',
      name: 'Main Video',
      type: 'video',
      startTime: 0,
      endTime: 45,
      track: 0,
      locked: false,
      visible: true,
      color: '#3b82f6'
    },
    {
      id: 'audio-main',
      name: 'Audio Track',
      type: 'audio',
      startTime: 0,
      endTime: 45,
      track: 1,
      locked: false,
      visible: true,
      volume: 0.8,
      color: '#10b981'
    },
    {
      id: 'text-title',
      name: 'Title Text',
      type: 'text',
      startTime: 2,
      endTime: 8,
      track: 2,
      locked: false,
      visible: true,
      color: '#f59e0b'
    },
    {
      id: 'overlay-1',
      name: 'Overlay Effect',
      type: 'effect',
      startTime: 10,
      endTime: 25,
      track: 3,
      locked: false,
      visible: true,
      color: '#8b5cf6'
    }
  ]);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: '👋 Welcome to your AI Video Editor! I can help you:\n\n• Cut and trim clips\n• Add effects and filters\n• Create text overlays\n• Adjust audio levels\n• Suggest creative improvements\n\nWhat would you like to work on?',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const router = useRouter();

  const filters = [
    { name: 'None', value: '', icon: '🎬' },
    { name: 'Cinematic', value: 'sepia(0.3) contrast(1.2) brightness(0.9)', icon: '🎭' },
    { name: 'Vintage', value: 'sepia(0.6) hue-rotate(30deg) contrast(1.1)', icon: '📼' },
    { name: 'B&W', value: 'grayscale(1) contrast(1.3)', icon: '⚫' },
    { name: 'Cyberpunk', value: 'hue-rotate(280deg) saturate(1.5) contrast(1.2)', icon: '🌆' },
    { name: 'Sunset', value: 'sepia(0.4) hue-rotate(10deg) brightness(1.1)', icon: '🌅' },
    { name: 'Cool', value: 'hue-rotate(180deg) saturate(1.2) brightness(0.95)', icon: '❄️' },
    { name: 'Vibrant', value: 'saturate(1.8) contrast(1.3) brightness(1.1)', icon: '⚡' }
  ];

  // Initialize video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        setVideoDuration(videoRef.current?.duration || 60);
      });
      
      videoRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(videoRef.current?.currentTime || 0);
      });
    }
  }, []);

  // AI Response Handler
  const handleAIResponse = async (userMessage: string) => {
    setIsAIProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    const message = userMessage.toLowerCase();
    let aiResponse = '';
    
    if (message.includes('cut') || message.includes('trim')) {
      const newLayer: VideoLayer = {
        id: `cut-${Date.now()}`,
        name: 'Trimmed Clip',
        type: 'video',
        startTime: currentTime,
        endTime: currentTime + 10,
        track: layers.length,
        locked: false,
        visible: true,
        color: '#ef4444'
      };
      setLayers(prev => [...prev, newLayer]);
      aiResponse = '✂️ I\'ve created a new trimmed clip starting at your current position. You can adjust the duration by dragging the edges in the timeline.';
    } else if (message.includes('text') || message.includes('title')) {
      const newTextLayer: VideoLayer = {
        id: `text-${Date.now()}`,
        name: 'AI Generated Text',
        type: 'text',
        startTime: currentTime,
        endTime: currentTime + 5,
        track: layers.length,
        locked: false,
        visible: true,
        color: '#f59e0b'
      };
      setLayers(prev => [...prev, newTextLayer]);
      aiResponse = '📝 I\'ve added a text layer at your current position. Click on it to edit the content and styling.';
    } else if (message.includes('effect') || message.includes('filter')) {
      if (message.includes('vintage')) {
        setSelectedFilter('sepia(0.6) hue-rotate(30deg) contrast(1.1)');
        aiResponse = '📽️ Applied vintage filter! Your video now has that classic film look.';
      } else if (message.includes('bright')) {
        setBrightness(130);
        aiResponse = '☀️ Increased brightness to 130%. Your video is now more vibrant!';
      } else {
        const newEffectLayer: VideoLayer = {
          id: `effect-${Date.now()}`,
          name: 'Visual Effect',
          type: 'effect',
          startTime: currentTime,
          endTime: currentTime + 8,
          track: layers.length,
          locked: false,
          visible: true,
          color: '#8b5cf6'
        };
        setLayers(prev => [...prev, newEffectLayer]);
        aiResponse = '✨ Added a visual effect layer! I can help you customize it further.';
      }
    } else if (message.includes('audio') || message.includes('sound')) {
      setVolume(message.includes('up') ? Math.min(1, volume + 0.2) : Math.max(0, volume - 0.2));
      aiResponse = `🔊 Adjusted audio volume to ${Math.round((message.includes('up') ? Math.min(1, volume + 0.2) : Math.max(0, volume - 0.2)) * 100)}%`;
    } else if (message.includes('layer')) {
      aiResponse = `📚 You currently have ${layers.length} layers in your project:\n${layers.map(l => `• ${l.name} (${l.type})`).join('\n')}\n\nI can help you organize, duplicate, or modify any of these layers.`;
    } else {
      aiResponse = '🤖 I\'m here to help! Try asking me to:\n\n• "Add a text overlay"\n• "Apply vintage filter"\n• "Cut the video here"\n• "Increase brightness"\n• "Add an effect layer"\n• "Show me my layers"';
    }
    
    setIsAIProcessing(false);
    return aiResponse;
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    const aiResponse = await handleAIResponse(chatInput);
    
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiResponse,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, aiMessage]);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVideoStyle = () => ({
    filter: `${selectedFilter} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
  });

  const handleLayerClick = (layerId: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedLayers(prev => 
        prev.includes(layerId) 
          ? prev.filter(id => id !== layerId)
          : [...prev, layerId]
      );
    } else {
      setSelectedLayers([layerId]);
    }
  };

  const duplicateLayer = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      const newLayer: VideoLayer = {
        ...layer,
        id: `${layer.id}-copy-${Date.now()}`,
        name: `${layer.name} Copy`,
        track: layers.length
      };
      setLayers(prev => [...prev, newLayer]);
    }
  };

  const deleteLayer = (layerId: string) => {
    setLayers(prev => prev.filter(l => l.id !== layerId));
    setSelectedLayers(prev => prev.filter(id => id !== layerId));
  };

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const toggleLayerLock = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    ));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyK':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            setShowAIChat(!showAIChat);
          }
          break;
        case 'KeyZ':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            // Undo functionality
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (selectedLayers.length > 0) {
            selectedLayers.forEach(deleteLayer);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, showAIChat, selectedLayers]);

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">AI Video Pro</h1>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 hidden md:block">
            {videoFileName} • {formatTime(videoDuration)} • {layers.length} layers
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors relative"
          >
            <Keyboard className="w-4 h-4" />
            {showShortcuts && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-white">Shortcuts</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowShortcuts(false);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>Play/Pause</span>
                    <span className="text-gray-500">Space</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Assistant</span>
                    <span className="text-gray-500">⌘K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Undo</span>
                    <span className="text-gray-500">⌘Z</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delete Layer</span>
                    <span className="text-gray-500">Del</span>
                  </div>
                </div>
              </div>
            )}
          </button>
          
          <button
            onClick={() => setShowAIChat(!showAIChat)}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Bot className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-1">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Undo className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Redo className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
            onClick={() => router.push('/mint')}
          >
            Continue
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Tools */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Tool Tabs */}
          <div className="flex border-b border-gray-700">
            {[
              { id: 'media', icon: Film, label: 'Media' },
              { id: 'text', icon: Type, label: 'Text' },
              { id: 'effects', icon: Zap, label: 'Effects' },
              { id: 'audio', icon: Music, label: 'Audio' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 p-3 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mx-auto mb-1" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tool Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === 'media' && (
              <div className="space-y-3">
                <button className="w-full p-3 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <div className="text-xs text-gray-400">Import Media</div>
                </button>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-300">Recent Files</h4>
                  {['video_1.mp4', 'audio_track.mp3', 'logo.png'].map((file, i) => (
                    <div key={i} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors">
                      <div className="text-xs text-white">{file}</div>
                      <div className="text-xs text-gray-400">2.1 MB</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    const newTextLayer: VideoLayer = {
                      id: `text-${Date.now()}`,
                      name: 'New Text',
                      type: 'text',
                      startTime: currentTime,
                      endTime: currentTime + 5,
                      track: layers.length,
                      locked: false,
                      visible: true,
                      color: '#f59e0b'
                    };
                    setLayers(prev => [...prev, newTextLayer]);
                  }}
                  className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-xs">Add Text</div>
                </button>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-300">Text Styles</h4>
                  {['Title', 'Subtitle', 'Caption', 'Credits'].map((style, i) => (
                    <div key={i} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors">
                      <div className="text-xs text-white">{style}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-300">Adjustments</h4>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Font Size</label>
                    <input type="range" min="12" max="72" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Opacity</label>
                    <input type="range" min="0" max="100" defaultValue="100" className="w-full" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'effects' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-300">Filters</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {filters.map((filter, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedFilter(filter.value)}
                        className={`p-2 rounded-lg border transition-colors ${
                          selectedFilter === filter.value
                            ? 'border-blue-500 bg-blue-600/20'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className="text-lg mb-1">{filter.icon}</div>
                        <div className="text-xs">{filter.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-300">Color Grading</h4>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Brightness: {brightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Contrast: {contrast}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Saturation: {saturation}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Volume: {Math.round(volume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-300">Audio Effects</h4>
                  {['Fade In', 'Fade Out', 'Normalize', 'Noise Reduction'].map((effect, i) => (
                    <button
                      key={i}
                      className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs transition-colors"
                    >
                      {effect}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview */}
          <div className="flex-1 bg-black flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                className="w-full h-full object-contain"
                style={getVideoStyle()}
                muted={isMuted}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setVideoDuration(videoRef.current.duration);
                  }
                }}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
              />
              
              {/* Text Overlays */}
              {textOverlays.map(overlay => (
                <div
                  key={overlay.id}
                  className={`absolute pointer-events-none transition-opacity ${
                    currentTime >= overlay.startTime && currentTime <= overlay.endTime 
                      ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    left: `${overlay.position.x}%`,
                    top: `${overlay.position.y}%`,
                    fontSize: `${overlay.style.fontSize}px`,
                    color: overlay.style.color,
                    fontFamily: overlay.style.fontFamily,
                    fontWeight: overlay.style.bold ? 'bold' : 'normal',
                    fontStyle: overlay.style.italic ? 'italic' : 'normal',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {overlay.text}
                </div>
              ))}

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    )}
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="0"
                      max={videoDuration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / videoDuration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / videoDuration) * 100}%, rgba(255,255,255,0.2) 100%)`
                      }}
                    />
                  </div>
                  
                  <div className="text-sm font-mono text-white">
                    {formatTime(currentTime)} / {formatTime(videoDuration)}
                  </div>
                  
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                  
                  <select
                    value={playbackRate}
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value);
                      setPlaybackRate(rate);
                      if (videoRef.current) {
                        videoRef.current.playbackRate = rate;
                      }
                    }}
                    className="bg-white/20 text-white text-sm rounded px-2 py-1 border-0 outline-0"
                  >
                    <option value="0.25">0.25x</option>
                    <option value="0.5">0.5x</option>
                    <option value="1">1x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-64 bg-gray-800 border-t border-gray-700">
            <div className="h-12 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-sm font-semibold">Timeline</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setTimelineZoom(Math.max(0.5, timelineZoom - 0.5))}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <div className="text-xs font-mono text-gray-400 min-w-[40px] text-center">
                    {timelineZoom.toFixed(1)}x
                  </div>
                  <button
                    onClick={() => setTimelineZoom(Math.min(5, timelineZoom + 0.5))}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-700 rounded text-xs">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button className="p-1 hover:bg-gray-700 rounded text-xs">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 relative" ref={timelineRef}>
              {/* Timeline Ruler */}
              <div className="h-6 bg-gray-850 border-b border-gray-700 relative overflow-hidden">
                {Array.from({ length: Math.ceil((videoDuration * timelineZoom) / 5) + 1 }, (_, i) => {
                  const timeValue = i * 5 / timelineZoom;
                  const position = (timeValue / videoDuration) * 100;
                  if (position > 100) return null;
                  
                  return (
                    <div
                      key={i}
                      className="absolute text-xs text-gray-400 flex flex-col items-center"
                      style={{ left: `${position}%` }}
                    >
                      <div className="w-px h-2 bg-gray-600"></div>
                      <span className="mt-1">{formatTime(timeValue)}</span>
                    </div>
                  );
                })}
                
                {/* Playhead */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
                  style={{ left: `${(currentTime / videoDuration) * 100}%` }}
                >
                  <div className="absolute -top-1 -left-2 w-4 h-4 bg-red-500 rounded-full"></div>
                </div>
              </div>

              {/* Layer Tracks */}
              <div className="flex-1 overflow-y-auto overflow-x-auto">
                <div className="min-w-full" style={{ width: `${timelineZoom * 100}%` }}>
                  {Array.from({ length: Math.max(4, layers.length + 1) }, (_, trackIndex) => (
                    <div key={trackIndex} className="h-12 border-b border-gray-700 relative flex items-center">
                      {/* Track Label */}
                      <div className="w-24 h-full bg-gray-900 border-r border-gray-700 flex items-center px-2 text-xs text-gray-400 flex-shrink-0">
                        Track {trackIndex + 1}
                      </div>
                      
                      {/* Layer Items */}
                      <div className="flex-1 relative h-full">
                        {layers
                          .filter(layer => layer.track === trackIndex)
                          .map(layer => (
                            <div
                              key={layer.id}
                              onClick={(e) => handleLayerClick(layer.id, e)}
                              className={`absolute top-1 bottom-1 rounded cursor-pointer transition-all hover:opacity-80 border border-white/20 ${
                                selectedLayers.includes(layer.id)
                                  ? 'ring-2 ring-blue-400'
                                  : ''
                              } ${layer.locked ? 'opacity-50' : ''}`}
                              style={{
                                left: `${(layer.startTime / videoDuration) * 100}%`,
                                width: `${((layer.endTime - layer.startTime) / videoDuration) * 100}%`,
                                backgroundColor: layer.color,
                                opacity: layer.visible ? 0.8 : 0.3,
                                minWidth: '40px'
                              }}
                            >
                              <div className="h-full flex items-center px-2 text-xs text-white font-medium truncate">
                                <div className="flex items-center space-x-1">
                                  {layer.type === 'video' && <Film className="w-3 h-3 flex-shrink-0" />}
                                  {layer.type === 'audio' && <Music className="w-3 h-3 flex-shrink-0" />}
                                  {layer.type === 'text' && <Type className="w-3 h-3 flex-shrink-0" />}
                                  {layer.type === 'effect' && <Zap className="w-3 h-3 flex-shrink-0" />}
                                  <span className="truncate">{layer.name}</span>
                                </div>
                              </div>
                              
                              {/* Resize handles */}
                              <div className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/30 opacity-0 hover:opacity-100 transition-opacity"></div>
                              <div className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/30 opacity-0 hover:opacity-100 transition-opacity"></div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Layer Manager */}
        <div className="w-72 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="h-12 border-b border-gray-700 flex items-center justify-between px-4">
            <h3 className="text-sm font-semibold">Layers</h3>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  if (selectedLayers.length > 0) {
                    duplicateLayer(selectedLayers[0]);
                  }
                }}
                className="p-1 hover:bg-gray-700 rounded text-xs"
                disabled={selectedLayers.length === 0}
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  selectedLayers.forEach(deleteLayer);
                }}
                className="p-1 hover:bg-gray-700 rounded text-xs text-red-400"
                disabled={selectedLayers.length === 0}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {layers.map((layer, index) => (
              <div
                key={layer.id}
                onClick={(e) => handleLayerClick(layer.id, e)}
                className={`p-3 border-b border-gray-700 cursor-pointer transition-colors ${
                  selectedLayers.includes(layer.id)
                    ? 'bg-blue-600/20 border-blue-500'
                    : 'hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: layer.color }}
                  ></div>
                  
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{layer.name}</div>
                    <div className="text-xs text-gray-400">
                      {formatTime(layer.startTime)} - {formatTime(layer.endTime)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerVisibility(layer.id);
                      }}
                      className="p-1 hover:bg-gray-600 rounded"
                    >
                      {layer.visible ? (
                        <Eye className="w-3 h-3 text-gray-400" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerLock(layer.id);
                      }}
                      className="p-1 hover:bg-gray-600 rounded"
                    >
                      {layer.locked ? (
                        <Lock className="w-3 h-3 text-red-400" />
                      ) : (
                        <Unlock className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                {layer.type === 'audio' && layer.volume !== undefined && (
                  <div className="mt-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={layer.volume}
                      onChange={(e) => {
                        const newVolume = parseFloat(e.target.value);
                        setLayers(prev => prev.map(l => 
                          l.id === layer.id ? { ...l, volume: newVolume } : l
                        ));
                      }}
                      className="w-full h-1"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      Volume: {Math.round((layer.volume || 0) * 100)}%
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedLayers.length > 0 && (
            <div className="border-t border-gray-700 p-4">
              <h4 className="text-sm font-semibold mb-3">Layer Properties</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Opacity</label>
                  <input type="range" min="0" max="100" defaultValue="100" className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Blend Mode</label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs">
                    <option>Normal</option>
                    <option>Multiply</option>
                    <option>Screen</option>
                    <option>Overlay</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Chat Panel */}
        {showAIChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="h-12 border-b border-gray-700 flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-semibold">AI Assistant</h3>
              </div>
              <button
                onClick={() => setShowAIChat(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-line">{message.content}</div>
                    <div className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isAIProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-white p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-700 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask AI to help with your video..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim() || isAIProcessing}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1">
                {['Add text overlay', 'Apply vintage filter', 'Cut video here', 'Brighten video'].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setChatInput(suggestion)}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300 hover:text-white transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }

        input[type="range"]::-webkit-slider-track {
          background: rgba(255, 255, 255, 0.2);
          height: 8px;
          border-radius: 4px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          background: #2563eb;
        }

        input[type="range"]::-moz-range-track {
          background: rgba(255, 255, 255, 0.2);
          height: 8px;
          border-radius: 4px;
          border: none;
        }

        input[type="range"]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Selection styles */
        ::selection {
          background: rgba(59, 130, 246, 0.3);
        }

        /* Focus styles */
        button:focus,
        input:focus,
        select:focus {
          outline: 2px solid rgba(59, 130, 246, 0.5);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}