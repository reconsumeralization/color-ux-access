import { ColorblindType, TestResult } from "./types";
import { generateAndAnalyze } from "./utils";

interface ComponentTest {
  component: string;
  states: string[];
  colorblindTypes: ColorblindType[];
}

export async function testComponent(config: ComponentTest): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  for (const colorblindType of config.colorblindTypes) {
    for (const state of config.states) {
      const prompt = `Show how the ${config.component} appears in ${state} state to a ${colorblindType} user. 
        Focus on:
        - Color differences between states
        - Button/link visibility
        - Status indicator clarity
        - Text contrast against background`;
        
      results.push(await generateAndAnalyze(prompt, { colorblindType }));
    }
  }
  
  return results;
} 