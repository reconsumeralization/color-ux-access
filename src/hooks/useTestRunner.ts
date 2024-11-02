import { useState } from 'react';
import { TestConfig, TestResult } from '@/types';
import { AutomatedWorkflowTester } from '@/services/colorblind-test/automated-workflow';

export function useTestRunner() {
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [status, setStatus] = useState<string>('');
  const [results, setResults] = useState<TestResult[]>([]);

  const runTests = async (config: TestConfig) => {
    const tester = new AutomatedWorkflowTester(process.env.NEXT_PUBLIC_ARIA_API_KEY!);
    
    const totalTests = config.colorblindTypes.length * 
      Object.values(config.testComponents).filter(Boolean).length;
    
    setProgress({ current: 0, total: totalTests });

    try {
      const newResults: TestResult[] = [];

      // Run each test type
      for (const type of config.colorblindTypes) {
        if (config.testComponents.static) {
          setStatus(`Running static analysis for ${type}...`);
          const result = await tester.runStaticAnalysis(config.url, type);
          newResults.push(result);
          setProgress(p => ({ ...p, current: p.current + 1 }));
        }
        // Add other test types...
      }

      setResults(newResults);
      return newResults;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatus(`Error: ${error.message}`);
      } else {
        setStatus('An unknown error occurred');
      }
      throw error;
    }
  };

  return { progress, status, results, runTests };
} 