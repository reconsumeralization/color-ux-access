import { useTest } from '@/context/TestContext';
import { COLORBLIND_TYPES } from '@/lib/constants/colorblind';
import { TEST_TYPES } from '@/lib/constants/test';
import { ColorblindType } from '@/types';

export const TestConfigForm: React.FC = () => {
  const { config, setConfig } = useTest();

  return (
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Website URL
        </label>
        <input
          type="url"
          value={config.url}
          onChange={(e) => setConfig({ ...config, url: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="https://example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Colorblind Types
        </label>
        <div className="mt-2 space-y-2">
          {Object.values(COLORBLIND_TYPES).map((type) => (
            <label key={type} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={config.colorblindTypes.includes(type as ColorblindType)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...config.colorblindTypes, type as ColorblindType]
                    : config.colorblindTypes.filter(t => t !== type);
                  setConfig({ ...config, colorblindTypes: newTypes });
                }}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="ml-2">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Test Types
        </label>
        <div className="mt-2 space-y-2">
          {Object.entries(TEST_TYPES).map(([key, value]) => (
            <label key={key} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={config.testComponents[value as keyof typeof config.testComponents]}
                onChange={(e) => {
                  setConfig({
                    ...config,
                    testComponents: {
                      ...config.testComponents,
                      [value]: e.target.checked
                    }
                  });
                }}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="ml-2">{key.toLowerCase()}</span>
            </label>
          ))}
        </div>
      </div>
    </form>
  );
}; 