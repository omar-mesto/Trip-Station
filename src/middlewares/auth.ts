import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Admin from '../models/admin.model';
import { errorResponse } from '../utils/response';

export const protectAdmin = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) return errorResponse(res, 'Not authorized', 401);

      req.user = admin;
      next();
    } catch (err) {
      return errorResponse(res, 'Token failed or expired', 401);
    }
  } else {
    return errorResponse(res, 'No token provided', 401);
  }
};
