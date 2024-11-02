'use client'

import React from 'react';
import { ColorblindType, TestConfig } from '@/types';
import { TestOptionToggle } from '@/components/common/TestOptionToggle';

interface TestConfigurationProps {
  config: TestConfig;
  onChange: (config: TestConfig) => void;
}

export const TestConfiguration: React.FC<TestConfigurationProps> = ({ 
  config, 
  onChange 
}) => {
  const handleColorblindTypeToggle = (type: ColorblindType) => {
    const types = config.colorblindTypes.includes(type)
      ? config.colorblindTypes.filter(t => t !== type)
      : [...config.colorblindTypes, type];
    
    onChange({
      ...config,
      colorblindTypes: types
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Colorblind Types</h3>
        <div className="space-y-3">
          {Object.values(ColorblindType).map((type) => (
            <TestOptionToggle
              key={type}
              label={type}
              checked={config.colorblindTypes.includes(type)}
              onChange={() => handleColorblindTypeToggle(type)}
            />
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Test Options</h3>
        <div className="space-y-3">
          <TestOptionToggle
            label="Static Analysis"
            checked={config.testComponents.static}
            onChange={(checked) => onChange({
              ...config,
              testComponents: { ...config.testComponents, static: checked }
            })}
          />
          <TestOptionToggle
            label="Interactive Elements"
            checked={config.testComponents.interactive}
            onChange={(checked) => onChange({
              ...config,
              testComponents: { ...config.testComponents, interactive: checked }
            })}
          />
          <TestOptionToggle
            label="Form Controls"
            checked={config.testComponents.forms}
            onChange={(checked) => onChange({
              ...config,
                testComponents: { ...config.testComponents, forms: checked }
            })}
          />
        </div>
      </div>
    </div>
  );
}; 