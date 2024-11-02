import React from 'react';
import { Progress } from '@/components/ui/progress';

export const TestProgress: React.FC<{ current: number; total: number; status: string }> = ({ current, total, status }) => {
  const progressPercentage = Math.round((current / total) * 100);

  return (
    <div className="space-y-4">
      <Progress currentStep={progressPercentage} totalSteps={100} />
      <p className="text-gray-600">{status}</p>
    </div>
  );
}; 