import { TestConfig, ValidationError } from '../types';

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateTestConfig = (config: TestConfig): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!config.url) {
    errors.push({ field: 'url', message: 'URL is required' });
  } else if (!isValidUrl(config.url)) {
    errors.push({ field: 'url', message: 'Please enter a valid URL' });
  }

  if (config.colorblindTypes.length === 0) {
    errors.push({ 
      field: 'colorblindTypes', 
      message: 'Please select at least one colorblind type' 
    });
  }

  if (!config.testTypes.static && !config.testTypes.interactive && !config.testTypes.forms) {
    errors.push({ 
      field: 'testTypes', 
      message: 'Please select at least one test type' 
    });
  }

  return errors;
}; 