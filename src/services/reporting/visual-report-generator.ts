import { TestResult, ColorblindType, AccessibilityIssue, AccessibilityMetrics } from '../colorblind-test/types';
import { Chart } from 'chart.js';
import { createCanvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import { loadImage } from 'canvas';
import { AccessibilityViolation, TestResult } from '../colorblind-test/types';
    
interface ChartData {
  type: 'bar' | 'line' | 'pie';
  data: {
    labels: string[];
    datasets: {
      label?: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      fill?: boolean;
    }[];
  };
  options?: any;
}

export class VisualReportGenerator {
  private readonly outputDir: string;
  private readonly templateDir: string;

  constructor(config: { outputDir: string; templateDir: string }) {
    this.outputDir = config.outputDir;
    this.templateDir = config.templateDir;
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist() {
    [
      this.outputDir,
      path.join(this.outputDir, 'screenshots'),
      path.join(this.outputDir, 'charts'),
      path.join(this.outputDir, 'comparisons')
    ].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  private async generateCharts(results: TestResult[]): Promise<any> {
    const charts = {
      issuesByType: await this.createIssueTypeChart(results),
      contrastScores: await this.createContrastChart(results),
      accessibilityScores: await this.createScoreChart(results),
      issuesBySeverity: await this.createSeverityChart(results)
    };

    // Save charts as images
    for (const [name, chartData] of Object.entries(charts)) {
      const canvas = createCanvas(800, 400);
      const ctx = canvas.getContext('2d');
      new Chart(ctx, chartData);
      
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(
        path.join(this.outputDir, 'charts', `${name}.png`),
        buffer
      );
    }

    return charts;
  }

  private async createIssueTypeChart(results: TestResult[]): Promise<ChartData> {
    const issueTypes = new Map<string, number>();
    
    results.forEach(result => {
      result.issues.forEach(issue => {
        const count = issueTypes.get(issue.type) || 0;
        issueTypes.set(issue.type, count + 1);
      });
    });

    return {
      type: 'bar',
      data: {
        labels: Array.from(issueTypes.keys()),
        datasets: [{
          label: 'Issues by Type',
          data: Array.from(issueTypes.values()),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          borderWidth: 1
        }]
      }
    };
  }

  private async createContrastChart(results: TestResult[]): Promise<ChartData> {
    const labels = results.map(r => r.colorblindType);
    const minContrasts = results.map(r => r.metrics.contrastRatios.min);
    const avgContrasts = results.map(r => r.metrics.contrastRatios.average);
    const maxContrasts = results.map(r => r.metrics.contrastRatios.max);

    return {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Minimum Contrast',
            data: minContrasts,
            borderColor: ['#FF6384'],
            fill: false
          },
          {
            label: 'Average Contrast',
            data: avgContrasts,
            borderColor: ['#36A2EB'],
            fill: false
          },
          {
            label: 'Maximum Contrast',
            data: maxContrasts,
            borderColor: ['#4BC0C0'],
            fill: false
          }
        ]
      }
    };
  }

  private async createScoreChart(results: TestResult[]): Promise<ChartData> {
    const labels = results.map(r => r.colorblindType);
    const scores = results.map(r => r.accessibilityScore);

    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Accessibility Scores',
          data: scores,
          backgroundColor: scores.map(score => {
            if (score >= 80) return '#4CAF50';
            if (score >= 60) return '#FFA500';
            return '#F44336';
          }),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    };
  }

  private async createSeverityChart(results: TestResult[]): Promise<ChartData> {
    const severityCounts = {
      low: 0,
      medium: 0,
      high: 0
    };

    results.forEach(result => {
      result.Issues.forEach(violation => {
        severityCounts[violation.priority]++;
      });
    });

    return {
      type: 'pie',
      data: {
        labels: ['Low', 'Medium', 'High'],
        datasets: [{
          label: 'Issues by Severity',
          data: Object.values(severityCounts),
          backgroundColor: ['#FFA500', '#FF6900', '#FF0000'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    };
  }

  private async createSideBySideComparisons(results: TestResult[]): Promise<string[]> {
    const comparisons: string[] = [];
    
    for (const result of results) {
      const comparisonCanvas = createCanvas(1600, 800);
      const ctx = comparisonCanvas.getContext('2d');

      // Original screenshot
      const original = await this.loadImage(result.originalScreenshot as unknown as string);
      ctx.drawImage(original, 0, 0, 800, 800);

      // Simulated version
      const simulated = await this.loadImage(result.simulatedScreenshot as unknown as string);
      ctx.drawImage(simulated, 800, 0, 800, 800);

      // Add labels and annotations
      ctx.font = '24px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText('Original', 350, 30);
      ctx.fillText(`${result.colorblindType} Simulation`, 1150, 30);

      // Highlight issues
      this.annotateIssues(ctx, result.issues);

      const comparisonPath = path.join(
        this.outputDir, 
        'comparisons', 
        `comparison-${result.colorblindType}.png`
      );
      
      fs.writeFileSync(comparisonPath, comparisonCanvas.toBuffer('image/png'));
      comparisons.push(comparisonPath);
    }

    return comparisons;
  }

  private async loadImage(imagePath: string): Promise<any> {
    if (!imagePath) {
      throw new Error('Image path is required');
    }
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    try {
      return await loadImage(imagePath);
    } catch (error) {
      throw new Error(`Failed to load image ${imagePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private annotateIssues(ctx: any, issues: AccessibilityIssue[]): void {
    issues.forEach(issue => {
      if (issue.location) {
        ctx.strokeStyle = this.getSeverityColor(issue.severity);
        ctx.lineWidth = 2;
        ctx.strokeRect(
          issue.location.x,
          issue.location.y,
          issue.location.width,
          issue.location.height
        );
        
        // Add tooltip
        ctx.font = '14px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(
          issue.description,
          issue.location.x,
          issue.location.y - 5
        );
      }
    });
  }

  private getSeverityColor(severity: 'low' | 'medium' | 'high'): string {
    const colors = {
      low: '#FFA500',
      medium: '#FF6900',
      high: '#FF0000'
    };
    return colors[severity];
  }

  private generateHTMLReport(
    results: TestResult[], 
    charts: any, 
    comparisons: string[]
  ): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Colorblind Accessibility Report</title>
          ${this.getReportStyles()}
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
          <div class="container">
            <header>
              <h1>Colorblind Accessibility Report</h1>
              <p class="timestamp">Generated on: ${new Date().toLocaleString()}</p>
            </header>

            <section class="summary">
              <h2>Executive Summary</h2>
              ${this.generateExecutiveSummary(results)}
            </section>

            <section class="visualizations">
              <h2>Visual Analysis</h2>
              <div class="charts-grid">
                ${Object.entries(charts).map(([name, chart]) => `
                  <div class="chart-container">
                    <h3>${this.formatChartTitle(name)}</h3>
                    <img src="charts/${name}.png" alt="${name} chart">
                  </div>
                `).join('')}
              </div>
            </section>

            <section class="comparisons">
              <h2>Side-by-Side Comparisons</h2>
              ${comparisons.map(comp => `
                <div class="comparison-container">
                  <img src="${path.relative(this.outputDir, comp)}" 
                       alt="Side by side comparison">
                </div>
              `).join('')}
            </section>

            <section class="detailed-analysis">
              <h2>Detailed Analysis</h2>
              ${this.generateDetailedAnalysis(results)}
            </section>

            <section class="recommendations">
              <h2>Recommendations</h2>
              ${this.generateRecommendations(results)}
            </section>
          </div>
          ${this.getInteractiveScripts()}
        </body>
      </html>
    `;
  }

  private getReportStyles(): string {
    return `
      <style>
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .summary-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .stat-card { 
          padding: 20px;
          border-radius: 8px;
          background: #f5f5f5;
          text-align: center;
        }
        .charts-grid { 
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin: 20px 0;
        }
        .comparison-container { margin: 20px 0; }
        .analysis-card { 
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .score { font-size: 2em; font-weight: bold; }
        .score.good { color: #4CAF50; }
        .score.warning { color: #FFA500; }
        .score.poor { color: #F44336; }
      </style>
    `;
  }

  private formatChartTitle(name: string): string {
    return name
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private generateRecommendations(results: TestResult[]): string {
    const recommendations: string[] = [];
    const issueFrequency = new Map<string, number>();
    const severityCount = { high: 0, medium: 0, low: 0 };

    // Analyze issues
    results.forEach(result => {
      result.issues.forEach(issue => {
        // Track issue frequency
        const count = issueFrequency.get(issue.type) || 0;
        issueFrequency.set(issue.type, count + 1);
        
        // Track severity
        severityCount[issue.severity]++;
      });
    });

    // Generate high-priority recommendations
    if (severityCount.high > 0) {
      recommendations.push(`
        <div class="recommendation high-priority">
          <h4>🚨 Critical Issues</h4>
          <p>Found ${severityCount.high} high-severity issues that require immediate attention.</p>
        </div>
      `);
    }

    // Most common issues
    const commonIssues = Array.from(issueFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (commonIssues.length > 0) {
      recommendations.push(`
        <div class="recommendation">
          <h4>📊 Common Issues</h4>
          <ul>
            ${commonIssues.map(([type, count]) => `
              <li>${type}: Found ${count} occurrences</li>
            `).join('')}
          </ul>
        </div>
      `);
    }

    // Contrast recommendations
    const lowContrastResults = results.filter(r => 
      r.metrics.contrastRatios.average < 4.5
    );

    if (lowContrastResults.length > 0) {
      recommendations.push(`
        <div class="recommendation">
          <h4>🎨 Contrast Improvements</h4>
          <p>Low contrast detected in ${lowContrastResults.length} tests.</p>
          <ul>
            ${lowContrastResults.map(r => `
              <li>${r.colorblindType}: Average contrast ratio ${r.metrics.contrastRatios.average.toFixed(2)}</li>
            `).join('')}
          </ul>
        </div>
      `);
    }

    // General recommendations
    recommendations.push(`
      <div class="recommendation">
        <h4>💡 General Recommendations</h4>
        <ul>
          <li>Use patterns and textures in addition to colors for important UI elements</li>
          <li>Ensure text has sufficient contrast (minimum 4.5:1 for normal text)</li>
          <li>Provide alternative text for all meaningful images</li>
          <li>Test with different color vision simulations</li>
        </ul>
      </div>
    `);

    return `
      <div class="recommendations-container">
        ${recommendations.join('\n')}
      </div>
    `;
  }

  private getInteractiveScripts(): string {
    return `
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          // Add image comparison slider
          document.querySelectorAll('.comparison-container').forEach(container => {
            const img = container.querySelector('img');
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '100';
            slider.value = '50';
            slider.className = 'comparison-slider';
            
            slider.addEventListener('input', (e) => {
              const val = parseInt(e.target.value);
              img.style.clipPath = \`inset(0 \${100 - val}% 0 0)\`;
            });
            
            container.appendChild(slider);
          });

          // Add issue filtering
          const filterIssues = (severity) => {
            document.querySelectorAll('.issue').forEach(issue => {
              issue.style.display = severity === 'all' || 
                issue.classList.contains(severity) ? 'block' : 'none';
            });
          };

          document.querySelectorAll('.severity-filter').forEach(filter => {
            filter.addEventListener('click', (e) => {
              filterIssues(e.target.dataset.severity);
            });
          });
        });
      </script>
    `;
  }

  private generateExecutiveSummary(results: TestResult[]): string {
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
    const avgScore = results.reduce((sum, r) => sum + r.accessibilityScore, 0) / results.length;

    return `
      <div class="summary-stats">
        <div class="stat-card">
          <h3>Overall Score</h3>
          <div class="score ${this.getScoreClass(avgScore)}">
            ${avgScore.toFixed(1)}
          </div>
        </div>
        <div class="stat-card">
          <h3>Total Issues</h3>
          <div class="issue-count">
            ${totalIssues}
          </div>
        </div>
        <div class="stat-card">
          <h3>Tests Run</h3>
          <div class="test-count">
            ${results.length}
          </div>
        </div>
      </div>
    `;
  }

  private getScoreClass(score: number): string {
    if (score >= 80) return 'good';
    if (score >= 60) return 'warning';
    return 'poor';
  }

  private generateDetailedAnalysis(results: TestResult[]): string {
    return results.map(result => `
      <div class="analysis-card">
        <h3>${result.colorblindType} Analysis</h3>
        <div class="metrics-grid">
          ${this.generateMetricsTable(result.metrics)}
        </div>
        <div class="issues-list">
          ${this.generateIssuesList(result.issues)}
        </div>
      </div>
    `).join('');
  }

  private generateMetricsTable(metrics: AccessibilityMetrics): string {
    return `
      <table class="metrics-table">
        <tr>
          <th>Metric</th>
          <th>Minimum</th>
          <th>Average</th>
          <th>Maximum</th>
        </tr>
        <tr>
          <td>Contrast Ratio</td>
          <td>${metrics.contrastRatios.min.toFixed(2)}</td>
          <td>${metrics.contrastRatios.average.toFixed(2)}</td>
          <td>${metrics.contrastRatios.max.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Color Difference</td>
          <td>${metrics.colorDifferences.min.toFixed(2)}</td>
          <td>${metrics.colorDifferences.average.toFixed(2)}</td>
          <td>${metrics.colorDifferences.max.toFixed(2)}</td>
        </tr>
      </table>
    `;
  }

  private generateIssuesList(issues: AccessibilityIssue[]): string {
    if (issues.length === 0) return '<p>No issues found.</p>';
    
    return `
      <ul class="issues-list">
        ${issues.map(issue => `
          <li class="issue ${issue.severity}">
            <h4>${issue.type}</h4>
            <p>${issue.description}</p>
            ${issue.element ? `
              <div class="element-info">
                <code>Selector: ${issue.element.selector}</code>
              </div>
            ` : ''}
          </li>
        `).join('')}
      </ul>
    `;
  }

  private validateResults(results: TestResult[]): void {
    if (!Array.isArray(results)) {
      throw new Error('Results must be an array');
    }
    if (results.length === 0) {
      throw new Error('Results array cannot be empty');
    }

    results.forEach((result, index) => {
      if (!result.colorblindType || !Object.values(ColorblindType).includes(result.colorblindType)) {
        throw new Error(`Invalid colorblind type in result at index ${index}`);
      }
      if (typeof result.accessibilityScore !== 'number' || 
          result.accessibilityScore < 0 || 
          result.accessibilityScore > 100) {
        throw new Error(`Invalid accessibility score in result at index ${index}`);
      }
      if (!Array.isArray(result.issues)) {
        throw new Error(`Invalid issues array in result at index ${index}`);
      }
      if (!result.metrics || !result.metrics.contrastRatios) {
        throw new Error(`Invalid metrics in result at index ${index}`);
      }
    });
  }

  public async generateReport(results: TestResult[]): Promise<string> {
    try {
      this.validateResults(results);

      // Generate all visual elements
      const charts = await this.generateCharts(results).catch(error => {
        throw new Error(`Failed to generate charts: ${error.message}`);
      });

      const comparisons = await this.createSideBySideComparisons(results).catch(error => {
        throw new Error(`Failed to create comparisons: ${error.message}`);
      });
      
      // Generate HTML report
      const html = this.generateHTMLReport(results, charts, comparisons);
      
      // Save the report
      const reportPath = path.join(this.outputDir, 'report.html');
      try {
        fs.writeFileSync(reportPath, html);
      } catch (error) {
        throw new Error(`Failed to write report file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Copy assets
      await this.copyAssets().catch(error => {
        throw new Error(`Failed to copy assets: ${error.message}`);
      });

      return reportPath;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error generating report:', error.message);
      } else {
        console.error('An unknown error occurred.');
      }
      throw new Error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async copyAssets(): Promise<void> {
    const assets = [
      'styles/report.css',
      'scripts/interactive.js',
      'images/logo.png'
    ];

    for (const asset of assets) {
      const sourcePath = path.join(this.templateDir, asset);
      const targetPath = path.join(this.outputDir, asset);
      
      if (fs.existsSync(sourcePath)) {
        const targetDir = path.dirname(targetPath);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.copyFileSync(sourcePath, targetPath);
      }
    }
  }
} 