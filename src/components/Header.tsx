import React from 'react';
import './Header.css';

// Define the types for the props the Header component expects
interface HeaderProps {
  onConnectClick: () => void; // Function to call when the button is clicked
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'; // The current connection status
  account: string | null; // The connected account address, or null
  isOnboarded: boolean;
  onNavigate: (page: 'home' | 'upload') => void;
  currentPage: 'home' | 'upload';
}

// Destructure the props in the function signature
function Header({ onConnectClick, connectionStatus, account, isOnboarded, onNavigate, currentPage }: HeaderProps) {
  // Determine the button text and disabled state based on the connection status
  const buttonText = connectionStatus === 'connecting' ? 'Connecting...' : (account ? account : 'Connect Wallet');
  const isButtonDisabled = connectionStatus === 'connecting'; // Disable only while connecting

  return (
    <div className="sticky-header-wrapper">
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
          {/* Logo section */}
          <div className="logo-section">
            <div className="logo-container">
              <div className="logo-icon">
                <img src="/logo.png" width={70} alt="Logo" />
              </div>
            </div>
          </div>

          {/* Navigation icons */}
          <nav className="nav-icons">
            {/* Home Icon */}
            <button 
              className={`glass-icon-btn ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
              aria-label="Home"
            >
              <div className="icon-glow"></div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </button>

            {/* Upload Icon - Only show if connected and onboarded */}
            {connectionStatus === 'connected' && isOnboarded && (
              <button 
                className={`glass-icon-btn ${currentPage === 'upload' ? 'active' : ''}`}
                onClick={() => onNavigate('upload')}
                aria-label="Upload"
              >
                <div className="icon-glow"></div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,5 17,10"/>
                  <line x1="12" y1="5" x2="12" y2="15"/>
                </svg>
              </button>
            )}

            {/* Search Icon */}
            <button className="glass-icon-btn" aria-label="Search">
              <div className="icon-glow"></div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Notification Icon */}
            <button className="glass-icon-btn" aria-label="Notifications">
              <div className="icon-glow"></div>
              <div className="notification-dot"></div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
            </button>

            {/* Profile Icon */}
            <button className="glass-icon-btn profile-btn" aria-label="Profile">
              <div className="icon-glow"></div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </nav>

          {/* Connect Wallet Button */}
          <button
            className={`connect-wallet-btn ${connectionStatus}`}
            onClick={onConnectClick}
            disabled={isButtonDisabled}
          >
            <div className="btn-glow"></div>
            <div className="btn-content">
              {connectionStatus === 'connecting' && (
                <div className="loading-spinner"></div>
              )}
              <span>{buttonText}</span>
              {connectionStatus === 'connected' && (
                <div className="status-indicator connected"></div>
              )}
              {connectionStatus === 'error' && (
                <div className="status-indicator error"></div>
              )}
            </div>
          </button>
        </div>
      </header>
    </div>
  );
}

export default Header; 