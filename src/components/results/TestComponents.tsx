import React from 'react';
import { TestResult } from '@/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TestComponentsProps {
  result: TestResult;
}

export const TestComponents: React.FC<TestComponentsProps> = ({ result }) => {
  const components = [
    {
      name: 'Interactive Elements',
      count: result.metrics.interactiveElementsCount,
      description: 'Buttons, links, and other clickable elements'
    },
    {
      name: 'Focusable Elements',
      count: result.metrics.focusableElementsCount,
      description: 'Elements that can receive keyboard focus'
    },
    {
      name: 'Animations',
      count: result.metrics.animationCount,
      description: 'Moving or changing elements'
    },
    {
      name: 'Color-Only Elements',
      count: result.metrics.colorOnlyElements,
      description: 'Elements that rely solely on color for meaning'
    },
    {
      name: 'Pattern-Supplemented',
      count: result.metrics.patternSupplementedElements,
      description: 'Elements with additional visual indicators'
    }
  ];

  return (
    <div className="space-y-4">
      {components.map((component) => (
        <Card key={component.name} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold">{component.name}</h4>
              <p className="text-sm text-muted-foreground">
                {component.description}
              </p>
            </div>
            <span className="text-lg font-bold">{component.count}</span>
          </div>
          <Progress 
            value={component.count} 
            max={Math.max(component.count * 1.5, 10)} 
          />
        </Card>
      ))}
    </div>
  );
}; 