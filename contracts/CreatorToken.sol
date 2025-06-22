// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CreatorToken is ERC20, Ownable, ReentrancyGuard {
    uint256 private _creatorIds;
    
    // Creator information
    struct Creator {
        uint256 creatorId;
        address creatorAddress;
        string name;
        string symbol;
        string description;
        string avatarHash;
        uint256 totalSupply;
        uint256 circulatingSupply;
        uint256 marketCap;
        uint256 totalRevenue;
        uint256 totalViews;
        uint256 totalLikes;
        uint256 tokenPrice;
        uint256 lastPriceUpdate;
        uint256 growthRate;
        uint256 investorCount;
        bool isActive;
        uint256 createdAt;
    }
    
    // Investor information
    struct Investor {
        uint256 tokenBalance;
        uint256 totalInvested;
        uint256 averageBuyPrice;
        uint256 lastInvestment;
        uint256 profitLoss;
        bool isInvestor;
    }
    
    // Market data
    struct MarketData {
        uint256 currentPrice;
        uint256 priceChange24h;
        uint256 volume24h;
        uint256 marketCap;
        uint256 growthRate;
        uint256 estimatedGrowth;
        uint256 investorCount;
        uint256 totalRevenue;
        uint256 revenueGrowth;
    }
    
    // Mapping from creator address to creator data
    mapping(address => Creator) public creators;
    
    // Mapping from creator address to investor address to investor data
    mapping(address => mapping(address => Investor)) public investors;
    
    // Mapping from creator address to market data
    mapping(address => MarketData) public marketData;
    
    // Platform fee (2%)
    uint256 public constant PLATFORM_FEE = 200; // 2% = 200 basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    // Token price calculation parameters
    uint256 public constant BASE_PRICE = 0.001 ether; // 0.001 ETH per token
    uint256 public constant PRICE_MULTIPLIER = 1000; // Price increases with demand
    
    // Events
    event CreatorRegistered(uint256 indexed creatorId, address indexed creatorAddress, string name, string symbol);
    event TokensMinted(address indexed creator, address indexed investor, uint256 amount, uint256 price);
    event TokensBurned(address indexed creator, address indexed investor, uint256 amount, uint256 price);
    event MarketDataUpdated(address indexed creator, uint256 price, uint256 marketCap, uint256 growthRate);
    event RevenueDistributed(address indexed creator, uint256 amount);
    
    constructor() ERC20("CreatorToken", "CT") Ownable(msg.sender) {}
    
    // Register a new creator
    function registerCreator(
        string memory name,
        string memory symbol,
        string memory description,
        string memory avatarHash
    ) public returns (uint256) {
        require(creators[msg.sender].creatorAddress == address(0), "Creator already registered");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        
        _creatorIds++;
        uint256 creatorId = _creatorIds;
        
        creators[msg.sender] = Creator({
            creatorId: creatorId,
            creatorAddress: msg.sender,
            name: name,
            symbol: symbol,
            description: description,
            avatarHash: avatarHash,
            totalSupply: 1000000 * 10**decimals(), // 1M tokens
            circulatingSupply: 0,
            marketCap: 0,
            totalRevenue: 0,
            totalViews: 0,
            totalLikes: 0,
            tokenPrice: BASE_PRICE,
            lastPriceUpdate: block.timestamp,
            growthRate: 0,
            investorCount: 0,
            isActive: true,
            createdAt: block.timestamp
        });
        
        // Initialize market data
        marketData[msg.sender] = MarketData({
            currentPrice: BASE_PRICE,
            priceChange24h: 0,
            volume24h: 0,
            marketCap: 0,
            growthRate: 0,
            estimatedGrowth: 0,
            investorCount: 0,
            totalRevenue: 0,
            revenueGrowth: 0
        });
        
        emit CreatorRegistered(creatorId, msg.sender, name, symbol);
        
        return creatorId;
    }
    
    // Buy creator tokens
    function buyCreatorTokens(address creator, uint256 amount) public payable nonReentrant {
        require(creators[creator].isActive, "Creator is not active");
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 totalCost = calculateTokenCost(creator, amount);
        require(msg.value >= totalCost, "Insufficient payment");
        
        // Calculate platform fee
        uint256 platformFee = (totalCost * PLATFORM_FEE) / BASIS_POINTS;
        uint256 creatorAmount = totalCost - platformFee;
        
        // Update creator data
        creators[creator].circulatingSupply += amount;
        creators[creator].totalRevenue += creatorAmount;
        
        // Update investor data
        if (!investors[creator][msg.sender].isInvestor) {
            investors[creator][msg.sender].isInvestor = true;
            creators[creator].investorCount++;
            marketData[creator].investorCount++;
        }
        
        uint256 currentAveragePrice = investors[creator][msg.sender].averageBuyPrice;
        uint256 currentBalance = investors[creator][msg.sender].tokenBalance;
        uint256 newBalance = currentBalance + amount;
        
        // Calculate new average buy price
        uint256 newAveragePrice = ((currentAveragePrice * currentBalance) + (totalCost * amount)) / newBalance;
        
        investors[creator][msg.sender].tokenBalance = newBalance;
        investors[creator][msg.sender].totalInvested += totalCost;
        investors[creator][msg.sender].averageBuyPrice = newAveragePrice;
        investors[creator][msg.sender].lastInvestment = block.timestamp;
        
        // Update market data
        updateMarketData(creator);
        
        // Transfer funds
        payable(creator).transfer(creatorAmount);
        payable(owner()).transfer(platformFee);
        
        // Mint tokens to investor
        _mint(msg.sender, amount);
        
        emit TokensMinted(creator, msg.sender, amount, totalCost);
    }
    
    // Sell creator tokens
    function sellCreatorTokens(address creator, uint256 amount) public nonReentrant {
        require(creators[creator].isActive, "Creator is not active");
        require(amount > 0, "Amount must be greater than 0");
        require(investors[creator][msg.sender].tokenBalance >= amount, "Insufficient token balance");
        
        uint256 totalValue = calculateTokenValue(creator, amount);
        
        // Update creator data
        creators[creator].circulatingSupply -= amount;
        
        // Update investor data
        investors[creator][msg.sender].tokenBalance -= amount;
        investors[creator][msg.sender].profitLoss += totalValue - (investors[creator][msg.sender].averageBuyPrice * amount);
        
        // Remove investor if balance is 0
        if (investors[creator][msg.sender].tokenBalance == 0) {
            investors[creator][msg.sender].isInvestor = false;
            creators[creator].investorCount--;
            marketData[creator].investorCount--;
        }
        
        // Update market data
        updateMarketData(creator);
        
        // Burn tokens
        _burn(msg.sender, amount);
        
        // Transfer ETH to seller
        payable(msg.sender).transfer(totalValue);
        
        emit TokensBurned(creator, msg.sender, amount, totalValue);
    }
    
    // Update creator metrics (called by platform)
    function updateCreatorMetrics(
        address creator,
        uint256 views,
        uint256 likes,
        uint256 revenue
    ) public onlyOwner {
        require(creators[creator].isActive, "Creator is not active");
        
        creators[creator].totalViews += views;
        creators[creator].totalLikes += likes;
        creators[creator].totalRevenue += revenue;
        
        // Calculate growth rate based on engagement
        uint256 engagementRate = creators[creator].totalViews > 0 ? 
            (creators[creator].totalLikes * 100) / creators[creator].totalViews : 0;
        
        creators[creator].growthRate = engagementRate;
        
        // Update market data
        updateMarketData(creator);
        
        emit RevenueDistributed(creator, revenue);
    }
    
    // Calculate token cost based on current supply and demand
    function calculateTokenCost(address creator, uint256 amount) public view returns (uint256) {
        uint256 currentSupply = creators[creator].circulatingSupply;
        uint256 newSupply = currentSupply + amount;
        
        // Simple bonding curve: price increases with supply
        uint256 currentPrice = BASE_PRICE + (currentSupply / PRICE_MULTIPLIER);
        uint256 newPrice = BASE_PRICE + (newSupply / PRICE_MULTIPLIER);
        
        // Average price for the purchase
        uint256 averagePrice = (currentPrice + newPrice) / 2;
        
        return averagePrice * amount;
    }
    
    // Calculate token value for selling
    function calculateTokenValue(address creator, uint256 amount) public view returns (uint256) {
        uint256 currentSupply = creators[creator].circulatingSupply;
        uint256 newSupply = currentSupply - amount;
        
        // Price decreases when supply decreases
        uint256 currentPrice = BASE_PRICE + (currentSupply / PRICE_MULTIPLIER);
        uint256 newPrice = BASE_PRICE + (newSupply / PRICE_MULTIPLIER);
        
        // Average price for the sale
        uint256 averagePrice = (currentPrice + newPrice) / 2;
        
        return averagePrice * amount;
    }
    
    // Update market data
    function updateMarketData(address creator) internal {
        uint256 currentPrice = BASE_PRICE + (creators[creator].circulatingSupply / PRICE_MULTIPLIER);
        uint256 marketCap = currentPrice * creators[creator].totalSupply;
        
        // Calculate price change (simplified)
        uint256 priceChange = currentPrice > marketData[creator].currentPrice ? 
            ((currentPrice - marketData[creator].currentPrice) * 100) / marketData[creator].currentPrice : 0;
        
        // Calculate estimated growth based on engagement and revenue
        uint256 estimatedGrowth = calculateEstimatedGrowth(creator);
        
        marketData[creator] = MarketData({
            currentPrice: currentPrice,
            priceChange24h: priceChange,
            volume24h: 0, // Would need to track actual volume
            marketCap: marketCap,
            growthRate: creators[creator].growthRate,
            estimatedGrowth: estimatedGrowth,
            investorCount: creators[creator].investorCount,
            totalRevenue: creators[creator].totalRevenue,
            revenueGrowth: 0 // Would need historical data
        });
        
        creators[creator].tokenPrice = currentPrice;
        creators[creator].marketCap = marketCap;
        creators[creator].lastPriceUpdate = block.timestamp;
        
        emit MarketDataUpdated(creator, currentPrice, marketCap, creators[creator].growthRate);
    }
    
    // Calculate estimated growth based on creator metrics
    function calculateEstimatedGrowth(address creator) internal view returns (uint256) {
        uint256 engagementRate = creators[creator].growthRate;
        uint256 revenuePerView = creators[creator].totalViews > 0 ? 
            creators[creator].totalRevenue / creators[creator].totalViews : 0;
        
        // Simple growth calculation based on engagement and revenue
        uint256 growth = (engagementRate * 10) + (revenuePerView * 1000);
        
        return growth > 100 ? 100 : growth; // Cap at 100%
    }
    
    // Get creator data
    function getCreator(address creator) public view returns (Creator memory) {
        return creators[creator];
    }
    
    // Get investor data
    function getInvestor(address creator, address investor) public view returns (Investor memory) {
        return investors[creator][investor];
    }
    
    // Get market data
    function getMarketData(address creator) public view returns (MarketData memory) {
        return marketData[creator];
    }
    
    // Get all creators
    function getAllCreators() public view returns (address[] memory) {
        address[] memory creatorAddresses = new address[](_creatorIds);
        uint256 count = 0;
        
        // This is a simplified version - in production you'd want a better data structure
        for (uint256 i = 1; i <= _creatorIds; i++) {
            // Would need to maintain a mapping of creator IDs to addresses
        }
        
        return creatorAddresses;
    }
    
    // Check if address is a creator
    function isCreator(address creator) public view returns (bool) {
        return creators[creator].creatorAddress != address(0);
    }
    
    // Check if address is an investor in a creator
    function isInvestor(address creator, address investor) public view returns (bool) {
        return investors[creator][investor].isInvestor;
    }
    
    // Get current token price for a creator
    function getTokenPrice(address creator) public view returns (uint256) {
        return BASE_PRICE + (creators[creator].circulatingSupply / PRICE_MULTIPLIER);
    }
    
    // Withdraw platform fees
    function withdrawPlatformFees() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
} 