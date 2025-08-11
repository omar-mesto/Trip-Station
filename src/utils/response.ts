import { Response } from 'express';

export function successResponse<T>(
  res: Response,
  messageOrData: string | T,
  dataOrMessage?: T | string,
  statusCode = 200
) {
  let message: string;
  let data: T | null = null;

  if (typeof messageOrData === 'string') {
    message = messageOrData;
    data = (dataOrMessage as T) ?? null;
  } else {
    data = messageOrData as T;
    message = (dataOrMessage as string) ?? 'Success';
  }

  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function errorResponse(
  res: Response,
  message = 'Failed',
  statusCode = 500,
  error?: any
) {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
}
