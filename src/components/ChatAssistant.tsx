'use client';

import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatAssistantProps {
  className?: string;
}

export default function ChatAssistant({ className = "" }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI editing assistant. I can help you with video edits like trimming, adding effects, or adjusting timing. What would you like to do?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const aiResponses = {
    'trim': 'I\'ll help you trim the video. How many seconds would you like to remove from the beginning or end?',
    'fade': 'I can add fade effects. Would you like a fade in, fade out, or both?',
    'speed': 'I can adjust the playback speed. Should I make it faster or slower?',
    'effect': 'I can add various effects like filters, transitions, or overlays. What type of effect are you looking for?',
    'cut': 'I\'ll help you cut the video. At what timestamp would you like to make the cut?',
    'default': 'I understand you want to edit the video. Could you be more specific about what changes you\'d like me to make?'
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('trim')) return aiResponses.trim;
    if (input.includes('fade')) return aiResponses.fade;
    if (input.includes('speed') || input.includes('fast') || input.includes('slow')) return aiResponses.speed;
    if (input.includes('effect') || input.includes('filter')) return aiResponses.effect;
    if (input.includes('cut')) return aiResponses.cut;
    
    return aiResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getAIResponse(inputValue),
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg flex flex-col h-full ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-800">AI Editing Assistant</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start space-x-2">
                {!message.isUser && <Bot className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />}
                <div className="flex-1">
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.isUser && <User className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to edit your video..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Try: "trim last 3 seconds", "add fade in", "make it faster"
        </div>
      </div>
    </div>
  );
} 