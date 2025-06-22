'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNetworkWarning, setShowNetworkWarning] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);

  const { address, isConnected, status } = useAccount();
  const { connect, isPending: isConnectPending } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Get current chain ID from window.ethereum
    const getCurrentChainId = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setCurrentChainId(parseInt(chainId, 16));
        } catch (error) {
          // Suppress network-related errors
        }
      }
    };

    if (isConnected) {
      getCurrentChainId();
      
      // Listen for chain changes
      if (window.ethereum) {
        window.ethereum.on('chainChanged', (chainId: string) => {
          setCurrentChainId(parseInt(chainId, 16));
        });
      }
    }
  }, [isConnected]);

  useEffect(() => {
    // Check if we're on the correct network
    if (isConnected && currentChainId) {
      const targetChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '31337');
      if (currentChainId !== targetChainId) {
        setShowNetworkWarning(true);
      } else {
        setShowNetworkWarning(false);
      }
    }
  }, [isConnected, currentChainId]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await connect({
        connector: injected(),
      });
    } catch (err) {
      // Suppress connection errors
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setError(null);
    setShowNetworkWarning(false);
    setCurrentChainId(null);
  };

  const handleSwitchNetwork = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const targetChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '31337');
        const hexChainId = '0x' + targetChainId.toString(16);
        
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexChainId }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          // Chain not added, add it
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x' + parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '31337').toString(16),
                chainName: 'Local Hardhat',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545'],
                blockExplorerUrls: []
              }]
            });
          } catch (addError) {
            // Suppress network addition errors
            setError('Failed to add network to MetaMask');
          }
        } else {
          // Suppress network switch errors
          setError('Failed to switch network');
        }
      }
    }
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 137: return 'Polygon';
      case 80001: return 'Mumbai Testnet';
      case 31337: return 'Local Hardhat';
      default: return `Chain ${chainId}`;
    }
  };

  const getNetworkColor = (chainId: number) => {
    switch (chainId) {
      case 1: return 'bg-blue-500';
      case 137: return 'bg-purple-500';
      case 80001: return 'bg-pink-500';
      case 31337: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (isConnected) {
    return (
      <div className="relative">
        <div className="flex items-center space-x-2">
          {/* Network Indicator */}
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getNetworkColor(currentChainId || 0)}`}></div>
            <span className="text-xs text-gray-600 hidden sm:inline">
              {currentChainId ? getNetworkName(currentChainId) : 'Unknown Network'}
            </span>
          </div>

          {/* Address Display */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <button
              onClick={handleDisconnect}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Disconnect"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Network Warning */}
        {showNetworkWarning && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-lg z-50">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-800">Wrong Network</h4>
                <p className="text-xs text-yellow-700 mt-1">
                  Please switch to the correct network to use the platform.
                </p>
                <button
                  onClick={handleSwitchNetwork}
                  className="mt-2 text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors"
                >
                  Switch Network
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleConnect}
        disabled={isConnecting || isConnectPending}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        {isConnecting || isConnectPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Connect Wallet</span>
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg z-50">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800">Connection Error</h4>
              <p className="text-xs text-red-700 mt-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 