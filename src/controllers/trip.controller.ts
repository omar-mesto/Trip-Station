import { Request, Response } from 'express';
import Trip from '../models/trip.model';
import { successResponse, errorResponse } from '../utils/response';
import { t } from "../config/i18n";

export const getTrips = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const trips = await Trip.find()
      .populate('company', 'name rating logo')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalTrips = await Trip.countDocuments();

    return successResponse(res, {
      trips,
      totalPages: Math.ceil(totalTrips / limit),
      currentPage: page,
      totalTrips,
    });
  } catch (error) {
    return errorResponse(res, t("failed_fetch_trips", lang as any), 500);
  }
};

export const createTrip = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const tripData = req.body;
    const newTrip = new Trip(tripData);
    await newTrip.save();

    return successResponse(res, newTrip, t("trip_created", lang as any), 201);
  } catch (error) {
    return errorResponse(res, t("failed_create_trip", lang as any), 500);
  }
};

export const updateTrip = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const tripId = req.params.id;
    const updateData = req.body;

    const updatedTrip = await Trip.findByIdAndUpdate(tripId, updateData, { new: true });

    if (!updatedTrip) return errorResponse(res, t("trip_not_found", lang as any), 404);

    return successResponse(res, updatedTrip, t("trip_updated", lang as any));
  } catch (error) {
    return errorResponse(res, t("failed_update_trip", lang as any), 500);
  }
};

export const deleteTrip = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const tripId = req.params.id;

    const deletedTrip = await Trip.findByIdAndDelete(tripId);
    if (!deletedTrip) return errorResponse(res, t("trip_not_found", lang as any), 404);

    return successResponse(res, null, t("trip_deleted", lang as any));
  } catch (error) {
    return errorResponse(res, t("failed_delete_trip", lang as any), 500);
  }
};
