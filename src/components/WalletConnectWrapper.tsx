'use client';

import { useState, useEffect } from 'react';
import WalletConnect from './WalletConnect';

export default function WalletConnectWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <WalletConnect />;
} 