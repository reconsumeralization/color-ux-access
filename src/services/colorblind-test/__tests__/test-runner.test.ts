import { ColorblindTestRunner } from '../test-runner';
import { createMockPage } from './test-utils';
import { ColorblindType } from '../types';

describe('ColorblindTestRunner', () => {
  let runner: ColorblindTestRunner;
  let mockPage: any;

  beforeEach(() => {
    runner = new ColorblindTestRunner();
    mockPage = createMockPage();
  });

  describe('contrast checks', () => {
    it('should detect low contrast text', async () => {
      mockPage.addElement('p', {
        color: '#777',
        backgroundColor: '#666',
        fontSize: '16px'
      });

      const violations = await runner.checkContrast(mockPage);
      expect(violations).toHaveLength(1);
      expect(violations[0].type).toBe('contrast');
    });

    it('should handle large text differently', async () => {
      mockPage.addElement('h1', {
        color: '#666',
        backgroundColor: '#444',
        fontSize: '24px'
      });

      const violations = await runner.checkContrast(mockPage);
      expect(violations[0].details.requiredContrast).toBe(3);
    });
  });

  describe('readability checks', () => {
    it('should detect small text', async () => {
      mockPage.addElement('p', {
        fontSize: '10px',
        lineHeight: '1.2',
        text: 'Sample text'
      });

      const violations = await runner.checkReadability(mockPage);
      expect(violations).toHaveLength(1);
      expect(violations[0].description).toContain('Font size');
    });

    it('should check line height', async () => {
      mockPage.addElement('p', {
        fontSize: '16px',
        lineHeight: '16px',
        text: 'Sample text'
      });

      const violations = await runner.checkReadability(mockPage);
      expect(violations[0].description).toContain('Line height');
    });
  });

  describe('metrics collection', () => {
    it('should collect performance metrics', async () => {
      const metrics = await runner.collectAdditionalMetrics(mockPage);
      expect(metrics.performance).toBeDefined();
      expect(metrics.performance.cls).toBeDefined();
    });

    it('should analyze color usage', async () => {
      mockPage.addElement('div', {
        backgroundColor: '#f00',
        color: '#000'
      });

      const metrics = await runner.collectAdditionalMetrics(mockPage);
      expect(metrics.colors.uniqueColors).toBeGreaterThan(0);
    });
  });
}); 