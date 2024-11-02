export type ColorblindType = 
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia';

export type Priority = 'critical' | 'essential' | 'enhancement' | 'optional';

export interface TestConfig {
  url: string;
  colorblindTypes: ColorblindType[];
  priorities: Priority[];
}

export interface AccessibilityMetrics {
  elementsCounted: number;
  IssuesFound: number;
  processingTime: number;
  contrastIssues: number;
  readabilityScore: number;
}

export interface AccessibilityIssue {
  type: AccessibilityIssueType;
  priority: Priority;
  element: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

export type AccessibilityIssueType = 
  | 'contrast'
  | 'readability'
  | 'colorCoding'
  | 'textSize';

export interface TestResult {
  id?: string;
  url?: string;
  colorblindType: ColorblindType;
  timestamp: string;
  status: 'completed' | 'failed' | 'pending';
  duration?: number;
  Issues: AccessibilityViolation[];
  recommendations: string[];
  scores: {
    critical: number;
    essential: number;
    enhancement: number;
    optional: number;
    overall: number;
  };
  metadata: {
    pageUrl: string;
    browserInfo: string;
    testDuration: number;
    elementsCounted: number;
    IssuesFound: number;
  };
  originalScreenshot?: string;
  simulatedScreenshot?: string;
}

declare namespace NodeJS {
  interface ProcessEnv {
    ALLEGRO_API_KEY: string;
    ARIA_API_KEY: string;
    NEXT_PUBLIC_API_URL: string;
  }
}
