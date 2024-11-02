import { ColorblindType, TestResult } from "./types";

interface FormTest {
  formSelector: string;
  validationStates: string[];
  colorblindTypes: ColorblindType[];
}

export async function testFormValidation(config: FormTest): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  for (const colorblindType of config.colorblindTypes) {
    const prompt = `Demonstrate how form validation appears to ${colorblindType} users:
      Form: ${config.formSelector}
      Show these states: ${config.validationStates.join(', ')}
      Focus on:
      - Error state visibility
      - Required field indicators
      - Success/completion feedback
      - Helper text contrast`;
      
    results.push(await generateAndAnalyze(prompt, { colorblindType }));
  }
  
  return results;
} 