import { Request } from 'express';

export const getLang = (req: Request): 'en' | 'ar' => {
  const langRaw = req.query.lang as string | undefined;
  return langRaw === 'ar' ? 'ar' : 'en';
};
