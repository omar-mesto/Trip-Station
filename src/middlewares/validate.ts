import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { errorResponse } from '../utils/response';
import { getLang } from '../utils/lang.util';
import { t } from '../config/i18n';

export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const lang = getLang(req);

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const message = error.details
        .map((d) => {
          if (d.type === 'string.min' && d.context?.key === 'password') {
            return t('password_min_length', lang);
          }
          if (d.type === 'any.only' && d.context?.key === 'rePassword') {
            return t('passwords_do_not_match', lang);
          }
          return d.message;
        })
        .join(', ');

      return errorResponse(res, message || t('validation_failed', lang), 400);
    }

    next();
  };
};
