'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/providers/Web3Provider";
import WalletConnectWrapper from "@/components/WalletConnectWrapper";
import VideoSearch from "@/components/VideoSearch";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useState } from "react";
import { 
  Home, 
  TrendingUp, 
  Clock, 
  Heart, 
  Upload as UploadIcon, 
  User, 
  Settings,
  Menu,
  Search,
  Bell,
  Video,
  Grid3X3
} from "lucide-react";
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <title>Gebo - Web3 Video Platform</title>
        <meta name="description" content="Upload, enhance, and mint videos as NFTs on Polygon Superchain" />
      </head>
      <body className={inter.className}>
        <Web3Provider>
          {/* Top Header - Glassmorphism Style (Overlay) */}
          {pathname !== '/manual-edit' && (
            <div className="fixed-header-wrapper">
              <header className="glass-header">
                {/* Distortion layers for extreme glassmorphism */}
                <div className="distortion-layer-1"></div>
                <div className="distortion-layer-2"></div>
                <div className="distortion-layer-3"></div>
                
                {/* Background blur bubbles */}
                <div className="blur-bubble blur-bubble-1"></div>
                <div className="blur-bubble blur-bubble-2"></div>
                <div className="blur-bubble blur-bubble-3"></div>
                
                {/* Header content */}
                <div className="header-content">
                  {/* Left Section */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="glass-icon-btn"
                    >
                      <div className="icon-glow"></div>
                      <Menu className="w-5 h-5" />
                    </button>
                    <Link href="/" className="logo-section">
                      <div className="logo-container">
                        <div className="logo-icon flex items-center justify-center">
                          <img 
                            src="/logo.png" 
                            alt="Logo" 
                            style={{ height: 40, width: 'auto' }}
                            className="object-contain rounded-lg mx-auto"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center hidden">
                            <span className="text-white font-bold text-sm">G</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Center Section - Search */}
                  <div className="flex-1 max-w-2xl mx-8">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search videos..."
                        onClick={() => setIsSearchOpen(true)}
                        className="w-full px-4 py-2 pl-10 pr-12 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                        readOnly
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700/50 backdrop-blur-sm p-1 rounded-full hover:bg-gray-600/50 text-gray-300">
                        <Video className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center space-x-4">
                    <button className="glass-icon-btn">
                      <div className="icon-glow"></div>
                      <Bell className="w-5 h-5" />
                    </button>
                    <button className="glass-icon-btn">
                      <div className="icon-glow"></div>
                      <Grid3X3 className="w-5 h-5" />
                    </button>
                    <WalletConnectWrapper />
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      U
                    </div>
                  </div>
                </div>
              </header>
            </div>
          )}

          {/* Sidebar - Glassmorphism Style (Overlay) */}
          <Sidebar isOpen={sidebarOpen} />

          {/* Main Content */}
          <main className="transition-all duration-300 min-h-screen bg-black">
            {children}
          </main>

          <VideoSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </Web3Provider>
      </body>
    </html>
  );
}
