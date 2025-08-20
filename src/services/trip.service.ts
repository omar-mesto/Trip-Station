import mongoose from 'mongoose';
import { INearbyTrip, ITrip } from '../interfaces/models';
import Trip from '../models/trip.model';
import favoriteModel from '../models/favorite.model';
import { t } from '../config/i18n';

type Lang = 'ar' | 'en';


const extractLatLng = (doc: any): { lat: number | null; lng: number | null } => {
  if (doc?.geoLocation?.coordinates?.length === 2) {
    const [lng, lat] = doc.geoLocation.coordinates;
    return { lat, lng };
  }
  return { lat: null, lng: null };
};

export const createTripService = async (data: Partial<ITrip>) => {
  const trip = await Trip.create(data as any);
  return trip.toObject();
};

export const updateTripService = async (id: string, data: Partial<ITrip>) => {
  const trip = await Trip.findByIdAndUpdate(id, data, { new: true });
  return trip;
};

export const deleteTripService = async (id: string) => {
  const trip = await Trip.findByIdAndDelete(id);
  return trip;
};

export const setTripAsAdvertisementService = async (id: string, isAd: boolean) => {
  const trip = await Trip.findByIdAndUpdate(id, { isAdvertisement: isAd }, { new: true });
  return trip;
};

export const listTripsService = async (page: number, limit: number, lang: Lang) => {
  const skip = (page - 1) * limit;

  const trips = await Trip.find()
    .populate('company', `name.${lang} rating`)
    .populate('country', `name.${lang}`)
    .select(
      `_id price endDate startDate isAdvertisement tripType status images rating location company country name.${lang} description.${lang} geoLocation`
    )
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Trip.countDocuments();

  const formatted = trips.map((trip: any) => {
    const { lat, lng } = extractLatLng(trip);
    return {
      id: trip._id,
      price: trip.price,
      isAdvertisement: trip.isAdvertisement,
      lat,
      lng,
      tripType: trip.tripType,
      status: trip.status,
      images: Array.isArray(trip.images)? trip.images.map((img: string) =>`${process.env.BASE_URL}/uploads/tripImages/${img}`):[],
      startDate: trip.startDate,
      endDate: trip.endDate,
      companyName: (trip.company as any)?.name?.[lang] || null,
      companyRating: (trip.company as any)?.rating ?? null,
      countryName: (trip.country as any)?.name?.[lang] || null,
      location: trip.location,
      rating: trip.rating,
      name: trip.name?.[lang] ?? null,
      description: trip.description?.[lang] ?? null,
    };
  });

  return {
    data: formatted,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTripsByCountryService = async (countryId: string, lang: Lang) => {
  const trips = await Trip.find({ country: countryId })
    .populate('company', `name.${lang} rating`)
    .select(`_id images name.${lang} description.${lang}`)
    .lean();

  return trips.map((trip: any) => {
    return {
      id: trip._id,
      images: Array.isArray(trip.images)? trip.images.map((img: string) =>`${process.env.BASE_URL}/uploads/tripImages/${img}`):[],
      name: trip.name?.[lang] ?? null,
      description: trip.description?.[lang] ?? null,
    };
  });
};

export const filterTripsService = async (filters: any, lang: Lang) => {
  const query: any = {};

  if (!filters.countryId) {
    throw new Error(t('countryId is required', lang));
  }
  query.country = new mongoose.Types.ObjectId(filters.countryId);
  if (filters.minPrice) query.price = { $gte: Number(filters.minPrice) };
  if (filters.maxPrice) query.price = { ...query.price, $lte: Number(filters.maxPrice) };
  if (filters.rating) query.rating = Number(filters.rating);
  if (filters.type) query.tripType = filters.type;
  if (filters.location) query.location = { $regex: filters.location, $options: 'i' };

  const trips = await Trip.find(query)
    .select(`_id price images rating location name.${lang} description.${lang} geoLocation`)
    .lean();

  return trips.map((trip: any) => {
    return {
      id: trip._id,
      price: trip.price,
      rating:trip.rating,
      images: Array.isArray(trip.images)? trip.images.map((img: string) =>`${process.env.BASE_URL}/uploads/tripImages/${img}`):[], 
      location: trip.location,
      name: trip.name?.[lang] ?? null,
      description: trip.description?.[lang] ?? null,
    };
  });
};

export const getTripDetailsService = async (id: string, lang: Lang, userId?: string) => {
  const trip = await Trip.findById(id)
    .populate('company', `name rating contact`)
    .populate('country', `name`)
    .lean();

  if (!trip) {
    return null;
  }

  const { lat, lng } = extractLatLng(trip);

  let isFavorited = false;
  if (userId) {
    const favoriteExists = await favoriteModel.exists({
      user: userId,
      trip: id,
    });
    isFavorited = !!favoriteExists;
  }
  return {
    id: trip._id,
    price: trip.price,
    location: trip.location,
    lat,
    lng,
    startDate: trip.startDate,
    endDate: trip.endDate,
    rating: trip.rating,
    status: trip.status,
    images: Array.isArray(trip.images) 
      ? trip.images.map((img: string) => `${process.env.BASE_URL}/uploads/tripImages/${img}`) 
      : [],
    company: {
      name: (trip.company as any)?.name?.[lang] ?? (trip.company as any)?.name ?? null,
      rating: (trip.company as any)?.rating ?? 0,
      contact: {
        whatsapp: (trip.company as any)?.contact?.whatsapp ?? null,
        facebook: (trip.company as any)?.contact?.facebook ?? null,
        website: (trip.company as any)?.contact?.website ?? null,
        instagram: (trip.company as any)?.contact?.instagram ?? null,
      }
    },
    country: (trip.country as any)?.name?.[lang] ?? (trip.country as any)?.name ?? null,
    name: trip.name?.[lang] ?? trip.name ?? null,
    description: trip.description?.[lang] ?? trip.description ?? null,
    isFavorited
  };
};

export const localAdsTripsService = async (lang: Lang) => {
  const trips = await Trip.find({ isAdvertisement: true, tripType: "local" })
    .select(`_id price startDate endDate location name.${lang} images description.${lang} geoLocation rating`)
    .lean();

  return trips.map((trip: any) => {
    return {
      id: trip._id,
      price: trip.price,
      images: Array.isArray(trip.images)? trip.images.map((img: string) =>`${process.env.BASE_URL}/uploads/tripImages/${img}`):[],
      startDate: trip.startDate,
      endDate: trip.endDate,
      location: trip.location,
      rating: trip.rating ?? null,
      name: trip.name?.[lang] ?? null,
      description: trip.description?.[lang] ?? null,
    };
  });
};

export const internationalAdsTripsService = async (lang: Lang) => {
  const trips = await Trip.find({ isAdvertisement: true, tripType: "international" })
    .select(`_id price location startDate endDate name.${lang} images description.${lang} geoLocation rating`)
    .lean();

  return trips.map((trip: any) => {
    const { lat, lng } = extractLatLng(trip);
    return {
      id: trip._id,
      price: trip.price,
      images: Array.isArray(trip.images)? trip.images.map((img: string) =>`${process.env.BASE_URL}/uploads/tripImages/${img}`):[],
      location: trip.location,
      rating: trip.rating ?? null,
      startDate: trip.startDate,
      endDate: trip.endDate,
      lat,
      lng,
      name: trip.name?.[lang] ?? null,
      description: trip.description?.[lang] ?? null,
    };
  });
};

export const nearbyTripsService = async (lat: number, lng: number, lang: Lang): Promise<INearbyTrip[]> => {
  const trips = await Trip.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lng, lat] },
        distanceField: 'dist.calculated',
        spherical: true,
      },
    },
    { $limit: 5 },
    {
      $project: {
        _id: 1,
        price: 1,
        location: 1,
        startDate: 1,
        endDate: 1,
        geoLocation: 1,
        name: `$name.${lang}`,
        description: `$description.${lang}`,
      },
    },
  ]);

  return trips.map((trip: any) => {
    let latOut: number | null = null;
    let lngOut: number | null = null;
    if (trip?.geoLocation?.coordinates?.length === 2) {
      [lngOut, latOut] = trip.geoLocation.coordinates;
    }
    return {
      id: trip._id.toString(),
      price: trip.price,
      location: trip.location,
      lat: latOut,
      lng: lngOut,
      name: trip.name ?? null,
      description: trip.description ?? null,
      startDate: trip.startDate ?? null,
      endDate: trip.endDate ?? null,
    };
  });
};

export const listTripsByCountryService = async (
  countryId: string,
  lang: string
) => {
  const trips = await Trip.find({ country: countryId })
    .select(`_id price status images location name.${lang} description.${lang}`)
    .lean();
  const formatted = trips.map((trip: any) => {
    return {
      id: trip._id,
      price: trip.price,
      countryId: countryId,
      location: trip.location,
      status: trip.status,
      images: Array.isArray(trip.images)? trip.images.map((img: string) =>`${process.env.BASE_URL}/uploads/tripImages/${img}`):[],
      name: trip.name?.[lang] ?? null,
      description: trip.description?.[lang] ?? null,
    };
  });

  return {
    data: formatted,
  };
};
