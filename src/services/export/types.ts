import { ColorblindType } from "@/types";

export type ExportFormat = 'json' | 'pdf' | 'html' | 'csv';

export interface ExportOptions {
  format: ExportFormat;
  includeScreenshots: boolean;
  includeVideos: boolean;
  detailedMetrics: boolean;
  wcagCompliance: boolean;
  recommendations: boolean;
}

export interface ExportMetadata {
  timestamp: string;
  url: string;
  testDuration: number;
  testTypes: string[];
  colorblindTypes: string[];
}

export enum TestType {
  Static = 'static',
  Interactive = 'interactive',
  Forms = 'forms',
}

export interface TestConfig {
  url: string;
  colorblindTypes: ColorblindType[];
  testTypes: {
    static: boolean;
    interactive: boolean;
    forms: boolean;
  };
  userFlow?: UserAction[];
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
  originalScreenshot: any;
  simulatedScreenshot: any;
  videoUrl: string;
  timestamp: string;
  colorblindType: ColorblindType;
  accessibilityScore: number;
  issues: AccessibilityIssue[];
  wcagIssues: WCAGViolation[];
  metrics: AccessibilityMetrics;
}

export interface AccessibilityIssue {
  location: any;
  element: any;
  timestamp: number;
  type: AccessibilityIssueType;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
  elementSelector?: string;
  screenshotUrl?: string;
  alternativeText?: string; // Suggested text alternative when color alone is used
}

export enum AccessibilityIssueType {
  ColorContrast = 'colorContrast',
  MissingAltText = 'missingAltText',
  KeyboardNavigation = 'keyboardNavigation',
  FocusIndicator = 'focusIndicator',
  SemanticStructure = 'semanticStructure',
  ColorOnly = 'colorOnly',
  AnimationControl = 'animationControl'
}

export interface WCAGViolation {
  criterion: string;
  level: 'A' | 'AA' | 'AAA';
  description: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  elements: string[];
}

export interface AccessibilityMetrics {
  colorDifferences: any;
  contrastRatios: {
    min: number;
    max: number;
    average: number;
  };
  readabilityScore: number;
  interactiveElementsCount: number;
  focusableElementsCount: number;
  animationCount: number;
  colorOnlyElements: number; // Count of elements using only color to convey info
  patternSupplementedElements: number; // Count of elements using patterns with color
} 