import React from 'react';
import { TestResult } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OverviewProps {
  results: TestResult[];
}

export const Overview: React.FC<OverviewProps> = ({ results }) => {
  const averageScore = results.reduce((acc, curr) => acc + curr.accessibilityScore, 0) / results.length;
  const totalIssues = results.reduce((acc, curr) => acc + curr.issues.length, 0);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
        <div className="text-3xl font-bold text-primary">
          {averageScore.toFixed(1)}%
        </div>
        <div className="mt-2">
          <Badge variant={averageScore > 80 ? "success" : averageScore > 60 ? "warning" : "destructive"}>
            {averageScore > 80 ? "Good" : averageScore > 60 ? "Needs Improvement" : "Poor"}
          </Badge>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Total Issues</h3>
        <div className="text-3xl font-bold text-primary">{totalIssues}</div>
        <div className="mt-2 text-sm text-muted-foreground">
          Across all test types
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Tests Completed</h3>
        <div className="text-3xl font-bold text-primary">{results.length}</div>
        <div className="mt-2 text-sm text-muted-foreground">
          Different colorblind simulations
        </div>
      </Card>
    </div>
  );
}; 