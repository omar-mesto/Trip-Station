import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';
import { t } from '../config/i18n';
import { getLang } from '../utils/lang.util';
import {
  listTripsService,
  filterTripsService,
  nearbyTripsService,
  getTripDetailsService,
  createTripService,
  updateTripService,
  deleteTripService,
  setTripAsAdvertisementService,
  localAdsTripsService,
  internationalAdsTripsService,
  listTripsByCountryService,
} from '../services/trip.service';

export const createTrip = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);

  const lat = parseFloat(req.body.lat);
  const lng = parseFloat(req.body.lng);

  if (isNaN(lat) || isNaN(lng)) {
    return errorResponse(res, t('lat_lng_required', lang), 400);
  }
  const images = req.files ? (req.files as Express.Multer.File[]).map(f => f.filename) : [];

  const payload = {
    ...req.body,
    images,
    geoLocation: { type: 'Point', coordinates: [lng, lat] },
    startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
    endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
  };
  if (payload.startDate && payload.endDate && payload.startDate > payload.endDate) {
    return errorResponse(res, t('start_must_before_end', lang), 400);
  }
  const trip = await createTripService(payload as any);

  return successResponse(res, t('trip_created', lang), trip, 201);
});

export const updateTrip = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const updateData: any = { ...req.body };
  if (req.files && (req.files as Express.Multer.File[]).length > 0) {
    updateData.images = (req.files as Express.Multer.File[]).map(f => f.filename);
  }
  if (req.body.lat !== undefined && req.body.lng !== undefined) {
    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);
    if (isNaN(lat) || isNaN(lng)) {
      return errorResponse(res, t('lat_lng_required', lang), 400);
    }
    updateData.geoLocation = { type: 'Point', coordinates: [lng, lat] };
  }
  const updated = await updateTripService(req.params.id, updateData);
  if (!updated) return errorResponse(res, t('trip_not_found', lang), 404);
  if (req.body.startDate) updateData.startDate = new Date(req.body.startDate);
  if (req.body.endDate) updateData.endDate = new Date(req.body.endDate);
  if (updateData.startDate && updateData.endDate && updateData.startDate > updateData.endDate) {
    return errorResponse(res, t('start_must_before_end', lang), 400);
  }
  return successResponse(res, t('trip_updated', lang), updated);
});

export const deleteTrip = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const deleted = await deleteTripService(req.params.id);
  if (!deleted) return errorResponse(res, t('trip_not_found', lang), 404);
  return successResponse(res, t('trip_deleted', lang));
});

export const setTripAsAdvertisement = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const trip = await setTripAsAdvertisementService(req.params.id, true);
  if (!trip) return errorResponse(res, t('trip_not_found', lang), 404);
  return successResponse(res, t('trip_marked_advertisement', lang), trip);
});

export const removeTripFromAdvertisement = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const trip = await setTripAsAdvertisementService(req.params.id, false);
  if (!trip) return errorResponse(res, t('trip_not_found', lang), 404);
  return successResponse(res, t('trip_unmarked_advertisement', lang), trip);
});

export const getTrips = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const lang = (req.query.lang as string) === 'ar' ? 'ar' : 'en';

  const trips = await listTripsService(page, limit, lang);
  return successResponse(res, trips);
});

export const getTripDetails = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const userId = (req as any).user?.id;
  const trip = await getTripDetailsService(req.params.id, lang, userId);
  if (!trip) return errorResponse(res, t("trip_not_found", lang), 404);
  return successResponse(res, trip);
});

export const filterTrips = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const filters = req.body;
  const trips = await filterTripsService(filters, lang);
  return successResponse(res, trips);
});

export const nearbyTrips = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);

  if (isNaN(lat) || isNaN(lng)) {
    return errorResponse(res, t('lat_lng_required', lang), 400);
  }

  const trips = await nearbyTripsService(lat, lng, lang);
  return successResponse(res, trips);
});

export const getLocalAdsTrips = asyncHandler(async (req: Request, res: Response) => {
   const lang = getLang(req);
  const trips = await localAdsTripsService(lang);
  return successResponse(res, trips);
});

export const getInternationalAdsTrips = asyncHandler(async (req: Request, res: Response) => {
   const lang = getLang(req);
  const trips = await internationalAdsTripsService(lang);
  return successResponse(res, trips);
});

export const listTripsByCountry = async (req: Request, res: Response) => {
  try {
    const { countryId } = req.params;
    const lang = (req.query.lang as string) || 'en';
    const result = await listTripsByCountryService(countryId, lang);
    res.json({ success: true, message: 'Success', ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};