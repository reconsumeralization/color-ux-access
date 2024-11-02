import React from 'react';

interface TestTypeSelectorProps {
  selected: string[];
  onChange: (types: string[]) => void;
}

export const TestTypeSelector: React.FC<TestTypeSelectorProps> = ({ selected, onChange }) => {
  const testTypes = [
    {
      id: 'static',
      label: 'Static Analysis',
      description: 'Analyze colors, contrast, and static content'
    },
    {
      id: 'interactive',
      label: 'Interactive Tests',
      description: 'Test user interactions and dynamic content'
    },
    {
      id: 'forms',
      label: 'Form Validation',
      description: 'Check form feedback and error states'
    }
  ];

  const handleToggle = (typeId: string) => {
    const newSelected = selected.includes(typeId)
      ? selected.filter(id => id !== typeId)
      : [...selected, typeId];
    onChange(newSelected);
  };

  return (
    <div className="space-y-4">
      {testTypes.map(type => (
        <label key={type.id} className="flex items-start p-4 bg-gray-50 rounded">
          <input
            type="checkbox"
            checked={selected.includes(type.id)}
            onChange={() => handleToggle(type.id)}
            className="mt-1"
          />
          <div className="ml-3">
            <div className="font-medium">{type.label}</div>
            <div className="text-sm text-gray-600">{type.description}</div>
          </div>
        </label>
      ))}
    </div>
  );
}; 