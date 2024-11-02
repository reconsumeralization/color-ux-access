'use client'

interface TestTypeSelectorProps {
  selected: {
    static: boolean;
    interactive: boolean;
    forms: boolean;
  };
  onChange: (types: any) => void;
}

export const TestTypeSelector: React.FC<TestTypeSelectorProps> = ({
  selected,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        {Object.entries(selected).map(([key, value]) => (
          <label key={key} className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => {
                onChange({
                  ...selected,
                  [key]: e.target.checked
                });
              }}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700 capitalize">{key}</span>
          </label>
        ))}
      </div>
    </div>
  );
}; 