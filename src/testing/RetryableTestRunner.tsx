import React, { useState } from 'react';
import { TestRunner } from './TestRunner';
import { TestResult, TestStatus } from '../services/colorblind-test/types';
import { TestError, TestErrorCode } from '../services/errors/test-errors';

interface RetryableTestRunnerProps {
  config: TestConfig;
  onComplete: (results: TestResult[]) => void;
  maxRetries?: number;
}

export const RetryableTestRunner: React.FC<RetryableTestRunnerProps> = ({
  config,
  onComplete,
  maxRetries = 3
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<TestError | null>(null);

  const handleTestError = async (error: TestError) => {
    setError(error);

    if (retryCount < maxRetries) {
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setRetryCount(prev => prev + 1);
      setError(null);
      
      // Retry with backoff
      return runTest();
    }

    throw error;
  };

  const runTest = async () => {
    try {
      const results = await new Promise<TestResult[]>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new TestError('Test timed out', TestErrorCode.TIMEOUT));
        }, 30000); // 30 second timeout

        const handleComplete = (results: TestResult[]) => {
          clearTimeout(timeout);
          resolve(results);
        };

        return (
          <TestRunner
            config={config}
            onComplete={handleComplete}
            onError={reject}
          />
        );
      });

      onComplete(results);
    } catch (error) {
      if (error instanceof TestError) {
        await handleTestError(error);
      } else {
        throw error;
      }
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error: {error.code}</p>
          <p>{error.message}</p>
          {retryCount < maxRetries && (
            <p className="mt-2">
              Retrying... Attempt {retryCount + 1} of {maxRetries}
            </p>
          )}
        </div>
      )}
      
      <TestRunner
        config={config}
        onComplete={onComplete}
        onError={(error) => handleTestError(error as TestError)}
      />
    </div>
  );
}; 