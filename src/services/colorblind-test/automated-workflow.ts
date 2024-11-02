import { chromium, Browser, Page, ElementHandle } from 'playwright';
import { ColorblindSimulator } from './simulation';
import { TestResult, ColorblindType, Priority, AccessibilityViolation } from '@/types';
import { pipeline } from '@xenova/transformers';
import PQueue from 'p-queue';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import { analyzeContrast, analyzeReadability } from './analysis';

interface PriorityTest {
  name: Priority;
  weight: number;
  execute: (page: Page, type: ColorblindType) => Promise<PriorityResult>;
}

interface PriorityResult {
  score: number;
  Issues: AccessibilityViolation[];
  metadata: Record<string, any>;
}

export class AutomatedWorkflowTester {
  private browser: Browser | null = null;
  private pages: Map<Priority, Page> = new Map();
  private simulator: ColorblindSimulator;
  private visionModel: any;
  private ocrWorker: Tesseract.Worker;
  private queue: PQueue;

  private readonly priorities: PriorityTest[] = [
    {
      name: 'critical',
      weight: 0.4,
      execute: this.testCriticalFunctionality.bind(this)
    },
    {
      name: 'essential',
      weight: 0.3,
      execute: this.testEssentialFeatures.bind(this)
    },
    {
      name: 'enhancement',
      weight: 0.2,
      execute: this.testEnhancements.bind(this)
    },
    {
      name: 'optional',
      weight: 0.1,
      execute: this.testOptionalFeatures.bind(this)
    }
  ];

  constructor(private ariaApiKey: string) {
    this.simulator = new ColorblindSimulator(this.ariaApiKey);
    this.queue = new PQueue({ concurrency: 4 });
    this.ocrWorker = createWorker();
  }

  private async initializeServices() {
    try {
      // Initialize vision model
      this.visionModel = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');
      
      // Initialize OCR worker
      this.ocrWorker = await createWorker('eng');
      
      console.log('Services initialized successfully');
    } catch (error) {
      console.error('Service initialization failed:', error);
      throw new Error('Failed to initialize testing services');
    }
  }

  async runPriorityTests(url: string, type: ColorblindType): Promise<TestResult> {
    const startTime = Date.now();
    try {
      await this.setupBrowsers(url);
      
      // Run priority tests in parallel
      const priorityResults = await Promise.all(
        this.priorities.map(priority =>
          this.queue.add(() => this.runPriorityTest(priority, type))
        )
      );

      // Aggregate results
      const result = this.aggregateResults(priorityResults, type, startTime);
      
      // Generate recommendations
      const recommendations = await this.generateRecommendations(result);
      
      return {
        ...result,
        recommendations,
        duration: Date.now() - startTime
      };

    } catch (error) {
      console.error('Priority testing failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  private async testCriticalFunctionality(page: Page, type: ColorblindType): Promise<PriorityResult> {
    const Issues: AccessibilityViolation[] = [];
    
    // Test navigation and core functionality
    try {
      // Check main navigation
      const navElements = await page.$$('nav a, nav button');
      for (const element of navElements) {
        const contrast = await analyzeContrast(element);
        if (contrast < 4.5) { // WCAG AA standard
          Issues.push({
            type: 'contrast',
            element: await element.evaluate(el => el.outerHTML),
            priority: 'critical',
            impact: 'high'
          });
        }
      }

      // Check form submissions
      const forms = await page.$$('form');
      for (const form of forms) {
        const inputs = await form.$$('input, select, textarea');
        for (const input of inputs) {
          const label = await this.findAssociatedLabel(input);
          if (!label) {
            Issues.push({
              type: 'missing-label',
              element: await input.evaluate(el => el.outerHTML),
              priority: 'critical',
              impact: 'high'
            });
          }
        }
      }

      return {
        score: this.calculateScore(Issues, 'critical'),
        Issues,
        metadata: {
          navCount: navElements.length,
          formCount: forms.length
        }
      };

    } catch (error) {
      console.error('Critical functionality test failed:', error);
      throw error;
    }
  }

  private async testEssentialFeatures(page: Page, type: ColorblindType): Promise<PriorityResult> {
    const Issues: AccessibilityViolation[] = [];

    try {
      // Test interactive elements
      const interactiveElements = await page.$$('button, a, [role="button"]');
      for (const element of interactiveElements) {
        // Check focus visibility
        await element.focus();
        const focusVisible = await element.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return styles.outlineStyle !== 'none' || styles.boxShadow !== 'none';
        });

        if (!focusVisible) {
          Issues.push({
            type: 'focus-visibility',
            element: await element.evaluate(el => el.outerHTML),
            priority: 'essential',
            impact: 'medium'
          });
        }
      }

      return {
        score: this.calculateScore(Issues, 'essential'),
        Issues,
        metadata: {
          interactiveElementCount: interactiveElements.length
        }
      };

    } catch (error) {
      console.error('Essential features test failed:', error);
      throw error;
    }
  }

  private async findAssociatedLabel(input: ElementHandle): Promise<ElementHandle | null> {
    const id = await input.evaluate(el => el.id);
    if (id) {
      return await input.evaluateHandle(el => 
        document.querySelector(`label[for="${el.id}"]`)
      );
    }
    return null;
  }

  private calculateScore(Issues: AccessibilityViolation[], priority: Priority): number {
    const weights = {
      critical: 1,
      high: 0.8,
      medium: 0.5,
      low: 0.3
    };

    const totalImpact = Issues.reduce((sum, violation) => 
      sum + weights[violation.impact], 0);

    return Math.max(0, 100 - (totalImpact * 10));
  }

  private async generateRecommendations(result: TestResult): Promise<string[]> {
    const recommendations: string[] = [];

    // Analyze Issues and generate specific recommendations
    for (const violation of result.Issues) {
      switch (violation.type) {
        case 'contrast':
          recommendations.push(
            `Increase contrast ratio for ${violation.element} to meet WCAG AA standards`
          );
          break;
        case 'focus-visibility':
          recommendations.push(
            `Add visible focus indicator for ${violation.element}`
          );
          break;
        // Add more cases as needed
      }
    }

    return recommendations;
  }

  private async cleanup(): Promise<void> {
    for (const [_, page] of this.pages) {
      await page.close();
    }
    await this.browser?.close();
    await this.ocrWorker.terminate();
    this.pages.clear();
  }
}