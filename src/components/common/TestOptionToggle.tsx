'use client'

interface TestOptionToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const TestOptionToggle: React.FC<TestOptionToggleProps> = ({
  label,
  checked,
  onChange
}) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`block w-14 h-8 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`} />
        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
          checked ? 'transform translate-x-6' : ''
        }`} />
      </div>
      <span className="text-gray-700">{label}</span>
    </label>
  );
}; 