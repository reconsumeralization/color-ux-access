import React from 'react';

interface WebsiteInputProps {
  value: string;
  onChange: (url: string) => void;
}

export const WebsiteInput: React.FC<WebsiteInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-gray-700">
          Website URL
        </span>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </label>
      <p className="text-sm text-gray-500">
        Enter the URL of the website you want to test for colorblind accessibility
      </p>
    </div>
  );
}; 