export class TestError extends Error {
  constructor(
    message: string,
    public code: TestErrorCode,
    public details?: any
  ) {
    super(message);
    this.name = 'TestError';
  }
}

export enum TestErrorCode {
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
  SIMULATION_FAILED = 'SIMULATION_FAILED',
  ANALYSIS_FAILED = 'ANALYSIS_FAILED',
  RECORDING_FAILED = 'RECORDING_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  INVALID_CONFIG = 'INVALID_CONFIG'
}

export const ErrorMessages = {
  [TestErrorCode.INITIALIZATION_FAILED]: 'Failed to initialize test environment',
  [TestErrorCode.SIMULATION_FAILED]: 'Color blindness simulation failed',
  [TestErrorCode.ANALYSIS_FAILED]: 'Accessibility analysis failed',
  [TestErrorCode.RECORDING_FAILED]: 'Video recording failed',
  [TestErrorCode.NETWORK_ERROR]: 'Network connection failed',
  [TestErrorCode.TIMEOUT]: 'Test timed out',
  [TestErrorCode.INVALID_CONFIG]: 'Invalid test configuration'
}; 