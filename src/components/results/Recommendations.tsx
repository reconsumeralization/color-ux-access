import React from 'react';
import { TestResult, AccessibilityIssue } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecommendationsProps {
  results: TestResult[];
}

export const Recommendations: React.FC<RecommendationsProps> = ({ results }) => {
  // Collect all unique issues across test results
  const allIssues = results.flatMap(result => result.issues);
  
  // Group issues by type and severity
  const groupedIssues = allIssues.reduce((acc, issue) => {
    const key = `${issue.type}-${issue.severity}`;
    if (!acc[key]) {
      acc[key] = {
        ...issue,
        count: 1,
        affectedTypes: [results.find(r => 
          r.issues.some(i => i.id === issue.id)
        )?.colorblindType ?? 'unknown']
      };
    } else {
      acc[key].count++;
      const affectedType = results.find(r => 
        r.issues.some(i => i.id === issue.id)
      )?.colorblindType;
      if (affectedType && !acc[key].affectedTypes.includes(affectedType)) {
        acc[key].affectedTypes.push(affectedType);
      }
    }
    return acc;
  }, {} as Record<string, AccessibilityIssue & { count: number, affectedTypes: string[] }>);

  return (
    <div className="space-y-4">
      {Object.values(groupedIssues)
        .sort((a, b) => 
          b.count - a.count || 
          (b.severity === 'high' ? 1 : b.severity === 'medium' ? 0 : -1) -
          (a.severity === 'high' ? 1 : a.severity === 'medium' ? 0 : -1)
        )
        .map((issue) => (
          <Card key={`${issue.type}-${issue.severity}`} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  {issue.type}
                  <Badge variant={
                    issue.severity === 'high' ? 'destructive' : 
                    issue.severity === 'medium' ? 'warning' : 
                    'default'
                  }>
                    {issue.severity}
                  </Badge>
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {issue.description}
                </p>
              </div>
              <span className="text-sm font-medium">
                Found {issue.count} times
              </span>
            </div>
            
            {issue.recommendation && (
              <div className="mt-2 p-2 bg-muted rounded-md">
                <p className="text-sm">
                  <span className="font-medium">Recommendation: </span>
                  {issue.recommendation}
                </p>
              </div>
            )}

            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                Affects: {issue.affectedTypes.join(', ')}
              </p>
            </div>
          </Card>
        ))}
    </div>
  );
}; 