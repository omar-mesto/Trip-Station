import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';
import { t } from '../config/i18n';
import { createCountryService, updateCountryService, deleteCountryService, listCountriesService } from '../services/country.service';
import { getLang } from '../utils/lang.util';

export const createCountry = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);

  const images = req.files ? (req.files as Express.Multer.File[]).map(f => f.filename) : [];

  const payload = {
    ...req.body,
    images
  };

  const country = await createCountryService(payload);
  return successResponse(res, t('country_created', lang), country, 201);
});

export const updateCountry = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);

  const updateData: any = { ...req.body };

  if (req.files && (req.files as Express.Multer.File[]).length > 0) {
    updateData.images = (req.files as Express.Multer.File[]).map(f => f.filename);
  }

  const updated = await updateCountryService(req.params.id, updateData);
  if (!updated) return errorResponse(res, t('country_not_found', lang), 404);
  return successResponse(res, t('country_updated_success', lang), updated);
});

export const deleteCountry = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const deleted = await deleteCountryService(req.params.id);
  if (!deleted) return errorResponse(res, t('country_not_found', lang), 404);
  return successResponse(res, t('country_deleted', lang));
});

export const getCountries = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const lang = getLang(req);

  const countries = await listCountriesService(page, limit, lang);
  return successResponse(res, countries);
});
