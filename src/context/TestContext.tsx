import { createContext, useContext, useState } from 'react';
import { TestConfig, TestResult } from '@/types';

interface TestContextType {
  config: TestConfig;
  results: TestResult[];
  setConfig: (config: TestConfig) => void;
  setResults: (results: TestResult[]) => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export function TestProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<TestConfig>({
    url: '',
    colorblindTypes: [],
    testComponents: [],
    duration: 0,
    resolution: { width: 0, height: 0 }
  });
  const [results, setResults] = useState<TestResult[]>([]);

  return (
    <TestContext.Provider value={{ config, results, setConfig, setResults }}>
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
} 