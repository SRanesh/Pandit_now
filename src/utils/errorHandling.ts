export class StorageError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export function handleStorageError(error: unknown): string {
  if (error instanceof StorageError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}