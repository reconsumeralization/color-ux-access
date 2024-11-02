export interface PerformanceMetrics {
  matrixCreationTime: number;
  transformationTime: number;
  matrixReuseCount: number;
  totalOperations: number;
  peakMemoryUsage: number;
  workerUtilization: Record<number, number>;
  batchProcessingTime: number[];
  averageTransformTime?: number;
  averageBatchTime?: number;
  memoryUtilization?: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    matrixCreationTime: 0,
    transformationTime: 0,
    matrixReuseCount: 0,
    totalOperations: 0,
    peakMemoryUsage: 0,
    workerUtilization: {},
    batchProcessingTime: []
  };
  private startTime: number = 0;

  constructor() {
    this.reset();
  }

  startOperation(): void {
    this.startTime = performance.now();
  }

  endOperation(type: keyof PerformanceMetrics): void {
    const duration = performance.now() - this.startTime;
    if (typeof this.metrics[type] === 'number') {
      (this.metrics[type] as number) += duration;
    }
  }

  updateWorkerUtilization(workerId: number): void {
    this.metrics.workerUtilization[workerId] = 
      (this.metrics.workerUtilization[workerId] || 0) + 1;
  }

  getMetrics(): PerformanceMetrics {
    const memUsage = process.memoryUsage();
    return {
      ...this.metrics,
      averageTransformTime: this.metrics.transformationTime / this.metrics.totalOperations,
      averageBatchTime: this.calculateAverageBatchTime(),
      memoryUtilization: memUsage.heapUsed / memUsage.heapTotal
    };
  }

  private calculateAverageBatchTime(): number {
    return this.metrics.batchProcessingTime.reduce((a, b) => a + b, 0) / 
           this.metrics.batchProcessingTime.length;
  }

  private reset(): void {
    this.metrics = {
      matrixCreationTime: 0,
      transformationTime: 0,
      matrixReuseCount: 0,
      totalOperations: 0,
      peakMemoryUsage: 0,
      workerUtilization: {},
      batchProcessingTime: []
    };
  }
} 