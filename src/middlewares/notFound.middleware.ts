import { Request, Response, NextFunction } from 'express';
import { t } from "../config/i18n";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const lang = (req.query.lang as string) || "en";
  res.status(404).json({
    success: false,
    message: t('not_found', lang as any),
  });
};
