import { NextResponse } from 'next/server';
import { AutomatedWorkflowTester } from '@/services/colorblind-test/automated-workflow';
import { TestConfig, TestResult, ColorblindType } from '@/types';

export async function POST(request: Request) {
  try {
    const config: TestConfig = await request.json();

    const tester = new AutomatedWorkflowTester('your-aria-api-key'); // Replace with actual API key if needed

    const results: TestResult[] = await Promise.all(
      config.colorblindTypes.map(async (type: ColorblindType) => {
        const result = await tester.runStaticAnalysis(config.url, type, config.daltonize);
        return result;
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process test request' },
      { status: 500 }
    );
  }
} 