import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance, useChainId } from 'wagmi';
import { CONTRACT_ADDRESS, VIDEO_TOKEN_ABI } from '@/config/web3';
import { parseEther, formatEther } from 'viem';

export function useVideoToken() {
  const chainId = useChainId();
  const { address } = useAccount();
  
  const contractAddress = CONTRACT_ADDRESS;

  // Create video
  const { writeContract: createVideo, isPending: isCreating } = useWriteContract();

  const createVideoFunction = (ipfsHash: string, nftPrice: number, coinPrice: number, totalSupply: number) => {
    createVideo({
      address: contractAddress as `0x${string}`,
      abi: VIDEO_TOKEN_ABI,
      functionName: 'createVideo',
      args: [ipfsHash, parseEther(nftPrice.toString()), parseEther(coinPrice.toString()), BigInt(totalSupply)],
    });
  };

  // Stake tokens
  const { writeContract: stakeTokens, isPending: isStaking } = useWriteContract();

  const stakeTokensFunction = (tokenId: number, amount: number, coinPrice: number) => {
    stakeTokens({
      address: contractAddress as `0x${string}`,
      abi: VIDEO_TOKEN_ABI,
      functionName: 'stakeTokens',
      args: [BigInt(tokenId), BigInt(amount)],
      value: parseEther((amount * coinPrice).toString()),
    });
  };

  // Purchase NFT
  const { writeContract: purchaseNFT, isPending: isPurchasing } = useWriteContract();

  const purchaseNFTFunction = (tokenId: number, price: number) => {
    purchaseNFT({
      address: contractAddress as `0x${string}`,
      abi: VIDEO_TOKEN_ABI,
      functionName: 'purchaseNFT',
      args: [BigInt(tokenId)],
      value: parseEther(price.toString()),
    });
  };

  // Claim rewards
  const { writeContract: claimRewards, isPending: isClaiming } = useWriteContract();

  const claimRewardsFunction = (tokenId: number) => {
    claimRewards({
      address: contractAddress as `0x${string}`,
      abi: VIDEO_TOKEN_ABI,
      functionName: 'claimRewards',
      args: [BigInt(tokenId)],
    });
  };

  return {
    // Contract address
    contractAddress,
    
    // Create video
    createVideo: createVideoFunction,
    isCreating,
    
    // Stake tokens
    stakeTokens: stakeTokensFunction,
    isStaking,
    
    // Purchase NFT
    purchaseNFT: purchaseNFTFunction,
    isPurchasing,
    
    // Claim rewards
    claimRewards: claimRewardsFunction,
    isClaiming,
  };
}

export function useVideoInfo(tokenId: number) {
  const contractAddress = CONTRACT_ADDRESS;

  const { data: videoInfo, isLoading, error } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: VIDEO_TOKEN_ABI,
    functionName: 'getVideoInfo',
    args: [BigInt(tokenId)],
    query: {
      enabled: !!contractAddress && tokenId > 0,
    },
  });

  return {
    videoInfo,
    isLoading,
    error,
    exists: videoInfo?.exists || false,
    creator: videoInfo?.creator,
    ipfsHash: videoInfo?.ipfsHash,
    nftPrice: videoInfo?.nftPrice ? formatEther(videoInfo.nftPrice) : '0',
    coinPrice: videoInfo?.coinPrice ? formatEther(videoInfo.coinPrice) : '0',
    totalSupply: videoInfo?.totalSupply?.toString() || '0',
    stakedAmount: videoInfo?.stakedAmount?.toString() || '0',
    totalRevenue: videoInfo?.totalRevenue ? formatEther(videoInfo.totalRevenue) : '0',
  };
}

export function useStakeInfo(tokenId: number, address?: string) {
  const contractAddress = CONTRACT_ADDRESS;

  const { data: stakeInfo, isLoading, error } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: VIDEO_TOKEN_ABI,
    functionName: 'getStakeInfo',
    args: [BigInt(tokenId), address as `0x${string}`],
    query: {
      enabled: !!contractAddress && !!address && tokenId > 0,
    },
  });

  return {
    stakeInfo,
    isLoading,
    error,
    stakedAmount: stakeInfo?.amount?.toString() || '0',
    timestamp: stakeInfo?.timestamp?.toString() || '0',
    rewards: stakeInfo?.rewards ? formatEther(stakeInfo.rewards) : '0',
  };
}

export function useUserBalance() {
  const { address } = useAccount();
  const chainId = useChainId();
  
  const { data: balance } = useBalance({
    address,
    chainId,
  });

  return {
    balance: balance?.formatted || '0',
    symbol: balance?.symbol || 'MATIC',
    decimals: balance?.decimals || 18,
  };
} 