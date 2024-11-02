export const TEST_TYPES = {
  STATIC: 'static',
  INTERACTIVE: 'interactive',
  FORM: 'form',
  COMPONENT: 'component',
  DYNAMIC: 'dynamic'
} as const;

export const ANALYSIS_TASKS = {
  ELEMENT_VISIBILITY: 'analyze_element_visibility',
  CONTRAST_RATIO: 'check_contrast_ratio',
  TEXT_READABILITY: 'detect_text_readability'
} as const; 