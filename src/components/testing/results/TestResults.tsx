'use client'

import { useState, useEffect } from 'react';
import { TestResult, ColorblindType } from '@/types';
import { TestResultCard } from './TestResultCard';
import { TestResultVisualization } from './TestResultVisualization';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const TestResults: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Example empty result structure
  const emptyResult: TestResult = {
      colorblindType: ColorblindType.Protanopia,
      accessibilityScore: 0,
      timestamp: new Date().toISOString(),
      issues: [],
      timeSeriesData: [],
      videoUrl: '',
      wcagIssues: [],
      metrics: {
          contrastRatios: { min: 0, max: 0, average: 0 },
          readabilityScore: 0,
          interactiveElementsCount: 0,
          focusableElementsCount: 0,
          animationCount: 0,
          colorOnlyElements: 0,
          patternSupplementedElements: 0
      },
      testComponents: {
          static: { completed: false, error: null },
          interactive: { completed: false, error: null },
          forms: { completed: false, error: null }
      },
      status: 'pending' as const
  };

  useEffect(() => {
    const loadResults = () => {
      const storedResults = localStorage.getItem('testResults');
      if (storedResults) {
        try {
          const parsedResults = JSON.parse(storedResults);
          console.log('Loaded results:', parsedResults);
          setResults(parsedResults);
        } catch (error) {
          setError('Failed to parse stored test results');
          console.error('Error parsing test results:', error);
        }
      } else {
        // Set example empty results for each colorblind type
        setResults([
          { ...emptyResult, colorblindType: ColorblindType.Protanopia },
          { ...emptyResult, colorblindType: ColorblindType.Deuteranopia },
          { ...emptyResult, colorblindType: ColorblindType.Tritanopia },
          { ...emptyResult, colorblindType: ColorblindType.Achromatopsia }
        ]);
      }
      setLoading(false);
    };

    loadResults();
  }, []);

  const TestStatusBadge = ({ status }: { status: string }) => {
    const statusStyles = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      not_run: 'bg-gray-100 text-gray-600'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const ComponentStatus = ({ component }: { component: any }) => {
    return (
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">{component.name}</h4>
          <TestStatusBadge status={component.completed ? 'completed' : component.error ? 'error' : 'not_run'} />
        </div>
        {component.error && (
          <p className="text-sm text-red-600 mt-2">{component.error}</p>
        )}
        {!component.completed && !component.error && (
          <p className="text-sm text-gray-500">Test not yet run</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          <p className="text-center mt-4 text-gray-600">Loading test results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Accessibility Test Results</h1>
        <p className="text-gray-600 mt-2">
          {results.some(r => r.status === 'completed') 
            ? `Analysis completed for ${results.length} colorblind types`
            : 'No tests have been run yet'}
        </p>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Test Details</TabsTrigger>
          <TabsTrigger value="components">Test Components</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <TestResultVisualization results={results} />
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {results.map((result, index) => (
              <TestResultCard key={index} result={result} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="components">
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">{result.colorblindType}</h3>
                <div className="grid gap-4">
                  <ComponentStatus 
                    component={{
                      name: 'Static Analysis',
                      ...result.testComponents.static
                    }} 
                  />
                  <ComponentStatus 
                    component={{
                      name: 'Interactive Elements',
                      ...result.testComponents.interactive
                    }} 
                  />
                  <ComponentStatus 
                    component={{
                      name: 'Form Validation',
                      ...result.testComponents.forms
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          {results.some(r => r.issues.length > 0) ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Key Recommendations</h2>
              <div className="space-y-6">
                {results.map((result, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-medium text-lg mb-2">{result.colorblindType}</h3>
                    {result.issues.length > 0 ? (
                      <ul className="space-y-4">
                        {result.issues.map((issue, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="mt-1.5">•</span>
                            <div>
                              <p className="font-medium">{issue.description}</p>
                              {issue.recommendation && (
                                <p className="text-sm text-gray-600 mt-1">{issue.recommendation}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No issues found for this type</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <p className="text-gray-500">No recommendations available yet. Run tests to generate recommendations.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}; 