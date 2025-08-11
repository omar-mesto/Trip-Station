import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';
import { t } from '../config/i18n';
import { createCountryService,updateCountryService,deleteCountryService,listCountriesService} from '../services/company.service';

export const createCompany = asyncHandler(async (req: Request, res: Response) => {
  const langRaw = req.query.lang as string | undefined;
  const lang = (langRaw === 'en' || langRaw === 'ar') ? langRaw : 'en';

  const company = await createCountryService(req.body);
  return successResponse(res, t('company_created_success', lang), company, 201);
});

export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const langRaw = req.query.lang as string | undefined;
  const lang = (langRaw === 'en' || langRaw === 'ar') ? langRaw : 'en';

  const updated = await updateCountryService(req.params.id, req.body);
  if (!updated) return errorResponse(res, t('company_not_found', lang), 404);
  return successResponse(res, t('company_updated', lang), updated);
});

export const deleteCompany = asyncHandler(async (req: Request, res: Response) => {
  const langRaw = req.query.lang as string | undefined;
  const lang = (langRaw === 'en' || langRaw === 'ar') ? langRaw : 'en';

  const deleted = await deleteCountryService(req.params.id);
  if (!deleted) return errorResponse(res, t('company_not_found', lang), 404);
  return successResponse(res, t('company_deleted_success', lang));
});

export const getCompanies = asyncHandler(async (req: Request, res: Response) => {
  const companies = await listCountriesService();
  return successResponse(res, companies);
});
