import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';
import { t } from '../config/i18n';
import { createCountryService,updateCountryService,deleteCountryService,listCountriesService } from '../services/country.service';
import { getLang } from '../utils/lang.util';

export const createCountry = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const country = await createCountryService(req.body);
  return successResponse(res, t('country_created'), country, 201);
});

export const updateCountry = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const updated = await updateCountryService(req.params.id, req.body);
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