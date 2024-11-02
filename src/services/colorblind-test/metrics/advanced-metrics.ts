import { Page, ElementHandle } from 'playwright';
import { ColorblindType } from '@/types';

export interface AdvancedMetrics {
  performance: PerformanceMetrics;
  interaction: InteractionMetrics;
  visual: VisualMetrics;
  semantic: SemanticMetrics;
}

export class AdvancedMetricsCollector {
  async collectMetrics(page: Page, type: ColorblindType): Promise<AdvancedMetrics> {
    return {
      performance: await this.collectPerformanceMetrics(page),
      interaction: await this.collectInteractionMetrics(page),
      visual: await this.collectVisualMetrics(page),
      semantic: await this.collectSemanticMetrics(page)
    };
  }

  private async collectPerformanceMetrics(page: Page): Promise<PerformanceMetrics> {
    const metrics = await page.evaluate(() => ({
      cls: performance.getEntriesByType('layout-shift')
        .reduce((sum, entry: any) => sum + entry.value, 0),
      fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime
    }));

    return {
      cumulativeLayoutShift: metrics.cls,
      firstContentfulPaint: metrics.fcp,
      largestContentfulPaint: metrics.lcp,
      timeToInteractive: await this.measureTimeToInteractive(page)
    };
  }

  private async collectInteractionMetrics(page: Page): Promise<InteractionMetrics> {
    const interactions = await page.evaluate(() => {
      const interactive = document.querySelectorAll('button, a, input, [role="button"]');
      return Array.from(interactive).map(el => ({
        type: el.tagName.toLowerCase(),
        size: el.getBoundingClientRect(),
        hasKeyboardHandler: el.hasAttribute('onkeydown') || el.hasAttribute('onkeyup'),
        hasClickHandler: el.hasAttribute('onclick'),
        isAccessible: el.getAttribute('aria-label') !== null
      }));
    });

    return {
      totalInteractive: interactions.length,
      keyboardAccessible: interactions.filter(i => i.hasKeyboardHandler).length,
      mouseOnly: interactions.filter(i => !i.hasKeyboardHandler && i.hasClickHandler).length,
      smallTargets: interactions.filter(i => i.size.width < 44 || i.size.height < 44).length,
      missingLabels: interactions.filter(i => !i.isAccessible).length
    };
  }

  private async collectVisualMetrics(page: Page): Promise<VisualMetrics> {
    return {
      colorPalette: await this.analyzeColorPalette(page),
      typography: await this.analyzeTypography(page),
      spacing: await this.analyzeSpacing(page),
      animations: await this.analyzeAnimations(page)
    };
  }

  private async collectSemanticMetrics(page: Page): Promise<SemanticMetrics> {
    return {
      headingStructure: await this.analyzeHeadingStructure(page),
      landmarkRegions: await this.analyzeLandmarks(page),
      contentStructure: await this.analyzeContentStructure(page)
    };
  }
} 