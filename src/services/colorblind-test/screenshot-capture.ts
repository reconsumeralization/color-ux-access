import { AccessibilityIssue, ColorblindType } from './types';
import { Browser, chromium } from 'playwright';

export class AccessibilityScreenshotCapture {
  private browser: Browser | null = null;

  async init() {
    this.browser = await chromium.launch({ headless: true });
  }

  async captureIssueScreenshots(
    url: string,
    issues: AccessibilityIssue[],
    colorblindType: ColorblindType
  ): Promise<AccessibilityIssue[]> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call init() first.');
    }

    const context = await this.browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      await this.injectColorblindSimulation(page, colorblindType);

      const enhancedIssues = await Promise.all(
        issues.map(async (issue) => {
          if (issue.elementSelector) {
            const screenshotPath = `./screenshots/issue-${Date.now()}-${colorblindType}.png`;
            
            // Highlight the problematic element
            await page.evaluate((selector) => {
              const element = document.querySelector(selector);
              if (element) {
                element.style.outline = '3px solid red';
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, issue.elementSelector);

            // Take screenshot of the area
            await page.screenshot({
              path: screenshotPath,
              clip: await this.getElementClip(page, issue.elementSelector)
            });

            return {
              ...issue,
              screenshotUrl: screenshotPath
            };
          }
          return issue;
        })
      );

      return enhancedIssues;
    } finally {
      await context.close();
    }
  }

  private async getElementClip(page: any, selector: string) {
    const element = await page.$(selector);
    if (!element) return null;

    const box = await element.boundingBox();
    return {
      x: box.x - 10,
      y: box.y - 10,
      width: box.width + 20,
      height: box.height + 20
    };
  }

  private async injectColorblindSimulation(page: any, type: ColorblindType) {
    // Reuse the colorblind simulation CSS from the previous implementation
    // Referenced from previous implementation
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
} 