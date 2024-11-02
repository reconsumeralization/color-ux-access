import { afterEach, beforeEach, describe, test, expect } from '@jest/globals';
import { ColorSimulationService } from '../color-simulation';
import * as cv from 'opencv4nodejs';
import { ColorSimulationMetrics } from '../types';

describe('ColorSimulationService', () => {
  let service: ColorSimulationService;
  let testImage: cv.Mat;

  beforeEach(() => {
    service = new ColorSimulationService();
    // Create a test image 100x100 pixels, RGB
    testImage = new cv.Mat(100, 100, cv.CV_8UC3);
  });

  afterEach(() => {
    if (testImage) {
      testImage.delete(); // Using delete() instead of release()
    }
  });

  test('should initialize with correct worker pool', () => {
    const metrics = service.getMetrics() as ColorSimulationMetrics & {
      workerUtilization: Record<string, number>
    };
    expect(metrics.workerUtilization).toHaveProperty('0');
    expect(Object.keys(metrics.workerUtilization)).toHaveLength(4);
  });

  test('should handle image transformation correctly', async () => {
    const result = await service.transform(testImage, 'protanopia', 1.0);
    expect(result.rows).toBe(testImage.rows);
    expect(result.cols).toBe(testImage.cols);
    expect(result.channels()).toBe(3);
  });

  test('should handle invalid inputs gracefully', async () => {
    await expect(service.transform(
      null as unknown as cv.Mat,
      'protanopia',
      1.0
    )).rejects.toThrow('Invalid input matrix');
  });

  test('should maintain performance within acceptable bounds', async () => {
    const start = performance.now();
    await service.transform(testImage, 'protanopia', 1.0);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(1000); // Should process within 1 second
    const metrics = service.getMetrics() as ColorSimulationMetrics & {
      peakMemoryUsage: number
    };
    expect(metrics.peakMemoryUsage).toBeLessThan(1024); // Less than 1GB
  });
});