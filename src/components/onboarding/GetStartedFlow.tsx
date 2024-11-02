'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WebsiteInput } from './WebsiteInput';
import { TestTypeSelector } from './TestTypeSelector';
import { TestConfiguration } from '@/components/testing/configuration/TestConfiguration';
import { ProgressBar } from '../common/ProgressBar';
import { TestConfig } from '@/types';
export const GetStartedFlow: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [testConfig, setTestConfig] = useState<TestConfig>({
    url: '',
    colorblindTypes: [],
    testComponents: {
      static: true,
      interactive: false,
      forms: false
    },
    duration: 30, // Default 30 second test duration
    resolution: {
      width: 1920,
      height: 1080
    }
  });

  const handleStartTest = () => {
    const queryParams = new URLSearchParams({
      url: testConfig.url,
      types: JSON.stringify(testConfig.colorblindTypes),
      config: JSON.stringify(testConfig.testComponents)
    }).toString();
    
    router.push(`/test?${queryParams}`);
  };

  const steps = [
    {
      title: 'Enter Your Website',
      component: (
        <WebsiteInput
          value={testConfig.url}
          onChange={(url) => setTestConfig({ ...testConfig, url })}
        />
      )
    },
    {
      title: 'Choose Test Types',
      component: (
        <TestTypeSelector
          selected={testConfig.testComponents}
          onChange={(types) => setTestConfig({ ...testConfig, testComponents: types })}
        />
      )
    },
    {
      title: 'Configure Tests',
      component: (
        <TestConfiguration
          config={testConfig}
          onChange={setTestConfig}
        />
      )
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <ProgressBar currentStep={step} totalSteps={steps.length} />
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">{steps[step - 1].title}</h2>
        {steps[step - 1].component}
      </div>

      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-6 py-2 border border-gray-300 rounded-lg"
          >
            Back
          </button>
        )}
        {step < steps.length ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleStartTest}
            className="px-6 py-2 bg-green-600 text-white rounded-lg"
          >
            Start Test
          </button>
        )}
      </div>
    </div>
  );
}; 