import { AccessibilityMetrics, AccessibilityIssue } from '../colorblind-test/types';

export class AccessibilityScorer {
  private readonly weights = {
    contrast: 0.3,
    readability: 0.2,
    colorDependency: 0.2,
    interactivity: 0.15,
    patterns: 0.15
  };

  calculateScore(metrics: AccessibilityMetrics, issues: AccessibilityIssue[]): number {
    const scores = {
      contrast: this.calculateContrastScore(metrics.contrastRatios),
      readability: this.calculateReadabilityScore(metrics.readabilityScore),
      colorDependency: this.calculateColorDependencyScore(metrics, issues),
      interactivity: this.calculateInteractivityScore(metrics),
      patterns: this.calculatePatternScore(metrics)
    };

    // Calculate weighted average
    return Object.entries(scores).reduce((total, [key, score]) => {
      return total + score * this.weights[key as keyof typeof this.weights];
    }, 0);
  }

  private calculateContrastScore(ratios: { min: number; max: number; average: number }): number {
    // WCAG 2.1 guidelines: minimum 4.5:1 for normal text, 3:1 for large text
    const minScore = Math.min(100, (ratios.min / 4.5) * 100);
    const avgScore = Math.min(100, (ratios.average / 7) * 100);
    return (minScore * 0.7 + avgScore * 0.3);
  }

  private calculateReadabilityScore(score: number): number {
    // Based on Flesch Reading Ease score (0-100)
    return Math.max(0, Math.min(100, score));
  }

  private calculateColorDependencyScore(
    metrics: AccessibilityMetrics,
    issues: AccessibilityIssue[]
  ): number {
    const colorOnlyRatio = metrics.colorOnlyElements / metrics.interactiveElementsCount;
    const colorIssues = issues.filter(i => i.type === 'color-dependency').length;
    
    return Math.max(0, 100 - (colorOnlyRatio * 50 + colorIssues * 10));
  }

  private calculateInteractivityScore(metrics: AccessibilityMetrics): number {
    const focusableRatio = metrics.focusableElementsCount / metrics.interactiveElementsCount;
    return Math.min(100, focusableRatio * 100);
  }

  private calculatePatternScore(metrics: AccessibilityMetrics): number {
    const patternRatio = metrics.patternSupplementedElements / metrics.colorOnlyElements;
    return Math.min(100, patternRatio * 100);
  }
} 