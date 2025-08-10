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
      .populate('company', `name.${lang} rating logo`)
      .populate('country', `name.${lang}`)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalTrips = await Trip.countDocuments();

    const formattedTrips = trips.map((trip: any) => ({
      id: trip._id,
      name: trip.name[lang] || trip.name.en,
      description: trip.description?.[lang] || trip.description?.en || "",
      location: trip.location,
      lat: trip.lat,
      lang: trip.lang,
      price: trip.price,
      status: trip.status,
      images: trip.images,
      company: {
        id: trip.company?._id,
        name: trip.company?.name?.[lang] || trip.company?.name?.en || "",
      },
      country: {
        id: trip.country?._id,
        name: trip.country?.name?.[lang] || trip.country?.name?.en || ""
      },
      createdAt: trip.createdAt,
    }));

    return successResponse(res, {
      trips: formattedTrips,
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
    const {
      name_en,
      name_ar,
      description_en,
      description_ar,
      location,
      lat,
      lang: longitude,
      price,
      status,
      images,
      country,
      company
    } = req.body;

    const tripData = {
      name: { en: name_en, ar: name_ar },
      description: { en: description_en, ar: description_ar },
      location,
      lat,
      lang: longitude,
      price,
      status,
      images,
      country,
      company
    };

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
    const {
      name_en,
      name_ar,
      description_en,
      description_ar,
      location,
      lat,
      lang: longitude,
      price,
      status,
      images,
      company,
      country
    } = req.body;

    const updateData: any = {};
    if (name_en || name_ar) {
      updateData["name.en"] = name_en;
      updateData["name.ar"] = name_ar;
    }
    if (description_en || description_ar) {
      updateData["description.en"] = description_en;
      updateData["description.ar"] = description_ar;
    }
    if (location) updateData.location = location;
    if (lat !== undefined) updateData.lat = lat;
    if (longitude !== undefined) updateData.lang = longitude;
    if (price !== undefined) updateData.price = price;
    if (status) updateData.status = status;
    if (images) updateData.images = images;
    if (country) updateData.country = country;
    if (company) updateData.company = company;

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

export const updateTripAdvertisement = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const tripId = req.params.id;
    const { isAdvertisment } = req.body;

    if (typeof isAdvertisment !== "boolean") {
      return errorResponse(res, t("invalid_advertisement_value", lang as any), 400);
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { isAdvertisment },
      { new: true }
    );

    if (!updatedTrip) {
      return errorResponse(res, t("trip_not_found", lang as any), 404);
    }

    return successResponse(
      res,
      updatedTrip,
      t(
        isAdvertisment ? "trip_marked_advertisement" : "trip_unmarked_advertisement",
        lang as any
      )
    );
  } catch (error) {
    return errorResponse(res, t("failed_update_advertisement", lang as any), 500);
  }
};

export const getAdvertisementTrips = async (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || "en";
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const trips = await Trip.find({ isAdvertisment: true })
      .populate("company", `name.${lang} rating logo`)
      .populate("country", `name.${lang}`)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalTrips = await Trip.countDocuments({ isAdvertisment: true });

    const formattedTrips = trips.map((trip: any) => ({
      id: trip._id,
      name: trip.name[lang] || trip.name.en,
      description: trip.description?.[lang] || trip.description?.en || "",
      location: trip.location,
      lat: trip.lat,
      lang: trip.lang,
      price: trip.price,
      status: trip.status,
      images: trip.images,
      company: {
        id: trip.company?._id,
        name: trip.company?.name?.[lang] || trip.company?.name?.en || "",
      },
      country: {
        id: trip.country?._id,
        name: trip.country?.name?.[lang] || trip.country?.name?.en || "",
      },
      createdAt: trip.createdAt,
    }));

    return successResponse(res, {
      trips: formattedTrips,
      totalPages: Math.ceil(totalTrips / limit),
      currentPage: page,
      totalTrips,
    });
  } catch (error) {
    return errorResponse(res, t("failed_fetch_advertisements", lang as any), 500);
  }
};