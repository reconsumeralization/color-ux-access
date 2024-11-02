import { TestResult } from '@/types';

export const generateTestSummary = (results: TestResult[]): string => {
  const summary = [
    `I've analyzed the test results for ${results.length} colorblind types.`,
    '',
    'Key findings:',
  ];

  results.forEach(result => {
    const issueCount = result.issues.length;
    const criticalIssues = result.issues.filter(i => i.severity === 'high').length;
    
    summary.push(
      `- ${result.colorblindType}: ${issueCount} issues found (${criticalIssues} critical)`
    );
  });

  return summary.join('\n');
};

export const generateRecommendations = (results: TestResult[]): string => {
  const recommendations = [
    'Based on the test results, here are my top recommendations:',
    ''
  ];

  // Group similar issues across different colorblind types
  const issueGroups = new Map();
  results.forEach(result => {
    result.issues.forEach(issue => {
      if (!issueGroups.has(issue.type)) {
        issueGroups.set(issue.type, []);
      }
      issueGroups.get(issue.type).push({
        ...issue,
        colorblindType: result.colorblindType
      });
    });
  });

  // Generate recommendations for each issue type
  issueGroups.forEach((issues, type) => {
    const highPriorityIssues = issues.filter((i: { severity: string; }) => i.severity === 'high');
    if (highPriorityIssues.length > 0) {
      recommendations.push(
        `Priority: ${type}`,
        `- ${highPriorityIssues[0].recommendation}`,
        `- Affects: ${highPriorityIssues.map((i: { colorblindType: any; }) => i.colorblindType).join(', ')}`,
        ''
      );
    }
  });

  return recommendations.join('\n');
}; 