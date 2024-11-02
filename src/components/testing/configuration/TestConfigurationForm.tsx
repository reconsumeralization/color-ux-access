import React, { useState } from 'react';
import { ColorblindType } from '../../../types';
import { UserAction } from '@/services/export/types';

interface TestConfig {
  url: string;
  colorblindTypes: ColorblindType[];
  testTypes: {
    static: boolean;
    interactive: boolean;
    forms: boolean;
  };
  userFlow?: UserAction[];
}

export const TestConfigurationForm: React.FC<{ onSubmit: (config: TestConfig) => void }> = ({ onSubmit }) => {
  const [config, setConfig] = useState<TestConfig>({
    url: '',
    colorblindTypes: [],
    testTypes: {
      static: true,
      interactive: false,
      forms: false
    }
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(config);
      }}>
        {/* URL Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Website URL</label>
          <input
            type="url"
            value={config.url}
            onChange={(e) => setConfig({ ...config, url: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="https://example.com"
            required
          />
        </div>

        {/* Colorblind Types */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Colorblind Types</label>
          <div className="grid grid-cols-2 gap-4">
            {Object.values(ColorblindType).map(type => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.colorblindTypes.includes(type)}
                  onChange={(e) => {
                    const types = e.target.checked
                      ? [...config.colorblindTypes, type]
                      : config.colorblindTypes.filter(t => t !== type);
                    setConfig({ ...config, colorblindTypes: types });
                  }}
                  className="form-checkbox"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Test Types */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Test Types</label>
          <div className="space-y-2">
            {Object.entries(config.testTypes).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => {
                    setConfig({
                      ...config,
                      testTypes: {
                        ...config.testTypes,
                        [key]: e.target.checked
                      }
                    });
                  }}
                  className="form-checkbox"
                />
                <span className="capitalize">{key} Analysis</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Start Testing
        </button>
      </form>
    </div>
  );
}; 