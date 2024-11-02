import { ColorblindType, TestResult } from "./types";
import { generateAndAnalyze } from "./utils";

interface DynamicTest {
  url: string;
  triggers: string[];
  colorblindTypes: ColorblindType[];
}

export async function testDynamicContent(config: DynamicTest): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  for (const colorblindType of config.colorblindTypes) {
    const prompt = `Create a video showing how ${colorblindType} users experience dynamic content changes:
      Website: ${config.url}
      Trigger these events: ${config.triggers.join(', ')}
      Show:
      - Transition visibility
      - Color-based feedback
      - Loading states
      - Error/success messages`;
      
    results.push(await generateAndAnalyze(prompt, { colorblindType }));
  }
  
  return results;
} 