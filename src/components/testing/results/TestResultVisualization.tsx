'use client'

import { useState, useEffect } from 'react';
import { TestResult } from '@/types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

interface TestResultVisualizationProps {
  results: TestResult[];
}

export const TestResultVisualization: React.FC<TestResultVisualizationProps> = ({ results }) => {
  const [selectedMetric, setSelectedMetric] = useState<'overall' | 'detailed'>('overall');

  useEffect(() => {
    // Debug log to check if results are being received
    console.log('Results received:', results);
  }, [results]);

  // Ensure results exist and have data
  if (!results || results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p>No test results available</p>
      </div>
    );
  }

  const scoreData = {
    labels: results.map(r => r.colorblindType || 'Unknown Type'),
    datasets: [{
      label: 'Accessibility Score',
      data: results.map(r => r.accessibilityScore || 0),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  };

  const detailedData = {
    labels: ['Contrast', 'Text Size', 'Color Usage', 'Navigation', 'Forms'],
    datasets: [{
      label: 'Accessibility Metrics',
      data: results[0]?.metrics || [0, 0, 0, 0, 0],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1,
      fill: true
    }]
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-center space-x-4 mb-6">
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
      </div>

      <div className="relative h-[400px]"> {/* Fixed height container */}
        {selectedMetric === 'overall' ? (
          <Bar 
            data={scoreData} 
            options={{ 
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }} 
          />
        ) : (
          <Radar 
            data={detailedData}
            options={{ 
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }}
          />
        )}
      </div>

      {/* Debug information */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Debug Info:</h3>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    </div>
  );
}; 