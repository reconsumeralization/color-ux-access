import { Mat } from 'opencv4nodejs';
import { PerformanceMonitor } from '../performance-monitoring';

export class BatchProcessor {
  constructor(
    private readonly monitor: PerformanceMonitor,
    private readonly batchSize: number = 1000
  ) {}

  async processBatches(
    mat: Mat,
    processor: (batch: Mat) => Promise<Mat>
  ): Promise<Mat[]> {
    const batches: Mat[] = this.splitIntoBatches(mat);
    const results: Mat[] = [];

    for (const batch of batches) {
      this.monitor.startOperation();
      const result = await processor(batch);
      this.monitor.endOperation('batchProcessingTime');
      results.push(result);
    }

    return results;
  }

  private splitIntoBatches(mat: Mat): Mat[] {
    const batches: Mat[] = [];
    for (let i = 0; i < mat.rows; i += this.batchSize) {
      const rows = Math.min(this.batchSize, mat.rows - i);
      const batch = mat.getRegion({ y: i, height: rows });
      batches.push(batch);
    }
    return batches;
  }
} 