import { Priority } from "@/types";

export enum ColorblindType {
  PROTANOPIA = 'protanopia', // Red-blind, difficulty distinguishing reds
  PROTANOMALY = 'protanomaly', // Red-weak, reduced red sensitivity
  DEUTERANOPIA = 'deuteranopia', // Green-blind, difficulty distinguishing greens 
  DEUTERANOMALY = 'deuteranomaly', // Green-weak, reduced green sensitivity
  TRITANOPIA = 'tritanopia', // Blue-blind, difficulty distinguishing blues/yellows
  TRITANOMALY = 'tritanomaly', // Blue-weak, reduced blue sensitivity
  ACHROMATOPSIA = 'achromatopsia', // Complete color blindness, only sees shades of gray
  ACHROMATOMALY = 'achromatomaly' // Partial color blindness, reduced color sensitivity
}

export enum AccessibilityIssueType {
  ColorContrast = 'color_contrast',
  TextReadability = 'text_readability', 
  InteractiveElement = 'interactive_element',
  MotionSensitivity = 'motion_sensitivity',
  FocusIndicator = 'focus_indicator',
  ColorAlone = 'color_alone', // When color is used as the only visual means of conveying information
  PatternVisibility = 'pattern_visibility', // For distinguishing UI elements without relying on color
  ColorOnly = "ColorOnly"
}

export interface ColorblindTestConfig {
  url: string;
  colorblindTypes: ColorblindType[];
  duration: number;
  resolution: {
    width: number;
    height: number;
  };
  interactionScenarios?: InteractionScenario[];
  wcagLevel?: 'A' | 'AA' | 'AAA';
  checkColorAlone?: boolean; // Test if color is used as only means of conveying info
  checkPatterns?: boolean; // Test if patterns/shapes supplement color differences
}

export interface InteractionScenario {
  name: string;
  actions: UserAction[];
  expectedOutcome: string;
}

export interface UserAction {
  type: 'click' | 'scroll' | 'hover' | 'focus' | 'input';
  target: string;
  value?: string;
  delay?: number;
}

export interface TestResult {
  url: string;
  timestamp: string;
  colorblindType: ColorblindType;
  metrics: AccessibilityMetrics;
  Issues: AccessibilityViolation[];
  score: number;
  status: 'completed' | 'failed' | 'pending';
  metadata: {
    browserInfo: string;
    testDuration: number;
    elementsCounted: number;
  };
}

export interface AccessibilityMetrics {
  contrast: {
    min: number;
    max: number;
    average: number;
    distribution: Record<string, number>;
  };
  readability: {
    score: number;
    issues: number;
    distribution: Record<string, number>;
  };
  elements: {
    interactive: number;
    focusable: number;
    animated: number;
    interactiveBreakdown: {
      buttons: number;
      links: number;
      inputs: number;
      other: number;
    };
  };
  performance: {
    cls: number;
    fcp: number;
    lcp: number;
    tti: number;
  };
}

export interface AccessibilityViolation {
  type: 'contrast' | 'readability' | 'focus-visibility' | 'missing-label';
  element: string;
  priority: Priority;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

export interface ChartModalOptions {
  title: string;
  description: string;
  // Add other properties as needed
}

export interface PerformanceMetrics {
  transformationTime: number;
  totalOperations: number;
  batchProcessingTime: number[];
}

export interface ColorSimulationMetrics extends PerformanceMetrics {
  averageTransformTime: number;
  averageBatchTime: number;
}

export interface MatrixWorkerData {
  batchData: Float32Array;
  matrixData: Float32Array;
  rows: number;
  cols: number;
  type: number;
}

export interface WorkerMessage {
  data: Float32Array;
  error?: string;
}

export interface AnalysisResult {
  contrast_ratio: number;
  readability_score: number;
  elements?: {
    interactive?: number;
    focusable?: number;
    animated?: number;
  };
}

export interface AccessibilityIssue {
  type: AccessibilityIssueType;
  severity: 'low' | 'medium' | 'high';
  description: string;
  location?: Location;
  impact?: string;
}