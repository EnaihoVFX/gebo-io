// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract VideoNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;
    
    // Video metadata structure
    struct VideoMetadata {
        string videoHash;
        string thumbnailHash;
        string title;
        string description;
        address creator;
        uint256 timestamp;
        uint256 views;
        uint256 likes;
        string duration;
        bool isShortForm; // For clips/shorts
        uint256 adRevenueGenerated;
        uint256 lastAdRevenueUpdate;
    }
    
    // NFT listing structure
    struct NFTListing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isListed;
        uint256 adRevenueShare; // Percentage of ad revenue that goes to NFT owner
    }
    
    // Mapping from token ID to video metadata
    mapping(uint256 => VideoMetadata) public videos;
    
    // Mapping from token ID to listing
    mapping(uint256 => NFTListing) public listings;
    
    // Mapping from creator to their video IDs
    mapping(address => uint256[]) public creatorVideos;
    
    // Platform fee (2.5%)
    uint256 public constant PLATFORM_FEE = 250; // 2.5% = 250 basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    // Ad revenue sharing
    uint256 public constant CREATOR_AD_SHARE = 8000; // 80% to creator/NFT owner
    uint256 public constant PLATFORM_AD_SHARE = 2000; // 20% to platform
    
    // Events
    event VideoMinted(uint256 indexed tokenId, string videoHash, address indexed creator, string title);
    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event AdRevenueGenerated(uint256 indexed tokenId, uint256 amount);
    event AdRevenueDistributed(uint256 indexed tokenId, address indexed recipient, uint256 amount);
    
    constructor() ERC721("VideoNFT", "VNFT") Ownable(msg.sender) {}
    
    // Mint a new video NFT
    function mintVideo(
        string memory videoHash,
        string memory thumbnailHash,
        string memory title,
        string memory description,
        string memory duration,
        bool isShortForm
    ) public returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        // Create video metadata
        videos[newTokenId] = VideoMetadata({
            videoHash: videoHash,
            thumbnailHash: thumbnailHash,
            title: title,
            description: description,
            creator: msg.sender,
            timestamp: block.timestamp,
            views: 0,
            likes: 0,
            duration: duration,
            isShortForm: isShortForm,
            adRevenueGenerated: 0,
            lastAdRevenueUpdate: block.timestamp
        });
        
        // Add to creator's videos
        creatorVideos[msg.sender].push(newTokenId);
        
        // Mint NFT to creator
        _safeMint(msg.sender, newTokenId);
        
        // Set token URI
        string memory newTokenURI = _createTokenURI(newTokenId);
        _setTokenURI(newTokenId, newTokenURI);
        
        emit VideoMinted(newTokenId, videoHash, msg.sender, title);
        
        return newTokenId;
    }
    
    // List NFT for sale
    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");
        
        listings[tokenId] = NFTListing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isListed: true,
            adRevenueShare: 8000 // 80% ad revenue share for NFT owner
        });
        
        emit NFTListed(tokenId, msg.sender, price);
    }
    
    // Buy listed NFT
    function buyNFT(uint256 tokenId) public payable nonReentrant {
        NFTListing storage listing = listings[tokenId];
        require(listing.isListed, "NFT not listed for sale");
        require(msg.value == listing.price, "Incorrect price");
        require(msg.sender != listing.seller, "Cannot buy your own NFT");
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        
        address seller = listing.seller;
        uint256 price = listing.price;
        
        // Calculate platform fee
        uint256 platformFee = (price * PLATFORM_FEE) / BASIS_POINTS;
        uint256 sellerAmount = price - platformFee;
        
        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);
        
        // Clear listing
        delete listings[tokenId];
        
        // Transfer funds
        payable(seller).transfer(sellerAmount);
        payable(owner()).transfer(platformFee);
        
        emit NFTSold(tokenId, seller, msg.sender, price);
    }
    
    // Update video views (called by frontend)
    function updateViews(uint256 tokenId) public {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        videos[tokenId].views++;
    }
    
    // Update video likes (called by frontend)
    function updateLikes(uint256 tokenId) public {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        videos[tokenId].likes++;
    }
    
    // Generate ad revenue (called by platform)
    function generateAdRevenue(uint256 tokenId, uint256 amount) public onlyOwner {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        
        videos[tokenId].adRevenueGenerated += amount;
        videos[tokenId].lastAdRevenueUpdate = block.timestamp;
        
        emit AdRevenueGenerated(tokenId, amount);
    }
    
    // Distribute ad revenue to NFT owner
    function distributeAdRevenue(uint256 tokenId) public nonReentrant {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        
        VideoMetadata storage video = videos[tokenId];
        address currentOwner = ownerOf(tokenId);
        
        // Calculate ad revenue share
        uint256 totalAdRevenue = video.adRevenueGenerated;
        uint256 ownerShare = (totalAdRevenue * CREATOR_AD_SHARE) / BASIS_POINTS;
        uint256 platformShare = totalAdRevenue - ownerShare;
        
        if (ownerShare > 0) {
            payable(currentOwner).transfer(ownerShare);
            emit AdRevenueDistributed(tokenId, currentOwner, ownerShare);
        }
        
        if (platformShare > 0) {
            payable(owner()).transfer(platformShare);
            emit AdRevenueDistributed(tokenId, owner(), platformShare);
        }
        
        // Reset ad revenue
        video.adRevenueGenerated = 0;
    }
    
    // Get video metadata
    function getVideo(uint256 tokenId) public view returns (VideoMetadata memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return videos[tokenId];
    }
    
    // Get creator's videos
    function getCreatorVideos(address creator) public view returns (uint256[] memory) {
        return creatorVideos[creator];
    }
    
    // Get recent videos
    function getRecentVideos(uint256 count) public view returns (uint256[] memory) {
        uint256 totalVideos = _tokenIds;
        uint256 actualCount = count > totalVideos ? totalVideos : count;
        
        uint256[] memory recentVideos = new uint256[](actualCount);
        for (uint256 i = 0; i < actualCount; i++) {
            recentVideos[i] = totalVideos - i;
        }
        
        return recentVideos;
    }
    
    // Get short form videos (clips)
    function getShortFormVideos(uint256 count) public view returns (uint256[] memory) {
        uint256 totalVideos = _tokenIds;
        uint256[] memory shortFormVideos = new uint256[](count);
        uint256 found = 0;
        
        for (uint256 i = totalVideos; i > 0 && found < count; i--) {
            if (videos[i].isShortForm) {
                shortFormVideos[found] = i;
                found++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](found);
        for (uint256 i = 0; i < found; i++) {
            result[i] = shortFormVideos[i];
        }
        
        return result;
    }
    
    // Get NFT listing
    function getListing(uint256 tokenId) public view returns (NFTListing memory) {
        return listings[tokenId];
    }
    
    // Check if NFT is listed
    function isListed(uint256 tokenId) public view returns (bool) {
        return listings[tokenId].isListed;
    }
    
    // Withdraw platform fees
    function withdrawPlatformFees() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Internal function to create token URI
    function _createTokenURI(uint256 tokenId) internal view returns (string memory) {
        VideoMetadata memory video = videos[tokenId];
        
        return string(abi.encodePacked(
            '{"name": "', video.title, '",',
            '"description": "', video.description, '",',
            '"image": "ipfs://', video.thumbnailHash, '",',
            '"animation_url": "ipfs://', video.videoHash, '",',
            '"attributes": [',
            '{"trait_type": "Creator", "value": "', _addressToString(video.creator), '"},',
            '{"trait_type": "Duration", "value": "', video.duration, '"},',
            '{"trait_type": "Views", "value": "', _uint2str(video.views), '"},',
            '{"trait_type": "Likes", "value": "', _uint2str(video.likes), '"},',
            '{"trait_type": "Is Short Form", "value": "', video.isShortForm ? "true" : "false", '"}',
            ']}'
        ));
    }
    
    // Helper function to convert address to string
    function _addressToString(address addr) internal pure returns (string memory) {
        bytes memory b = new bytes(20);
        for (uint256 i = 0; i < 20; i++) {
            b[i] = bytes1(uint8(uint256(uint160(addr)) / (2**(8*(19 - i)))));
        }
        return string(b);
    }
    
    // Helper function to convert uint to string
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (_i != 0) {
            k -= 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
    
    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 