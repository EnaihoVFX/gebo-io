"use client";
import React from 'react';
import Onboarding from '@/components/Onboarding';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const handleOnboardingComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingComplete', 'true');
      router.push('/');
    }
  };
  return (
    <Onboarding account={null} onOnboardingComplete={handleOnboardingComplete} />
  );
} 