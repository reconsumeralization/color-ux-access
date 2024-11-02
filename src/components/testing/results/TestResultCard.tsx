'use client'

import { TestResult } from '@/types';

interface TestResultCardProps {
  result: TestResult;
}

export const TestResultCard: React.FC<TestResultCardProps> = ({ result }) => {
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{result.colorblindType}</h3>
        <div className={`px-4 py-2 rounded-full ${
          result.accessibilityScore >= 90 ? 'bg-green-100 text-green-800' :
          result.accessibilityScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          Score: {Math.round(result.accessibilityScore)}
        </div>
      </div>

      <div className="space-y-4">
        {/* Metrics Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Contrast Ratio</p>
            <p className="text-lg font-semibold">
              {result.metrics?.contrastRatios?.average.toFixed(2) || 'N/A'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Readability</p>
            <p className="text-lg font-semibold">
              {result.metrics?.readabilityScore?.toFixed(2) || 'N/A'}
            </p>
          </div>
        </div>

        {/* Issues List */}
        <div>
          <h4 className="font-semibold mb-2">Issues Found</h4>
          <div className="space-y-2">
            {result.issues.map((issue, index) => (
              <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                <p className="font-medium">{issue.description}</p>
                {issue.recommendation && (
                  <p className="text-sm text-gray-600 mt-1">{issue.recommendation}</p>
                )}
                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${getSeverityClass(issue.severity)}`}>
                  {issue.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 