'use client'

import { useSearchParams } from 'next/navigation';
import { TestConfiguration } from '@/components/testing/configuration/TestConfiguration';

export default function ConfigurePage() {
  const searchParams = useSearchParams();
  const config = JSON.parse(searchParams.get('config') || '{}');

  return <TestConfiguration config={config} onChange={() => {}} />;
} 