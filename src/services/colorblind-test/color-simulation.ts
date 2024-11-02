import { Mat } from 'opencv-ts';
import { PerformanceMetrics, ColorSimulationMetrics } from './types';
import { MatrixWorker } from './matrix-worker';

export class ColorSimulationService {
  private metrics: ColorSimulationMetrics;
  private workerPool: MatrixWorker[];
  private matrixPool: Mat[];

  constructor() {
    this.metrics = {
      transformationTime: 0,
      totalOperations: 0,
      batchProcessingTime: [],
      averageTransformTime: 0,
      averageBatchTime: 0
    };
    this.workerPool = [];
    this.matrixPool = [];
  }

  private getWorker(): MatrixWorker {
    const worker = this.workerPool.pop() || new MatrixWorker();
    return worker;
  }

  private releaseWorker(worker: MatrixWorker): void {
    this.workerPool.push(worker);
  }

  async transformImage(mat: Mat, matrix: Mat, batchSize = 100): Promise<Mat> {
    const start = performance.now();
    const result = new Mat(mat.rows, mat.cols, mat.type());

    try {
      const channelCount = mat.channels();
      if (channelCount !== 3) {
        throw new Error(`Invalid channels: ${channelCount}`);
      }

      const batches = this.createBatches(mat, batchSize);
      const results = await Promise.all(
        batches.map((batch: any) => this.processBatch(batch, matrix))
      );

      await this.mergeBatchResults(result, results);
      await this.updateMetricsData(start);
      
      return result;
    } catch (error) {
      console.error('Image transformation failed:', error);
      throw error;
    }
  }
  createBatches(mat: Mat, batchSize: number) {
    throw new Error('Method not implemented.');
  }
  mergeBatchResults(result: any, results: any) {
    throw new Error('Method not implemented.');
  }
  updateMetricsData(start: number) {
    throw new Error('Method not implemented.');
  }

  private async processBatch(batch: Mat, matrix: Mat): Promise<Mat> {
    const worker = this.getWorker();
    try {
      const result = await new Promise<Mat>((resolve, reject) => {
        worker.postMessage({ 
          batchData: new Float32Array(batch.data),
          matrixData: new Float32Array(matrix.data),
          rows: batch.rows,
          cols: batch.cols,
          type: batch.type()
        });
        
        worker.once('message', (message: WorkerMessage) => {
          if (message.error) {
            reject(new Error(message.error));
            return;
          }
          const resultMat = new Mat(batch.rows, batch.cols, batch.type());
          resultMat.data.set(message.data);
          resolve(resultMat);
        });

        worker.once('error', reject);
      });

      return result;
    } finally {
      this.releaseWorker(worker);
    }
  }

  getMetrics(): ColorSimulationMetrics {
    return {
      ...this.metrics,
      averageTransformTime: this.metrics.transformationTime / this.metrics.totalOperations,
      averageBatchTime: this.metrics.batchProcessingTime.reduce((a: number, b: number) => a + b, 0) / 
                       Math.max(1, this.metrics.batchProcessingTime.length)
    };
  }

  cleanup(): void {
    this.workerPool.forEach(worker => worker.terminate());
    this.matrixPool.forEach(mat => mat.delete());
    this.matrixPool = [];
    this.metrics.batchProcessingTime = [];
  }
}