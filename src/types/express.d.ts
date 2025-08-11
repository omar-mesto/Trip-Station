import { AdminDocument } from '../../models/admin.model';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      lang?: 'en' | 'ar';
    }
  }
}
export {};