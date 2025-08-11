import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { errorResponse } from '../utils/response';

export const validate = (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return errorResponse(res, error.details[0].message, 400);
    }
    next();
  };
