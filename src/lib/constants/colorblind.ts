export const COLORBLIND_TYPES = {
  PROTANOPIA: 'protanopia',
  DEUTERANOPIA: 'deuteranopia',
  TRITANOPIA: 'tritanopia',
  ACHROMATOPSIA: 'achromatopsia'
} as const;

export const SEVERITY_WEIGHTS = {
  low: 1,
  medium: 2,
  high: 3
} as const;

export const WCAG_LEVELS = {
  A: 'A',
  AA: 'AA',
  AAA: 'AAA'
} as const; 