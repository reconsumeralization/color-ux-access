import React from 'react';
import { Progress } from '@/components/ui/progress';

interface TestProgressProps {
  current: number;
  total: number;
  status: string;
}

const TestProgress: React.FC<TestProgressProps> = ({ current, total, status }) => {
  const progressPercentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <Progress currentStep={progressPercentage} totalSteps={100} />
      <p className="text-gray-600">{status}</p>
    </div>
  );
};

export default TestProgress; 