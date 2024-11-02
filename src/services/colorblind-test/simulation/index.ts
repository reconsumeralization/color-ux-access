import { ColorblindType, SimulationAlgorithm } from '@/types';
import { GPU } from 'gpu.js';
import * as cv from 'opencv4nodejs';
import { PerformanceMonitor } from '../performance-monitoring';

export class ColorSimulator {
  private gpu: GPU;
  private monitor: PerformanceMonitor;

  constructor() {
    this.gpu = new GPU();
    this.monitor = new PerformanceMonitor();
  }

  async simulateColorblindness(
    image: cv.Mat, 
    type: ColorblindType, 
    algorithm: SimulationAlgorithm = 'machado'
  ): Promise<cv.Mat> {
    this.monitor.startOperation();

    try {
      const matrix = this.getSimulationMatrix(type, algorithm);
      const result = await this.applyTransformation(image, matrix);
      
      this.monitor.endOperation('transformationTime');
      return result;
    } catch (error) {
      console.error('Simulation failed:', error);
      throw error;
    }
  }

  private getSimulationMatrix(type: ColorblindType, algorithm: SimulationAlgorithm): number[][] {
    switch (algorithm) {
      case 'machado':
        return this.getMachadoMatrix(type);
      case 'brettel':
        return this.getBrettelMatrix(type);
      default:
        throw new Error(`Unsupported algorithm: ${algorithm}`);
    }
  }

  private getMachadoMatrix(type: ColorblindType): number[][] {
    // Machado et al. (2009) matrices
    const matrices = {
      protanopia: [
        [0.152286, 1.052583, -0.204868],
        [0.114503, 0.786281, 0.099216],
        [-0.003882, -0.048116, 1.051998]
      ],
      deuteranopia: [
        [0.367322, 0.860646, -0.227968],
        [0.280085, 0.672501, 0.047413],
        [-0.011820, 0.042940, 0.968881]
      ],
      tritanopia: [
        [1.255528, -0.076749, -0.178779],
        [-0.078411, 0.930809, 0.147602],
        [0.004733, 0.691367, 0.303900]
      ]
    };
    
    return matrices[type] || matrices.protanopia;
  }

  private async applyTransformation(image: cv.Mat, matrix: number[][]): Promise<cv.Mat> {
    const kernel = this.gpu.createKernel(function(pixels: number[][], matrix: number[][]) {
      const r = pixels[this.thread.y][this.thread.x * 3];
      const g = pixels[this.thread.y][this.thread.x * 3 + 1];
      const b = pixels[this.thread.y][this.thread.x * 3 + 2];

      return [
        matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b,
        matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b,
        matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b
      ];
    });

    const result = kernel(image.getDataAsArray(), matrix) as number[][][];
    return cv.matFromArray(image.rows, image.cols, cv.CV_8UC3, result.flat(2));
  }

  dispose(): void {
    this.gpu.destroy();
  }
} 