import { ColorSimulationService } from '../color-simulation';
import { PerformanceMonitor } from '../performance-monitoring';
import * as cv from 'opencv4nodejs';
import { promises as fs } from 'fs';
import path from 'path';

describe('ColorSimulation Integration Tests', () => {
  let service: ColorSimulationService;
  let monitor: PerformanceMonitor;

  beforeAll(async () => {
    service = new ColorSimulationService();
    monitor = new PerformanceMonitor();
  });

  afterAll(async () => {
    await service.dispose();
  });

  describe('End-to-end Image Processing', () => {
    test('should process real images correctly', async () => {
      const testImagePath = path.join(__dirname, 'fixtures', 'test-image.png');
      const imageBuffer = await fs.readFile(testImagePath);
      const image = cv.imdecode(imageBuffer);

      monitor.startOperation();
      const result = await service.simulateColorblindness(image, 'protanopia', 0.8);
      monitor.endOperation('transformationTime');

      expect(result).toBeDefined();
      expect(result.empty).toBeFalsy();
      expect(result.channels()).toBe(3);
      
      const metrics = monitor.getMetrics();
      expect(metrics.transformationTime).toBeLessThan(1000);
    });
  });
}); 