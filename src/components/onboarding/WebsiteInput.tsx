import React from 'react';

interface WebsiteInputProps {
  value: string;
  onChange: (url: string) => void;
}

export const WebsiteInput: React.FC<WebsiteInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website URL
        </label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://your-website.com"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}; 