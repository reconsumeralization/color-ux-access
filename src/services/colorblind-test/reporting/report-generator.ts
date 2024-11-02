import { TestResult, AdvancedMetrics } from '../types';
import { generatePDF } from './pdf-generator';
import { createVisualization } from './visualization';

export class AccessibilityReportGenerator {
  async generateReport(
    results: TestResult,
    metrics: AdvancedMetrics,
    options: ReportOptions
  ): Promise<Report> {
    const report = {
      summary: this.generateSummary(results, metrics),
      details: await this.generateDetails(results, metrics),
      recommendations: this.generateRecommendations(results, metrics),
      visualizations: await this.generateVisualizations(results, metrics)
    };

    if (options.format === 'pdf') {
      return {
        ...report,
        pdf: await generatePDF(report)
      };
    }

    return report;
  }

  private generateSummary(
    results: TestResult,
    metrics: AdvancedMetrics
  ): ReportSummary {
    return {
      overallScore: this.calculateOverallScore(results, metrics),
      criticalIssues: this.identifyCriticalIssues(results),
      keyMetrics: this.summarizeKeyMetrics(metrics),
      complianceLevel: this.determineComplianceLevel(results)
    };
  }

  private async generateDetails(
    results: TestResult,
    metrics: AdvancedMetrics
  ): Promise<ReportDetails> {
    return {
      Issues: this.categorizeIssues(results.Issues),
      metrics: this.formatMetrics(metrics),
      performance: this.analyzePerformanceImpact(metrics.performance),
      userImpact: this.assessUserImpact(results, metrics)
    };
  }

  private generateRecommendations(
    results: TestResult,
    metrics: AdvancedMetrics
  ): Recommendation[] {
    return [
      ...this.generateContrastRecommendations(results),
      ...this.generateInteractionRecommendations(metrics),
      ...this.generateStructureRecommendations(metrics),
      ...this.generatePerformanceRecommendations(metrics)
    ].sort((a, b) => b.priority - a.priority);
  }

  private async generateVisualizations(
    results: TestResult,
    metrics: AdvancedMetrics
  ): Promise<ReportVisualizations> {
    return {
      contrastMap: await createVisualization('contrast', results),
      interactionHeatmap: await createVisualization('interaction', metrics),
      performanceTimeline: await createVisualization('performance', metrics),
      structureTree: await createVisualization('structure', metrics)
    };
  }
} 