import { UserAction, ColorblindType, TestResult } from "./types";
import { generateAndAnalyze } from "./utils";

interface InteractiveTest {
  url: string;
  userFlow: UserAction[];
  colorblindTypes: ColorblindType[];
}

export async function testUserFlow(config: InteractiveTest): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  for (const colorblindType of config.colorblindTypes) {
    const prompt = `Record a video showing how a ${colorblindType} user would experience this interaction flow:
      Starting at ${config.url}
      ${config.userFlow.map(action => 
        `- ${action.type} on ${action.target} ${action.value ? `with value "${action.value}"` : ''}`
      ).join('\n')}
      Highlight any color-based confusion or accessibility issues during each step.`;
      
    results.push(await generateAndAnalyze(prompt, { colorblindType }));
  }
  
  return results;
} 