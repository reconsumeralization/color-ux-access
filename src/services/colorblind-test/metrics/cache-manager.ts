import LRU from 'lru-cache';
import { ElementMetrics, AnalysisCache } from '../types';

export class MetricsCache {
  private elementCache: LRU<string, ElementMetrics>;
  private analysisCache: LRU<string, AnalysisCache>;

  constructor() {
    this.elementCache = new LRU({
      max: 500,
      maxAge: 1000 * 60 * 5 // 5 minutes
    });

    this.analysisCache = new LRU({
      max: 100,
      maxAge: 1000 * 60 * 15 // 15 minutes
    });
  }

  getCachedMetrics(selector: string): ElementMetrics | undefined {
    return this.elementCache.get(selector);
  }

  setCachedMetrics(selector: string, metrics: ElementMetrics): void {
    this.elementCache.set(selector, metrics);
  }

  getCachedAnalysis(url: string, type: string): AnalysisCache | undefined {
    return this.analysisCache.get(`${url}-${type}`);
  }

  setCachedAnalysis(url: string, type: string, analysis: AnalysisCache): void {
    this.analysisCache.set(`${url}-${type}`, analysis);
  }
} 