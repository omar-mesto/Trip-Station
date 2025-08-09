import { Request, Response } from 'express';
import Country from '../models/country.model';
import { successResponse, errorResponse } from '../utils/response';
import { t } from "../config/i18n";

export const getCountries = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const countries = await Country.find().sort({ createdAt: -1 });

    const formatted = countries.map((c: any) => ({
      id: c._id,
      name: c.name[lang] || c.name.en,
      image: c.image
    }));

    return successResponse(res, formatted);
  } catch (error) {
    return errorResponse(res, t("failed_fetch_countries", lang as any), 500);
  }
};

export const createCountry = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const { name_en, name_ar, image } = req.body;

    const newCountry = new Country({
      name: { en: name_en, ar: name_ar },
      image,
    });

    await newCountry.save();
    return successResponse(res, newCountry, t("country_created", lang as any), 201);
  } catch (error) {
    return errorResponse(res, t("failed_create_country", lang as any), 500);
  }
};

export const updateCountry = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const countryId = req.params.id;
    const { name_en, name_ar, image } = req.body;

    const updateData: any = {};
    if (name_en || name_ar) {
      updateData["name.en"] = name_en;
      updateData["name.ar"] = name_ar;
    }
    if (image) updateData.image = image;

    const updatedCountry = await Country.findByIdAndUpdate(countryId, updateData, { new: true });

    if (!updatedCountry) return errorResponse(res, t("country_not_found", lang as any), 404);

    return successResponse(res, updatedCountry, t("country_updated", lang as any));
  } catch (error) {
    return errorResponse(res, t("failed_update_country", lang as any), 500);
  }
};

export const deleteCountry = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const countryId = req.params.id;

    const deleted = await Country.findByIdAndDelete(countryId);
    if (!deleted) return errorResponse(res, t("country_not_found", lang as any), 404);

    return successResponse(res, null, t("country_deleted", lang as any));
  } catch (error) {
    return errorResponse(res, t("failed_delete_country", lang as any), 500);
  }
};
