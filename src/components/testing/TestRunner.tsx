'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TestConfig } from '@/types';
import { ProgressBar } from '@/components/common/ProgressBar';

interface TestRunnerProps {
  config: TestConfig;
}

export const TestRunner: React.FC<TestRunnerProps> = ({ config }) => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing test...');

  useEffect(() => {
    const runTest = async () => {
      try {
        setStatus('Running tests...');
        
        const response = await fetch('/api/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        });

        if (!response.ok) {
          throw new Error('Test failed');
        }

        const { results } = await response.json();
        
        // Store results
        localStorage.setItem('testResults', JSON.stringify(results));
        console.log('Stored results:', results);

        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          setProgress(i);
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        router.push('/results');
      } catch (error) {
        setStatus('Error running test. Please try again.');
        console.error('Test error:', error);
      }
    };

    runTest();
  }, [config, router]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Running Accessibility Tests</h1>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div 
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
          />
        </div>
      </div>
      <p className="mt-4 text-gray-600">{status}</p>
    </div>
  );
}; 