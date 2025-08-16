import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';
import { t } from '../config/i18n';
import { createCompanyService, updateCompanyService, deleteCompanyService, listCompaniesService } from '../services/company.service';
import { getLang } from '../utils/lang.util';

export const createCompany = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const company = await createCompanyService(req.body);
  return successResponse(res, t('company_created_success', lang), company, 201);
});

export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const updated = await updateCompanyService(req.params.id, req.body);
  if(!updated) return errorResponse(res, t('company_not_found', lang), 404);
  return successResponse(res, t('company_updated', lang), updated);
});

export const deleteCompany = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const deleted = await deleteCompanyService(req.params.id);
  if(!deleted) return errorResponse(res, t('company_not_found', lang), 404);
  return successResponse(res, t('company_deleted_success', lang));
});

export const getCompanies = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const lang = (req.query.lang as string) === 'ar' ? 'ar' : 'en';

  const companies = await listCompaniesService(page, limit, lang);
  return successResponse(res, companies);
});
