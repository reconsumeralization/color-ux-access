export class ColorSimulationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ColorSimulationError';
  }
}

export const ErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  WORKER_FAILED: 'WORKER_FAILED',
  MEMORY_LIMIT: 'MEMORY_LIMIT',
  TRANSFORMATION_FAILED: 'TRANSFORMATION_FAILED'
} as const;

export function handleError(error: unknown): never {
  if (error instanceof ColorSimulationError) {
    throw error;
  }
  
  if (error instanceof Error) {
    throw new ColorSimulationError(
      error.message,
      ErrorCodes.TRANSFORMATION_FAILED,
      { originalError: error }
    );
  }
  
  throw new ColorSimulationError(
    'An unknown error occurred',
    ErrorCodes.TRANSFORMATION_FAILED,
    { error }
  );
} 