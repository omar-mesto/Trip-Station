import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import Admin from '../models/admin.model';
import { t } from '../config/i18n';
import { errorResponse } from '../utils/response';

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
      req.user = { ...user.toObject(), role: 'user' };
      return next();
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (admin) {
      req.user = { ...admin.toObject(), role: 'admin' };
      return next();
    }

    return res.status(401).json({ success: false, message: t('unauthorized', lang) });
  } catch {
    return res.status(401).json({ success: false, message: t('unauthorized', lang) });
  }
};

export const authorize =
  (...allowedRoles: string[]) =>
  (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const lang = (req.query.lang as string) === 'ar' ? 'ar' : 'en';

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return errorResponse(res, t('forbidden_access', lang), 403);
    }
    next();
  };
