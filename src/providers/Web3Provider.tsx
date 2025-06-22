'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from '@/config/web3';
import { useEffect } from 'react';
import { suppressNetworkErrors } from '@/utils/errorSuppression';

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suppress network errors on mount
    suppressNetworkErrors();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 