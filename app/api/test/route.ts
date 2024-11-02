import { NextResponse } from 'next/server'
import { ColorblindTestRunner } from '@/services/colorblind-test/test-runner'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const runner = new ColorblindTestRunner()
    const results = await runner.runComprehensiveTest(data.url)
    
    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
