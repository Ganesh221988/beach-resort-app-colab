// src/utils/errorUtils.ts
import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  statusCode?: number;
}

export class AppError extends Error {
  code?: string;
  field?: string;
  statusCode?: number;

  constructor(message: string, code?: string, field?: string, statusCode?: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.field = field;
    this.statusCode = statusCode;
  }
}

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
};

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (isApiError(data)) {
      return new AppError(
        data.message,
        data.code,
        data.field,
        error.response?.status
      );
    }
    return new AppError(
      error.message || 'Network error occurred',
      'NETWORK_ERROR',
      undefined,
      error.response?.status
    );
  }

  if (isApiError(error)) {
    return new AppError(error.message, error.code, error.field);
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }

  return new AppError(
    typeof error === 'string' ? error : 'An unknown error occurred',
    'UNKNOWN_ERROR'
  );
};

export const getErrorMessage = (error: unknown): string => {
  const appError = handleApiError(error);
  if (appError.field) {
    return `${appError.field}: ${appError.message}`;
  }
  return appError.message;
};
