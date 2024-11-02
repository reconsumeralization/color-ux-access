import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTestConfig } from '@/stores/testConfigStore';
import { ColorblindType } from '@/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

export const GetStartedFlow = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const { 
    url, 
    colorblindTypes, 
    testComponents,
    setUrl, 
    toggleColorblindType,
    toggleComponent 
  } = useTestConfig();

  const handleStartTest = async () => {
    if (!url) {
      setError('Please enter a URL to test');
      return;
    }

    if (colorblindTypes.length === 0) {
      setError('Please select at least one colorblind type to test');
      return;
    }

    if (!Object.values(testComponents).some(Boolean)) {
      setError('Please select at least one test component');
      return;
    }

    router.push('/test');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Enter Website URL</h2>
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Select Colorblind Types</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.values(ColorblindType).map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={colorblindTypes.includes(type)}
                  onCheckedChange={() => toggleColorblindType(type)}
                />
                <label htmlFor={type} className="text-sm font-medium">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Select Test Components</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="static"
                checked={testComponents.static}
                onCheckedChange={() => toggleComponent('static')}
              />
              <label htmlFor="static" className="text-sm font-medium">
                Static Content Analysis
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="interactive"
                checked={testComponents.interactive}
                onCheckedChange={() => toggleComponent('interactive')}
              />
              <label htmlFor="interactive" className="text-sm font-medium">
                Interactive Elements
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="forms"
                checked={testComponents.forms}
                onCheckedChange={() => toggleComponent('forms')}
              />
              <label htmlFor="forms" className="text-sm font-medium">
                Form Validation
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <Button 
          className="w-full"
          onClick={handleStartTest}
        >
          Start Test
        </Button>
      </div>
    </div>
  );
}; 