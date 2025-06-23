'use client';

import Link from "next/link";
import { useState } from "react";
import { 
  Home, 
  TrendingUp, 
  Clock, 
  Heart, 
  Upload, 
  User, 
  Settings,
  Video,
  ChevronDown,
  BarChart3,
  Coins,
  TestTube
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { href: "/", icon: Home, label: "Home", id: "home" },
    { href: "/trending", icon: TrendingUp, label: "Trending", id: "trending" },
    { href: "/latest", icon: Clock, label: "Latest", id: "latest" },
    { href: "/liked", icon: Heart, label: "Liked", id: "liked" },
    { href: "/upload", icon: Upload, label: "Upload", id: "upload" },
    { href: "/profile", icon: User, label: "Profile", id: "profile" },
    { href: "/nfts", icon: Video, label: "NFTs", id: "nfts" },
  ];

  const advancedItems = [
    { href: "/test-flow", icon: TestTube, label: "Platform Test" },
    { href: "/dashboard", icon: BarChart3, label: "Analytics" },
    { href: "/creator-tokens", icon: Coins, label: "Creator Tokens" },
  ];

  return (
    <>
      <style jsx>{`
        .glass-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 260px;
          height: 100vh;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          z-index: 1000;
          overflow: visible;
          transform: ${isOpen ? 'translateX(0)' : 'translateX(-110%)'};
          animation: none;
        }
        .glass-sidebar .sidebar-animated-border,
        .sidebar-bubble,
        .sidebar-bubble-1,
        .sidebar-bubble-2,
        .sidebar-bubble-3,
        .ice-cube-edge {
          display: none !important;
        }
        .glass-sidebar .sidebar-animated-border {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          border-radius: 32px;
          border: 3px solid transparent;
          background: linear-gradient(120deg, #a855f7 0%, #0ea5e9 100%) border-box;
          mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          animation: borderGlow 3s linear infinite;
        }
        @keyframes borderGlow {
          0% { filter: blur(0px) brightness(1); }
          50% { filter: blur(2px) brightness(1.2); }
          100% { filter: blur(0px) brightness(1); }
        }
        .sidebar-bubble {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(24px);
          opacity: 0.7;
          z-index: 1;
        }
        .sidebar-bubble-1 {
          width: 120px; height: 120px; top: 10%; left: -40px;
          background: radial-gradient(circle, #a855f7 0%, transparent 80%);
          animation: float1 8s ease-in-out infinite;
        }
        .sidebar-bubble-2 {
          width: 80px; height: 80px; top: 60%; right: -30px;
          background: radial-gradient(circle, #0ea5e9 0%, transparent 80%);
          animation: float2 10s ease-in-out infinite reverse;
        }
        .sidebar-bubble-3 {
          width: 100px; height: 100px; bottom: 10%; left: 60%;
          background: radial-gradient(circle, #f472b6 0%, transparent 80%);
          animation: float3 12s ease-in-out infinite;
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }

        .ice-cube-edge {
          position: absolute;
          top: 0;
          right: 0;
          width: 3px;
          height: 100%;
          background: linear-gradient(180deg,
            rgba(147, 197, 253, 0.8) 0%,
            rgba(139, 92, 246, 0.7) 25%,
            rgba(168, 85, 247, 0.8) 50%,
            rgba(217, 70, 239, 0.7) 75%,
            rgba(147, 197, 253, 0.8) 100%
          );
          box-shadow: 
            0 0 20px rgba(147, 197, 253, 0.4),
            inset 1px 0 0 rgba(255, 255, 255, 0.3);
          animation: ice-pulse 3s ease-in-out infinite;
        }

        @keyframes ice-pulse {
          0%, 100% { opacity: 0.6; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.02); }
        }

        /* Enhanced distortion layers with 3D perspective */
        .sidebar-distortion-layer-1,
        .sidebar-distortion-layer-2,
        .sidebar-distortion-layer-3 {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.08) 50%, transparent 70%);
          animation: distortion-3d 10s ease-in-out infinite;
          pointer-events: none;
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .sidebar-distortion-layer-2 {
          background: linear-gradient(-45deg, transparent 30%, rgba(139, 92, 246, 0.12) 50%, transparent 70%);
          animation-delay: -3s;
        }

        .sidebar-distortion-layer-3 {
          background: linear-gradient(90deg, transparent 30%, rgba(217, 70, 239, 0.1) 50%, transparent 70%);
          animation-delay: -6s;
        }

        @keyframes distortion-3d {
          0%, 100% {
            transform: translateX(-100%) skewX(-12deg) rotateY(-2deg);
          }
          33% {
            transform: translateX(0%) skewX(0deg) rotateY(0deg);
          }
          66% {
            transform: translateX(100%) skewX(12deg) rotateY(2deg);
          }
        }

        /* 3D Ice crystal bubbles */
        .sidebar-blur-bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(ellipse at 30% 30%, 
            rgba(147, 197, 253, 0.4) 0%, 
            rgba(139, 92, 246, 0.3) 35%,
            rgba(217, 70, 239, 0.25) 70%, 
            transparent 100%
          );
          filter: blur(15px);
          animation: ice-float 8s ease-in-out infinite;
          pointer-events: none;
          box-shadow: 
            inset 0 0 20px rgba(255, 255, 255, 0.1),
            0 0 30px rgba(139, 92, 246, 0.2);
          transform-style: preserve-3d;
        }

        .sidebar-blur-bubble-1 {
          width: 180px;
          height: 180px;
          top: 15%;
          left: -60px;
          animation-delay: 0s;
        }

        .sidebar-blur-bubble-2 {
          width: 120px;
          height: 120px;
          top: 55%;
          right: -40px;
          animation-delay: -3s;
        }

        .sidebar-blur-bubble-3 {
          width: 80px;
          height: 80px;
          top: 85%;
          left: -20px;
          animation-delay: -6s;
        }

        @keyframes ice-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotateZ(0deg) scale(1);
          }
          33% {
            transform: translateY(-15px) translateX(5px) rotateZ(120deg) scale(1.05);
          }
          66% {
            transform: translateY(-8px) translateX(-3px) rotateZ(240deg) scale(0.95);
          }
        }

        .sidebar-content {
          position: relative;
          height: 100%;
          padding: 1.5rem 1rem;
          z-index: 10;
          perspective: 1000px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .glass-nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.75rem 1rem;
          background: 
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.12) 0%,
              rgba(255, 255, 255, 0.08) 50%,
              rgba(255, 255, 255, 0.05) 100%
            );
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 14px;
          color: rgba(255, 255, 255, 0.85);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          overflow: hidden;
          text-decoration: none;
          transform-style: preserve-3d;
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1),
            0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .glass-nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg,
            rgba(147, 197, 253, 0.15) 0%,
            rgba(139, 92, 246, 0.12) 50%,
            rgba(217, 70, 239, 0.1) 100%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: inherit;
        }

        .glass-nav-item::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg,
            transparent 40%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 60%
          );
          transform: translateX(-100%) translateY(-100%) rotate(45deg);
          transition: transform 0.6s ease;
        }

        .glass-nav-item:hover {
          background: 
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.18) 0%,
              rgba(255, 255, 255, 0.12) 50%,
              rgba(255, 255, 255, 0.08) 100%
            );
          border-color: rgba(139, 92, 246, 0.4);
          color: white;
          transform: translateY(-3px) translateX(2px) rotateX(2deg);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1),
            0 8px 25px rgba(139, 92, 246, 0.25),
            0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .glass-nav-item:hover::before {
          opacity: 1;
        }

        .glass-nav-item:hover::after {
          transform: translateX(100%) translateY(100%) rotate(45deg);
        }

        .glass-nav-item:active {
          transform: translateY(-1px) translateX(1px) rotateX(1deg) scale(0.98);
        }

        .nav-icon-container {
          position: relative;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: 
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.05) 100%
            );
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.4s ease;
          transform-style: preserve-3d;
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .glass-nav-item:hover .nav-icon-container {
          background: 
            linear-gradient(135deg, 
              rgba(147, 197, 253, 0.2) 0%,
              rgba(139, 92, 246, 0.15) 100%
            );
          border-color: rgba(139, 92, 246, 0.3);
          transform: rotateY(5deg) rotateX(-5deg);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 4px 12px rgba(139, 92, 246, 0.2);
        }

        .nav-icon {
          width: 18px;
          height: 18px;
          z-index: 2;
          position: relative;
          transition: all 0.4s ease;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }

        .glass-nav-item:hover .nav-icon {
          transform: scale(1.1) rotateZ(5deg);
          filter: drop-shadow(0 2px 8px rgba(139, 92, 246, 0.4));
        }

        .nav-label {
          font-weight: 600;
          font-size: 0.875rem;
          z-index: 2;
          position: relative;
          letter-spacing: 0.025em;
          transition: all 0.4s ease;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .glass-nav-item:hover .nav-label {
          text-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
          transform: translateX(2px);
        }

        .advanced-toggle {
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }

        .nav-arrow {
          margin-left: auto;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          z-index: 2;
          position: relative;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }

        .nav-arrow.rotate {
          transform: rotate(180deg) scale(1.1);
          filter: drop-shadow(0 2px 6px rgba(139, 92, 246, 0.4));
        }

        .advanced-features {
          margin-top: 0.5rem;
          margin-left: 1rem;
          overflow: hidden;
          animation: slideDown 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          border-left: 2px solid rgba(139, 92, 246, 0.3);
          padding-left: 0.75rem;
          position: relative;
        }

        .advanced-features::before {
          content: '';
          position: absolute;
          left: -2px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom,
            rgba(147, 197, 253, 0.8),
            rgba(139, 92, 246, 0.8),
            rgba(217, 70, 239, 0.8)
          );
          animation: glow-line 2s ease-in-out infinite;
        }

        @keyframes glow-line {
          0%, 100% { box-shadow: 0 0 5px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 15px rgba(139, 92, 246, 0.6); }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-15px) rotateX(-10deg);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
            max-height: 250px;
          }
        }

        .glass-nav-sub-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.875rem;
          margin-bottom: 0.25rem;
          border-radius: 10px;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8125rem;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          position: relative;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          transform-style: preserve-3d;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .glass-nav-sub-item:hover {
          background: rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.95);
          transform: translateX(6px) translateY(-1px) rotateX(1deg);
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 4px 12px rgba(139, 92, 246, 0.15);
        }

        .sub-item-icon {
          width: 16px;
          height: 16px;
          opacity: 0.8;
          transition: all 0.3s ease;
          filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
        }

        .glass-nav-sub-item:hover .sub-item-icon {
          opacity: 1;
          transform: scale(1.1) rotateZ(3deg);
          filter: drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3));
        }

        /* Notification dot with ice effect */
        .notification-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #ff1493 0%, #ff69b4 100%);
          border-radius: 50%;
          animation: ice-pulse-dot 2s ease-in-out infinite;
          z-index: 3;
          box-shadow: 
            0 0 8px rgba(255, 20, 147, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        @keyframes ice-pulse-dot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 8px rgba(255, 20, 147, 0.6);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.3);
            box-shadow: 0 0 15px rgba(255, 20, 147, 0.8);
          }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .glass-sidebar {
            width: 100%;
            max-width: 300px;
          }
          
          .sidebar-content {
            padding: 1.25rem 0.875rem;
          }
          
          .glass-nav-item {
            padding: 0.625rem 0.875rem;
          }
          
          .nav-icon-container {
            width: 24px;
            height: 24px;
          }
          
          .nav-icon {
            width: 16px;
            height: 16px;
          }
          
          .nav-label {
            font-size: 0.8125rem;
          }
        }
      `}</style>

      <aside className="glass-sidebar">
        <div className="sidebar-animated-border"></div>
        <div className="sidebar-bubble sidebar-bubble-1"></div>
        <div className="sidebar-bubble sidebar-bubble-2"></div>
        <div className="sidebar-bubble sidebar-bubble-3"></div>
        {/* Ice cube edge */}
        <div className="ice-cube-edge"></div>
        
        {/* Enhanced 3D distortion layers */}
        <div className="sidebar-distortion-layer-1"></div>
        <div className="sidebar-distortion-layer-2"></div>
        <div className="sidebar-distortion-layer-3"></div>
        
        {/* 3D Ice crystal bubbles */}
        <div className="sidebar-blur-bubble sidebar-blur-bubble-1"></div>
        <div className="sidebar-blur-bubble sidebar-blur-bubble-2"></div>
        <div className="sidebar-blur-bubble sidebar-blur-bubble-3"></div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="glass-nav-item"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="nav-icon-container">
                  <item.icon className="nav-icon" />
                </div>
                <span className="nav-label">{item.label}</span>
                {item.id === 'upload' && <div className="notification-dot"></div>}
              </Link>
            ))}

            <button
              onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
              className="glass-nav-item advanced-toggle"
              onMouseEnter={() => setHoveredItem('advanced')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="nav-icon-container">
                <Settings className="nav-icon" />
              </div>
              <span className="nav-label">Advanced</span>
              <ChevronDown className={`nav-arrow ${showAdvancedFeatures ? 'rotate' : ''}`} size={16} />
            </button>

            {showAdvancedFeatures && (
              <div className="advanced-features">
                {advancedItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="glass-nav-sub-item"
                  >
                    <item.icon className="sub-item-icon" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}