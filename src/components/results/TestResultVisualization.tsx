import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TestResult } from '../../services/colorblind-test/types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TestResultVisualizationProps {
  results: TestResult[];
}

export const TestResultVisualization: React.FC<TestResultVisualizationProps> = ({ results }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('overall');

  const scoreData = {
    labels: results.map(r => r.colorblindType),
    datasets: [{
      label: 'Accessibility Score',
      data: results.map(r => r.accessibilityScore),
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const metricsData = {
    labels: ['Contrast', 'Readability', 'Color Dependencies', 'Interactive Elements', 'Patterns'],
    datasets: results.map(r => ({
      label: r.colorblindType,
      data: [
        r.metrics.contrastRatios.average,
        r.metrics.readabilityScore,
        100 - (r.metrics.colorOnlyElements / r.metrics.interactiveElementsCount * 100),
        r.metrics.focusableElementsCount / r.metrics.interactiveElementsCount * 100,
        r.metrics.patternSupplementedElements / r.metrics.colorOnlyElements * 100
      ]
    }))
  };

  const issueDistributionData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: results.map(r => ({
      label: r.colorblindType,
      data: [
        r.issues.filter(i => i.severity === 'high').length,
        r.issues.filter(i => i.severity === 'medium').length,
        r.issues.filter(i => i.severity === 'low').length
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)'
      ]
    }))
  };

  const timeSeriesData = {
    labels: results[0]?.timeSeriesData?.map((d: { timestamp: any; }) => d.timestamp) || [],
    datasets: results.map(r => ({
      label: r.colorblindType,
      data: r.timeSeriesData?.map((d: { score: any; }) => d.score) || [],
      fill: false,
      borderColor: getColorForType(r.colorblindType),
      tension: 0.1
    }))
  };

  return (
    <div className="space-y-8">
      {/* Metric selector */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setSelectedMetric('overall')}
          className={`px-4 py-2 rounded ${
            selectedMetric === 'overall' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Overall Score
        </button>
        <button
          onClick={() => setSelectedMetric('detailed')}
          className={`px-4 py-2 rounded ${
            selectedMetric === 'detailed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Detailed Metrics
        </button>
        <button
          onClick={() => setSelectedMetric('issues')}
          className={`px-4 py-2 rounded ${
            selectedMetric === 'issues' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Issues
        </button>
        <button
          onClick={() => setSelectedMetric('timeline')}
          className={`px-4 py-2 rounded ${
            selectedMetric === 'timeline' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Timeline
        </button>
      </div>

      {/* Chart containers */}
      {selectedMetric === 'overall' && (
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Overall Accessibility Scores</h3>
          <Bar data={scoreData} options={{ maintainAspectRatio: false }} height={300} />
        </div>
      )}

      {selectedMetric === 'detailed' && (
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Detailed Metrics</h3>
          <Bar data={metricsData} options={{ maintainAspectRatio: false }} height={400} />
        </div>
      )}

      {selectedMetric === 'issues' && (
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Issue Distribution</h3>
          <Bar data={issueDistributionData} options={{ maintainAspectRatio: false }} height={300} />
        </div>
      )}

      {selectedMetric === 'timeline' && (
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Score Timeline</h3>
          <Bar data={timeSeriesData} options={{ maintainAspectRatio: false }} height={300} />
        </div>
      )}

      {/* Issue details grid */}
      <div className="grid grid-cols-2 gap-4">
        {results.map((result, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow">
            <h4 className="font-semibold mb-2">{result.colorblindType}</h4>
            <div className="space-y-2">
              {result.issues.map((issue, i) => (
                <div key={i} className={`p-2 rounded ${getIssueSeverityClass(issue.severity)}`}>
                  <p className="font-medium">{issue.description}</p>
                  {issue.recommendation && (
                    <p className="text-sm mt-1">Recommendation: {issue.recommendation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getColorForType(type: string): string {
  const colors = {
    'protanopia': 'rgb(255, 99, 132)',
    'deuteranopia': 'rgb(54, 162, 235)',
    'tritanopia': 'rgb(255, 206, 86)',
    'achromatopsia': 'rgb(75, 192, 192)'
  };
  return colors[type as keyof typeof colors] || 'rgb(201, 203, 207)';
}

function getIssueSeverityClass(severity: string): string {
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
} 