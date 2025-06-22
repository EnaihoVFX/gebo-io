'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  Triangle
} from 'lucide-react';
import ChatAssistant from '@/components/ChatAssistant';

interface VideoSegment {
  id: string;
  startTime: number;
  endTime: number;
  type: 'video' | 'text' | 'image' | 'audio';
  content: any;
  filters: string[];
  volume: number;
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

export default function ManualEditPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [videoFileName, setVideoFileName] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [activeTab, setActiveTab] = useState('trim');
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [timelineScale, setTimelineScale] = useState(1);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  const filters = [
    { name: 'None', value: '' },
    { name: 'Vintage', value: 'sepia(0.5) hue-rotate(30deg)' },
    { name: 'Black & White', value: 'grayscale(1)' },
    { name: 'Warm', value: 'sepia(0.3) brightness(1.1)' },
    { name: 'Cool', value: 'hue-rotate(180deg) saturate(1.2)' },
    { name: 'Dramatic', value: 'contrast(1.3) brightness(0.9)' },
    { name: 'Bright', value: 'brightness(1.2) saturate(1.1)' },
    { name: 'Fade', value: 'opacity(0.8)' }
  ];

  useEffect(() => {
    const videoData = sessionStorage.getItem('uploadedVideo');
    if (videoData) {
      const parsed = JSON.parse(videoData);
      setVideoFileName(parsed.name);
    } else {
      router.push('/upload');
    }
  }, [router]);

