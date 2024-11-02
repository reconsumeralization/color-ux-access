import { TestResult } from '../colorblind-test/types';
import { ExportOptions, ExportFormat, ExportMetadata } from './types';
import { generatePDF } from './pdf-generator';
import { generateHTML } from './html-generator';
import { generateCSV } from './csv-generator';

export class ResultExporter {
  async exportResults(
    results: TestResult[],
    metadata: ExportMetadata,
    options: ExportOptions
  ): Promise<string> {
    const processedData = this.preprocessResults(results, metadata);
    
    switch (options.format) {
      case 'json':
        return this.exportJSON(processedData, options);
      case 'pdf':
        return this.exportPDF(processedData, options);
      case 'html':
        return this.exportHTML(processedData, options);
      case 'csv':
        return this.exportCSV(processedData, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  private preprocessResults(results: TestResult[], metadata: ExportMetadata) {
    return {
      metadata,
      summary: this.generateSummary(results),
      detailedResults: results.map(result => ({
        ...result,
        recommendations: this.generateRecommendations(result),
        wcagIssues: this.categorizeWCAGIssues(result)
      }))
    };
  }

  private async exportPDF(data: any, options: ExportOptions): Promise<string> {
    const template = await this.generatePDFTemplate(data, options);
    return generatePDF(template);
  }

  private async exportHTML(data: any, options: ExportOptions): Promise<string> {
    const template = this.generateHTMLTemplate(data, options);
    return generateHTML(template);
  }

  private exportJSON(data: any, options: ExportOptions): string {
    return JSON.stringify(data, null, 2);
  }

  private async exportCSV(data: any, options: ExportOptions): Promise<string> {
    const rows = this.flattenResultsForCSV(data);
    return generateCSV(rows);
  }

  private generateRecommendations(result: TestResult) {
    // Reference implementation from automated-workflow.ts
    return {
      critical: this.getPriorityIssues(result, 'high'),
      important: this.getPriorityIssues(result, 'medium'),
      suggestions: this.getPriorityIssues(result, 'low')
    };
  }

  private getPriorityIssues(result: TestResult, severity: string) {
    return result.issues
      .filter(issue => issue.severity === severity)
      .map(issue => ({
        issue: issue.description,
        recommendation: this.getRecommendation(issue)
      }));
  }

  private getRecommendation(issue: any) {
    // Implementation referenced from:
    ```typescript:src/services/colorblind-test/automated-workflow.ts
    startLine: 163
    endLine: 174
    ```
    return 'Recommendation based on issue type';
  }

  private categorizeWCAGIssues(result: TestResult) {
    // Implementation referenced from:
    ```typescript:src/services/colorblind-test/test-runner.ts
    startLine: 112
    endLine: 114
    ```
    return {};
  }
} 