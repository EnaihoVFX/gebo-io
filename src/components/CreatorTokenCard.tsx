'use client';

import { useState, useEffect } from 'react';
import { creatorTokenService, CreatorTokenInfo } from '@/utils/creatorTokenService';

interface CreatorTokenCardProps {
  creatorAddress: string;
  showInvestorData?: boolean;
  onToggleInvestorData?: () => void;
}

export default function CreatorTokenCard({ 
  creatorAddress, 
  showInvestorData = false,
  onToggleInvestorData 
}: CreatorTokenCardProps) {
  const [tokenInfo, setTokenInfo] = useState<CreatorTokenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [buying, setBuying] = useState(false);
  const [selling, setSelling] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  useEffect(() => {
    loadTokenInfo();
    getConnectedAddress();
  }, [creatorAddress]);

  const loadTokenInfo = async () => {
    setLoading(true);
    try {
      const info = await creatorTokenService.getCreatorTokenInfo(creatorAddress, connectedAddress || undefined);
      setTokenInfo(info);
    } catch (error) {
      console.error('Failed to load token info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConnectedAddress = async () => {
    const address = await creatorTokenService.getConnectedAddress();
    setConnectedAddress(address);
  };

  const handleBuyTokens = async () => {
    if (!buyAmount || !tokenInfo) return;
    
    setBuying(true);
    try {
      const success = await creatorTokenService.buyCreatorTokens(creatorAddress, parseFloat(buyAmount));
      if (success) {
        alert('Tokens purchased successfully!');
        setBuyAmount('');
        await loadTokenInfo();
      } else {
        alert('Failed to purchase tokens. Please try again.');
      }
    } catch (error) {
      console.error('Buy error:', error);
      alert('Failed to purchase tokens. Please try again.');
    } finally {
      setBuying(false);
    }
  };

  const handleSellTokens = async () => {
    if (!sellAmount || !tokenInfo) return;
    
    setSelling(true);
    try {
      const success = await creatorTokenService.sellCreatorTokens(creatorAddress, parseFloat(sellAmount));
      if (success) {
        alert('Tokens sold successfully!');
        setSellAmount('');
        await loadTokenInfo();
      } else {
        alert('Failed to sell tokens. Please try again.');
      }
    } catch (error) {
      console.error('Sell error:', error);
      alert('Failed to sell tokens. Please try again.');
    } finally {
      setSelling(false);
    }
  };

  const handleRegisterCreator = async () => {
    if (!tokenInfo) return;
    
    try {
      const success = await creatorTokenService.registerCreator(
        tokenInfo.creator.name,
        tokenInfo.creator.symbol,
        tokenInfo.creator.description,
        tokenInfo.creator.avatarHash
      );
      if (success) {
        alert('Creator registered successfully!');
        await loadTokenInfo();
      } else {
        alert('Failed to register creator. Please try again.');
      }
    } catch (error) {
      console.error('Register error:', error);
      alert('Failed to register creator. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!tokenInfo) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🪙</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Creator Token Not Found</h3>
          <p className="text-gray-600 mb-4">This creator hasn't registered their token yet.</p>
          {connectedAddress === creatorAddress && (
            <button
              onClick={handleRegisterCreator}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Register Creator Token
            </button>
          )}
        </div>
      </div>
    );
  }

  const { creator, marketData, investorData, isCreator, isInvestor } = tokenInfo;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
            {creator.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{creator.name}</h2>
            <p className="text-sm text-gray-600">${creator.symbol}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onToggleInvestorData && (
            <button
              onClick={onToggleInvestorData}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                showInvestorData 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showInvestorData ? 'Hide' : 'Show'} Investor Data
            </button>
          )}
        </div>
      </div>

      {/* Market Data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {creatorTokenService.formatPrice(marketData.currentPrice)}
          </div>
          <div className="text-sm text-gray-600">Token Price</div>
          <div className={`text-xs ${creatorTokenService.getGrowthColor(marketData.priceChange24h)}`}>
            {marketData.priceChange24h > 0 ? '+' : ''}{creatorTokenService.formatGrowthRate(marketData.priceChange24h)} 24h
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {creatorTokenService.formatMarketCap(marketData.marketCap)}
          </div>
          <div className="text-sm text-gray-600">Market Cap</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {creatorTokenService.formatGrowthRate(marketData.estimatedGrowth)}
          </div>
          <div className="text-sm text-gray-600">Est. Growth</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {marketData.investorCount}
          </div>
          <div className="text-sm text-gray-600">Investors</div>
        </div>
      </div>

      {/* Creator Stats */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Creator Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Views:</span>
            <div className="font-semibold">{creator.totalViews.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-600">Total Likes:</span>
            <div className="font-semibold">{creator.totalLikes.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-600">Engagement Rate:</span>
            <div className="font-semibold">{creator.growthRate.toFixed(2)}%</div>
          </div>
          <div>
            <span className="text-gray-600">Total Revenue:</span>
            <div className="font-semibold">{creatorTokenService.formatPrice(creator.totalRevenue)}</div>
          </div>
        </div>
      </div>

      {/* Investor Data */}
      {showInvestorData && investorData && (
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-purple-900 mb-3">Your Investment</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-purple-600">Token Balance:</span>
              <div className="font-semibold">{investorData.tokenBalance.toFixed(2)} ${creator.symbol}</div>
            </div>
            <div>
              <span className="text-purple-600">Total Invested:</span>
              <div className="font-semibold">{creatorTokenService.formatPrice(investorData.totalInvested)}</div>
            </div>
            <div>
              <span className="text-purple-600">Avg Buy Price:</span>
              <div className="font-semibold">{creatorTokenService.formatPrice(investorData.averageBuyPrice)}</div>
            </div>
            <div>
              <span className="text-purple-600">Profit/Loss:</span>
              <div className={`font-semibold ${investorData.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {investorData.profitLoss >= 0 ? '+' : ''}{creatorTokenService.formatPrice(investorData.profitLoss)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trading Interface */}
      {connectedAddress && (
        <div className="space-y-4">
          {/* Buy Tokens */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Buy ${creator.symbol} Tokens</h4>
            <div className="flex space-x-3">
              <input
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                placeholder="Amount of tokens"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                step="0.01"
                min="0"
              />
              <button
                onClick={handleBuyTokens}
                disabled={buying || !buyAmount}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buying ? 'Buying...' : 'Buy'}
              </button>
            </div>
          </div>

          {/* Sell Tokens */}
          {isInvestor && investorData && investorData.tokenBalance > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Sell ${creator.symbol} Tokens</h4>
              <div className="flex space-x-3">
                <input
                  type="number"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  placeholder="Amount of tokens"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  step="0.01"
                  min="0"
                  max={investorData.tokenBalance}
                />
                <button
                  onClick={handleSellTokens}
                  disabled={selling || !sellAmount || parseFloat(sellAmount) > investorData.tokenBalance}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selling ? 'Selling...' : 'Sell'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Available: {investorData.tokenBalance.toFixed(2)} ${creator.symbol}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Token Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Supply:</span>
            <div className="font-semibold">{creator.totalSupply.toLocaleString()} ${creator.symbol}</div>
          </div>
          <div>
            <span className="text-gray-600">Circulating:</span>
            <div className="font-semibold">{creator.circulatingSupply.toLocaleString()} ${creator.symbol}</div>
          </div>
          <div>
            <span className="text-gray-600">Creator Address:</span>
            <div className="font-mono text-xs">
              {creator.creatorAddress.slice(0, 6)}...{creator.creatorAddress.slice(-4)}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Created:</span>
            <div className="font-semibold">
              {new Date(creator.createdAt * 1000).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 