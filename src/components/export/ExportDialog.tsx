import React, { useState } from 'react';
import { ExportOptions, ExportFormat } from '../../services/export/types';
import { ResultExporter } from '../../services/export/result-exporter';

interface ExportDialogProps {
  results: TestResult[];
  metadata: ExportMetadata;
  onExport: (url: string) => void;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  results,
  metadata,
  onExport,
  onClose
}) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeScreenshots: true,
    includeVideos: true,
    detailedMetrics: true,
    wcagCompliance: true,
    recommendations: true
  });

  const handleExport = async () => {
    const exporter = new ResultExporter();
    try {
      const exportUrl = await exporter.exportResults(results, metadata, options);
      onExport(exportUrl);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Export Results</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Format</label>
            <select
              value={options.format}
              onChange={e => setOptions({
                ...options,
                format: e.target.value as ExportFormat
              })}
              className="w-full border rounded p-2"
            >
              <option value="pdf">PDF Report</option>
              <option value="html">HTML Report</option>
              <option value="json">JSON Data</option>
              <option value="csv">CSV Data</option>
            </select>
          </div>

          <div className="space-y-2">
            {/* Export options checkboxes */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.includeScreenshots}
                onChange={e => setOptions({
                  ...options,
                  includeScreenshots: e.target.checked
                })}
                className="mr-2"
              />
              Include Screenshots
            </label>
            {/* Add other option checkboxes */}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 