  const generateMockVideoUrl = () => {
    const fileInMemory = (window as any).__uploadedVideoFile;
    if (fileInMemory) {
      return URL.createObjectURL(fileInMemory);
    }
    
    const videoData = sessionStorage.getItem('uploadedVideo');
    if (videoData) {
      try {
        const parsed = JSON.parse(videoData);
        return parsed.preview || 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
      } catch (error) {
        console.error('Error parsing video data:', error);
        return 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
      }
    }
    return 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      setTrimEnd(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
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

  const handleTrimChange = (type: 'start' | 'end', value: number) => {
    if (type === 'start') {
      setTrimStart(Math.min(value, trimEnd - 1));
    } else {
      setTrimEnd(Math.max(value, trimStart + 1));
    }
  };

  const addTextOverlay = () => {
    const newText: TextOverlay = {
      id: `text-${Date.now()}`,
      text: 'Sample Text',
      startTime: currentTime,
      endTime: currentTime + 5,
      position: { x: 50, y: 50 },
      style: {
        fontSize: 24,
        color: '#ffffff',
        fontFamily: 'Arial',
        bold: false,
        italic: false
      }
    };
    setTextOverlays([...textOverlays, newText]);
    setSelectedTextId(newText.id);
    setShowTextEditor(true);
  };

  const updateTextOverlay = (id: string, updates: Partial<TextOverlay>) => {
    setTextOverlays(textOverlays.map(text => 
      text.id === id ? { ...text, ...updates } : text
    ));
  };

  const deleteTextOverlay = (id: string) => {
    setTextOverlays(textOverlays.filter(text => text.id !== id));
    setShowTextEditor(false);
    setSelectedTextId(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVideoFilterStyle = () => {
    const filterStyle = selectedFilter;
    const brightnessStyle = `brightness(${brightness}%)`;
    const contrastStyle = `contrast(${contrast}%)`;
    const saturationStyle = `saturate(${saturation}%)`;
    
    return `${filterStyle} ${brightnessStyle} ${contrastStyle} ${saturationStyle}`;
  };

  const handleDone = () => {
    const editSettings = {
      trimStart,
      trimEnd,
      filter: selectedFilter,
      brightness,
      contrast,
      saturation,
      volume,
      textOverlays
    };
    
    sessionStorage.setItem('editSettings', JSON.stringify(editSettings));
    router.push('/mint');
  };

  const saveToHistory = (action: string) => {
    const state = {
      trimStart,
      trimEnd,
      selectedFilter,
      brightness,
      contrast,
      saturation,
      textOverlays: [...textOverlays],
      action
    };
    setUndoStack([...undoStack, state]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack[undoStack.length - 1];
      const newUndoStack = undoStack.slice(0, -1);
      setRedoStack([...redoStack, {
        trimStart,
        trimEnd,
        selectedFilter,
        brightness,
        contrast,
        saturation,
        textOverlays: [...textOverlays]
      }]);
      setUndoStack(newUndoStack);
      
      setTrimStart(lastState.trimStart);
      setTrimEnd(lastState.trimEnd);
      setSelectedFilter(lastState.selectedFilter);
      setBrightness(lastState.brightness);
      setContrast(lastState.contrast);
      setSaturation(lastState.saturation);
      setTextOverlays(lastState.textOverlays);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      const newRedoStack = redoStack.slice(0, -1);
      setUndoStack([...undoStack, {
        trimStart,
        trimEnd,
        selectedFilter,
        brightness,
        contrast,
        saturation,
        textOverlays: [...textOverlays]
      }]);
      setRedoStack(newRedoStack);
      
      setTrimStart(nextState.trimStart);
      setTrimEnd(nextState.trimEnd);
      setSelectedFilter(nextState.selectedFilter);
      setBrightness(nextState.brightness);
      setContrast(nextState.contrast);
      setSaturation(nextState.saturation);
      setTextOverlays(nextState.textOverlays);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Manual Video Editor</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>{videoFileName}</span>
              <span>•</span>
              <span>{formatTime(videoDuration)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={undo}
              disabled={undoStack.length === 0}
              className="p-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={redoStack.length === 0}
              className="p-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              <Redo className="w-4 h-4" />
            </button>
            <button
              onClick={handleDone}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview */}
          <div className="flex-1 bg-black relative">
            <video
              ref={videoRef}
              src={generateMockVideoUrl()}
              className="w-full h-full object-contain"
              onLoadedMetadata={handleVideoLoad}
              onTimeUpdate={handleTimeUpdate}
              style={{ filter: getVideoFilterStyle() }}
              controls
              muted={isMuted}
              volume={volume}
            />
            
            {/* Text Overlays */}
            {textOverlays.map(overlay => (
              <div
                key={overlay.id}
                className={`absolute cursor-move ${
                  currentTime >= overlay.startTime && currentTime <= overlay.endTime ? 'block' : 'hidden'
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
                onClick={() => {
                  setSelectedTextId(overlay.id);
                  setShowTextEditor(true);
                }}
              >
                {overlay.text}
              </div>
            ))}

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-gray-300"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max={videoDuration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="text-sm text-white">
                  {formatTime(currentTime)} / {formatTime(videoDuration)}
                </div>
                
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-gray-300"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-32 bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Timeline</h3>
              <div className="flex items-center space-x-2">
                <button className="text-xs bg-gray-700 px-2 py-1 rounded">-</button>
                <span className="text-xs">{timelineScale}x</span>
                <button className="text-xs bg-gray-700 px-2 py-1 rounded">+</button>
              </div>
            </div>
            
            <div className="relative h-16 bg-gray-900 rounded border border-gray-600">
              {/* Timeline ruler */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-gray-700 border-b border-gray-600">
                {Array.from({ length: Math.ceil(videoDuration) }, (_, i) => (
                  <div
                    key={i}
                    className="absolute text-xs text-gray-400"
                    style={{ left: `${(i / videoDuration) * 100}%` }}
                  >
                    {i}
                  </div>
                ))}
              </div>
              
              {/* Video track */}
              <div className="absolute top-4 left-0 right-0 h-8 bg-gray-800 border border-gray-600 rounded">
                <div
                  className="h-full bg-blue-600 relative"
                  style={{
                    left: `${(trimStart / videoDuration) * 100}%`,
                    width: `${((trimEnd - trimStart) / videoDuration) * 100}%`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-50"></div>
            </div>
              </div>
              
              {/* Text tracks */}
              {textOverlays.map(overlay => (
                <div
                  key={overlay.id}
                  className="absolute top-12 left-0 right-0 h-4 bg-gray-800 border border-gray-600 rounded"
                  style={{
                    left: `${(overlay.startTime / videoDuration) * 100}%`,
                    width: `${((overlay.endTime - overlay.startTime) / videoDuration) * 100}%`
                  }}
                >
                  <div className="h-full bg-green-600 rounded flex items-center justify-center text-xs">
                    T
                  </div>
                </div>
              ))}
              
              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                style={{ left: `${(currentTime / videoDuration) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tools Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Tool Tabs */}
          <div className="flex border-b border-gray-700">
            {[
              { id: 'trim', icon: Scissors, label: 'Trim' },
              { id: 'filters', icon: Palette, label: 'Filters' },
              { id: 'text', icon: Type, label: 'Text' },
              { id: 'audio', icon: Music, label: 'Audio' },
              { id: 'effects', icon: Zap, label: 'Effects' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 p-3 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mx-auto mb-1" />
                {tab.label}
              </button>
            ))}
        </div>

          {/* Tool Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'trim' && (
              <div className="space-y-4">
                <h3 className="font-medium">Video Trimming</h3>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Start: {formatTime(trimStart)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={videoDuration}
                    value={trimStart}
                    onChange={(e) => {
                      handleTrimChange('start', parseFloat(e.target.value));
                      saveToHistory('trim-start');
                    }}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    End: {formatTime(trimEnd)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={videoDuration}
                    value={trimEnd}
                    onChange={(e) => {
                      handleTrimChange('end', parseFloat(e.target.value));
                      saveToHistory('trim-end');
                    }}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="bg-gray-700 rounded p-3">
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span className="text-blue-400">{formatTime(trimEnd - trimStart)}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setTrimStart(0);
                      setTrimEnd(videoDuration);
                      saveToHistory('reset-trim');
                    }}
                    className="flex-1 px-3 py-2 bg-gray-700 text-sm rounded hover:bg-gray-600"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => {
                      setTrimStart(1);
                      setTrimEnd(videoDuration - 1);
                      saveToHistory('quick-trim');
                    }}
                    className="flex-1 px-3 py-2 bg-blue-600 text-sm rounded hover:bg-blue-700"
                  >
                    Quick Trim
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'filters' && (
              <div className="space-y-4">
                <h3 className="font-medium">Video Filters</h3>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Filter</label>
                  <select
                    value={selectedFilter}
                    onChange={(e) => {
                      setSelectedFilter(e.target.value);
                      saveToHistory('filter');
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                  >
                    {filters.map(filter => (
                      <option key={filter.name} value={filter.value}>
                        {filter.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Brightness: {brightness}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => {
                      setBrightness(parseInt(e.target.value));
                      saveToHistory('brightness');
                    }}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Contrast: {contrast}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => {
                      setContrast(parseInt(e.target.value));
                      saveToHistory('contrast');
                    }}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Saturation: {saturation}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => {
                      setSaturation(parseInt(e.target.value));
                      saveToHistory('saturation');
                    }}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Text Overlays</h3>
                  <button
                    onClick={addTextOverlay}
                    className="px-3 py-1 bg-blue-600 text-sm rounded hover:bg-blue-700"
                  >
                    Add Text
                  </button>
                </div>

                {textOverlays.map(overlay => (
                  <div
                    key={overlay.id}
                    className={`p-3 rounded border cursor-pointer ${
                      selectedTextId === overlay.id
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-600 bg-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedTextId(overlay.id);
                      setShowTextEditor(true);
                    }}
                  >
                    <div className="text-sm font-medium">{overlay.text}</div>
                    <div className="text-xs text-gray-400">
                      {formatTime(overlay.startTime)} - {formatTime(overlay.endTime)}
                    </div>
                  </div>
                ))}

                {showTextEditor && selectedTextId && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-96">
                      <h3 className="font-medium mb-4">Edit Text</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Text</label>
                          <input
                            type="text"
                            value={textOverlays.find(t => t.id === selectedTextId)?.text || ''}
                            onChange={(e) => updateTextOverlay(selectedTextId, { text: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Start Time</label>
                            <input
                              type="number"
                              step="0.1"
                              value={textOverlays.find(t => t.id === selectedTextId)?.startTime || 0}
                              onChange={(e) => updateTextOverlay(selectedTextId, { startTime: parseFloat(e.target.value) })}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">End Time</label>
                            <input
                              type="number"
                              step="0.1"
                              value={textOverlays.find(t => t.id === selectedTextId)?.endTime || 0}
                              onChange={(e) => updateTextOverlay(selectedTextId, { endTime: parseFloat(e.target.value) })}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Font Size</label>
                          <input
                            type="range"
                            min="12"
                            max="72"
                            value={textOverlays.find(t => t.id === selectedTextId)?.style.fontSize || 24}
                            onChange={(e) => updateTextOverlay(selectedTextId, { 
                              style: { 
                                ...textOverlays.find(t => t.id === selectedTextId)?.style!,
                                fontSize: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Color</label>
                          <input
                            type="color"
                            value={textOverlays.find(t => t.id === selectedTextId)?.style.color || '#ffffff'}
                            onChange={(e) => updateTextOverlay(selectedTextId, { 
                              style: { 
                                ...textOverlays.find(t => t.id === selectedTextId)?.style!,
                                color: e.target.value
                              }
                            })}
                            className="w-full h-10 bg-gray-700 border border-gray-600 rounded"
                          />
            </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowTextEditor(false)}
                            className="flex-1 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600"
                          >
                            Close
                          </button>
              <button
                            onClick={() => deleteTextOverlay(selectedTextId)}
                            className="flex-1 px-3 py-2 bg-red-600 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-4">
                <h3 className="font-medium">Audio Controls</h3>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Volume: {Math.round(volume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="bg-gray-700 rounded p-3">
                  <div className="text-sm text-gray-400 mb-2">Audio Effects</div>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 bg-gray-600 rounded hover:bg-gray-500 text-sm">
                      Fade In
                    </button>
                    <button className="w-full text-left px-3 py-2 bg-gray-600 rounded hover:bg-gray-500 text-sm">
                      Fade Out
                    </button>
                    <button className="w-full text-left px-3 py-2 bg-gray-600 rounded hover:bg-gray-500 text-sm">
                      Normalize
              </button>
            </div>
          </div>
              </div>
            )}

            {activeTab === 'effects' && (
              <div className="space-y-4">
                <h3 className="font-medium">Video Effects</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-3 bg-gray-700 rounded hover:bg-gray-600 text-sm">
                    <Zap className="w-4 h-4 mx-auto mb-1" />
                    Transitions
                  </button>
                  <button className="p-3 bg-gray-700 rounded hover:bg-gray-600 text-sm">
                    <Layers className="w-4 h-4 mx-auto mb-1" />
                    Overlays
                  </button>
                  <button className="p-3 bg-gray-700 rounded hover:bg-gray-600 text-sm">
                    <Image className="w-4 h-4 mx-auto mb-1" />
                    Stickers
                  </button>
                  <button className="p-3 bg-gray-700 rounded hover:bg-gray-600 text-sm">
                    <Music className="w-4 h-4 mx-auto mb-1" />
                    Background Music
                  </button>
                </div>

                <div className="bg-gray-700 rounded p-3">
                  <div className="text-sm text-gray-400 mb-2">Coming Soon</div>
                  <div className="text-xs text-gray-500">
                    Advanced effects like motion tracking, green screen, and 3D effects will be available in future updates.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 