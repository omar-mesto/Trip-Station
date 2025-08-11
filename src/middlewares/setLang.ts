import { Request, Response, NextFunction } from 'express';

export const setLang = (req: Request, res: Response, next: NextFunction) => {
  req.lang = (req.query.lang as string) || 'en';
  next();
};