import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import Admin from '../models/admin.model';
import { t } from '../config/i18n';

export const protect = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const lang = (req.query.lang as string) === 'ar' ? 'ar' : 'en';
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: t('unauthorized', lang) });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'accesssecret') as any;

    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
      return next();
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (admin) {
      req.user = admin;
      return next();
    }

    return res.status(401).json({ success: false, message: t('unauthorized', lang) });
  } catch {
    return res.status(401).json({ success: false, message: t('unauthorized', lang) });
  }
};
