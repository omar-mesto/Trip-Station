import { Request, Response, NextFunction } from 'express';
import { t } from "../config/i18n";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const lang = (req.query.lang as string) || "en";
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || t('unexpected_error', lang as any),
    error: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
};
