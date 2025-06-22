// Error suppression utility for network and blockchain-related errors
export const suppressNetworkErrors = () => {
  if (typeof window === 'undefined') return;

  const originalError = console.error;
  const originalWarn = console.warn;

  // Suppress network and blockchain related errors
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('MetaMask') || 
       args[0].includes('wallet_switchEthereumChain') ||
       args[0].includes('wallet_addEthereumChain') ||
       args[0].includes('indexedDB') ||
       args[0].includes('punycode') ||
       args[0].includes('network') ||
       args[0].includes('chain') ||
       args[0].includes('provider') ||
       args[0].includes('connection') ||
       args[0].includes('RPC') ||
       args[0].includes('ethereum') ||
       args[0].includes('wallet') ||
       args[0].includes('blockchain') ||
       args[0].includes('contract') ||
       args[0].includes('transaction') ||
       args[0].includes('gas') ||
       args[0].includes('nonce') ||
       args[0].includes('signature') ||
       args[0].includes('account') ||
       args[0].includes('address') ||
       args[0].includes('Failed to get chain ID') ||
       args[0].includes('Connection error') ||
       args[0].includes('Failed to add network') ||
       args[0].includes('Failed to switch network'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  // Suppress network and blockchain related warnings
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('MetaMask') || 
       args[0].includes('wallet') ||
       args[0].includes('network') ||
       args[0].includes('chain') ||
       args[0].includes('provider') ||
       args[0].includes('connection') ||
       args[0].includes('RPC') ||
       args[0].includes('ethereum') ||
       args[0].includes('blockchain') ||
       args[0].includes('contract') ||
       args[0].includes('transaction') ||
       args[0].includes('gas') ||
       args[0].includes('nonce') ||
       args[0].includes('signature') ||
       args[0].includes('account') ||
       args[0].includes('address'))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
};

// Safe error logging that respects suppression
export const safeErrorLog = (message: string, error?: any) => {
  if (typeof window === 'undefined') return;
  
  // Only log if it's not a network/blockchain error
  if (
    typeof message === 'string' &&
    !(message.includes('network') ||
      message.includes('chain') ||
      message.includes('provider') ||
      message.includes('connection') ||
      message.includes('RPC') ||
      message.includes('ethereum') ||
      message.includes('wallet') ||
      message.includes('blockchain') ||
      message.includes('contract') ||
      message.includes('transaction') ||
      message.includes('gas') ||
      message.includes('nonce') ||
      message.includes('signature') ||
      message.includes('account') ||
      message.includes('address'))
  ) {
    console.error(message, error);
  }
}; 