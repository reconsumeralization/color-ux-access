import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TestService } from '@/services/testing/TestService';
import { useTestConfig } from '@/stores/testConfigStore';
import { LinearProgress } from '@mui/material'; // Using MUI progress instead since Progress component not found
import { TestConfig } from '@/types';

export const TestRunner = () => {
  const router = useRouter();
  const config = useTestConfig();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing Aria model...');

  useEffect(() => {
    const runTests = async () => {
      try {
        const testService = new TestService();
        setStatus('Running accessibility analysis...');
        
        const results = await testService.runTest(config as unknown as TestConfig);
        
        // Store results
        localStorage.setItem('testResults', JSON.stringify(results));
        
        // Navigate to results page
        router.push('/results');
      } catch (error) {
        console.error('Test error:', error);
        setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    runTests();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Running Tests</h1>
      <div className="space-y-4">
        <p className="text-gray-600">{status}</p>
        <LinearProgress value={progress} />
      </div>
    </div>
  );
}; 