import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || req.t('unexpected_error'),
    error: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
};