import { Request, Response } from 'express';
import Company from '../models/company.model';
import { successResponse, errorResponse } from '../utils/response';
import { t } from "../config/i18n";

export const getCompanies = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const companies = await Company.find()
      .select(`name.${lang} rating logo`)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCompanies = await Company.countDocuments();

    const formattedCompanies = companies.map((company: any) => ({
      id: company._id,
      name: company.name[lang] || company.name.en,
      rating: company.rating,
      logo: company.logo
    }));

    return successResponse(res, {
      companies: formattedCompanies,
      totalPages: Math.ceil(totalCompanies / limit),
      currentPage: page,
      totalCompanies,
    });
  } catch (error) {
    return errorResponse(res, t("failed_fetch_companies", lang as any), 500);
  }
};


export const createCompany = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const { name_en, name_ar, rating, logo } = req.body;

    const companyData = {
      name: { en: name_en, ar: name_ar },
      rating,
      logo
    };

    const newCompany = new Company(companyData);
    await newCompany.save();

    return successResponse(res, newCompany, t("company_created", lang as any), 201);
  } catch (error) {
    return errorResponse(res, t("failed_create_company", lang as any), 500);
  }
};


export const updateCompany = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const companyId = req.params.id;
    const { name_en, name_ar, rating, logo } = req.body;

    const updateData: any = {};
    if (name_en || name_ar) {
      updateData["name.en"] = name_en;
      updateData["name.ar"] = name_ar;
    }
    if (rating !== undefined) updateData.rating = rating;
    if (logo) updateData.logo = logo;

    const updatedCompany = await Company.findByIdAndUpdate(companyId, updateData, { new: true });
    if (!updatedCompany) return errorResponse(res, t("company_not_found", lang as any), 404);

    return successResponse(res, updatedCompany, t("company_updated", lang as any));
  } catch (error) {
    return errorResponse(res, t("failed_update_company", lang as any), 500);
  }
};


export const deleteCompany = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const companyId = req.params.id;

    const deletedCompany = await Company.findByIdAndDelete(companyId);
    if (!deletedCompany) return errorResponse(res, t("company_not_found", lang as any), 404);

    return successResponse(res, null, t("company_deleted", lang as any));
  } catch (error) {
    return errorResponse(res, t("failed_delete_company", lang as any), 500);
  }
};
