import React from 'react';
import { TestResult, ColorblindType } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TestDetailsProps {
  result: TestResult;
}

export const TestDetails: React.FC<TestDetailsProps> = ({ result }) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {result.colorblindType} Test Results
          </h3>
          <p className="text-sm text-muted-foreground">
            {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
        <Badge variant={result.status === 'completed' ? 'success' : 'warning'}>
          {result.status}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>Accessibility Score</span>
            <span className="font-semibold">{result.accessibilityScore}%</span>
          </div>
          <Progress value={result.accessibilityScore} />
        </div>

        <div>
          <h4 className="font-semibold mb-2">Key Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Contrast Ratio</p>
              <p className="font-semibold">{result.metrics.contrastRatios.average.toFixed(1)}:1</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Readability</p>
              <p className="font-semibold">{result.metrics.readabilityScore.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Issues Found</h4>
          <div className="space-y-2">
            {result.issues.map((issue) => (
              <div key={issue.id} className="p-2 bg-muted rounded-md">
                <div className="flex justify-between">
                  <span className="font-medium">{issue.type}</span>
                  <Badge variant={
                    issue.severity === 'high' ? 'destructive' : 
                    issue.severity === 'medium' ? 'warning' : 
                    'default'
                  }>
                    {issue.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {issue.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}; 