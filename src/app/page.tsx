'use client';

import dynamic from 'next/dynamic';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

const VaultApp = dynamic(() => import('@/components/vault/VaultApp'), {
  ssr: false,
  loading: () => <LoadingScreen />
});

export default function Home() {
  return <VaultApp />;
}
