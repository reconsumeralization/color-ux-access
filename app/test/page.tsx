'use client'

import { TestRunner } from '@/components/testing/TestRunner'
import { useSearchParams } from 'next/navigation'

export default function TestPage() {
  const searchParams = useSearchParams()
  const url = searchParams.get('url')
  
  if (!url) {
    return <div>No URL provided</div>
  }

  return (
    <div className="container mx-auto py-8">
      <TestRunner 
        config={{
          url,
          colorblindTypes: [],
          testTypes: {
            static: true,
            interactive: true,
            forms: true
          }
        }}
      />
    </div>
  )
}
