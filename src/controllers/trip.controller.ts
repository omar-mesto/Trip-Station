import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';
import { t } from '../config/i18n';
import {
  createTripService,
  updateTripService,
  deleteTripService,
  listTripsService,
  updateTripAdvertisementService,
  getAdvertisementTripsService,
} from '../services/trip.service';

export const updateTripAdvertisement = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const tripId = req.params.id;
  const { isAdvertisment } = req.body;

  if (typeof isAdvertisment !== 'boolean') {
    return errorResponse(res, t('invalid_advertisement_flag', lang), 400);
  }

  const updated = await updateTripAdvertisementService(tripId, isAdvertisment);
  if (!updated) {
    return errorResponse(res, t('trip_not_found', lang), 404);
  }

  return successResponse(res, t('trip_advertisement_updated', lang), updated);
});

export const getAdvertisementTrips = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const trips = await getAdvertisementTripsService();
  return successResponse(res, t('advertisement_trips_fetched', lang), trips);
});

const getLang = (req: Request): 'en' | 'ar' => {
  const langRaw = req.query.lang as string | undefined;
  return langRaw === 'ar' ? 'ar' : 'en';
};

export const createTrip = asyncHandler(async (req: Request, res: Response) => {
  const trip = await createTripService(req.body);
  return successResponse(res, trip);
});

export const updateTrip = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const updated = await updateTripService(req.params.id, req.body);
  if (!updated) return errorResponse(res, t('trip_not_found', lang), 404);
  return successResponse(res, t('trip_updated_success', lang), updated);
});

export const deleteTrip = asyncHandler(async (req: Request, res: Response) => {
  const lang = getLang(req);
  const deleted = await deleteTripService(req.params.id);
  if (!deleted) return errorResponse(res, t('trip_not_found', lang), 404);
  return successResponse(res, t('trip_deleted_success', lang));
});

export const getTrips = asyncHandler(async (req: Request, res: Response) => {
  const trips = await listTripsService();
  return successResponse(res, trips);
});
