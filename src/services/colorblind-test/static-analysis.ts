import { ColorblindType, TestResult } from "./types";
import { generateAndAnalyze } from "./utils";

interface StaticPageTest {
  url: string;
  elementSelectors: string[];
  colorblindType: ColorblindType;
  analysisOptions?: {
    checkContrast?: boolean;
    checkReadability?: boolean;
    checkInteractiveElements?: boolean;
    checkAnimations?: boolean;
    checkColorCombinations?: boolean;
    checkPatternVisibility?: boolean;
    checkInformationHierarchy?: boolean;
    checkErrorStates?: boolean;
  };
  wcagLevel?: 'A' | 'AA' | 'AAA';
}

async function testStaticPage(config: StaticPageTest): Promise<TestResult> {
  const analysisPoints = [
    'Show how colors appear',
    'Highlight potential issues with contrast and readability',
    config.analysisOptions?.checkContrast && '- Analyze color contrast ratios against WCAG standards',
    config.analysisOptions?.checkReadability && '- Check text readability with different background colors',
    config.analysisOptions?.checkInteractiveElements && '- Verify interactive element visibility',
    config.analysisOptions?.checkAnimations && '- Assess animation impact on visibility',
    config.analysisOptions?.checkColorCombinations && '- Evaluate color combinations for confusion risks',
    config.analysisOptions?.checkPatternVisibility && '- Assess pattern and texture visibility',
    config.analysisOptions?.checkInformationHierarchy && '- Verify visual hierarchy remains clear',
    config.analysisOptions?.checkErrorStates && '- Check error state visibility and recognition'
  ].filter(Boolean);

  const prompt = `Analyze the webpage at ${config.url} from the perspective of a ${config.colorblindType} user.
    Focus on these elements: ${config.elementSelectors.join(', ')}.
    ${analysisPoints.join('\n    ')}
    WCAG Compliance Level: ${config.wcagLevel || 'AA'}
    
    Generate a detailed analysis showing:
    1. How each selected element appears
    2. Potential accessibility barriers
    3. Color contrast issues
    4. Interactive element visibility
    5. Text readability concerns`;
    
  const result = await generateAndAnalyze(prompt, {
    ...config
  });

  return {
    ...result,
    metrics: {
      ...result.metrics,
    }
  };
}

export type { StaticPageTest };
export { testStaticPage };