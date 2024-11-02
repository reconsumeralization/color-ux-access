import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { MatrixWorkerData, WorkerMessage } from './types';

if (!isMainThread) {
  parentPort?.on('message', (data: MatrixWorkerData) => {
    try {
      const { batchData, matrixData, rows, cols } = data;
      const result = new Float32Array(rows * cols * 3);

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const idx = (i * cols + j) * 3;
          for (let k = 0; k < 3; k++) {
            let sum = 0;
            for (let l = 0; l < 3; l++) {
              sum += batchData[idx + l] * matrixData[k * 3 + l];
            }
            result[idx + k] = sum;
          }
        }
      }

      parentPort?.postMessage({ data: result } as WorkerMessage);
    } catch (error) {
      parentPort?.postMessage({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      } as WorkerMessage);
    }
  });
}

export class MatrixWorker {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(__filename);
  }

  postMessage(data: MatrixWorkerData): void {
    this.worker.postMessage(data);
  }

  once(event: 'message', callback: (data: WorkerMessage) => void): void;
  once(event: 'error', callback: (error: Error) => void): void;
  once(event: string, callback: (data: any) => void): void {
    this.worker.once(event, callback);
  }

  terminate(): Promise<number> {
    return this.worker.terminate();
  }
} 