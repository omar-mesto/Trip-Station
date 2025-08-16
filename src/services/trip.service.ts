import mongoose from 'mongoose';
import { INearbyTrip, ITrip } from '../interfaces/models';
import Trip from '../models/trip.model';

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
    .select(`_id price endDate startDate isAdvertisement tripType status images rating location company country name.${lang} description.${lang} geoLocation`)
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
      images: trip.images || [],
      startDate: trip.startDate,
      endDate: trip.endDate,
      companyName: (trip.company as any)?.name?.[lang] || null,
      companyRating: (trip.company as any)?.rating ?? null,
      countryName: (trip.country as any)?.name?.[lang] || null,
      location: trip.location,
      rating: trip.rating,
      [`name_${lang}`]: trip.name?.[lang] ?? null,
      [`description_${lang}`]: trip.description?.[lang] ?? null,
    };
  });

  return {
    data: formatted,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const listLocalTripsService = async (page: number, limit: number, lang: Lang) => {
  const skip = (page - 1) * limit;

  const trips = await Trip.find({ tripType: 'local' })
    .select(`_id price images startDate endDate location name.${lang} description.${lang} geoLocation`)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Trip.countDocuments({ tripType: 'local' });

  const formatted = trips.map((trip: any) => {
    const { lat, lng } = extractLatLng(trip);
    return {
      id: trip._id,
      price: trip.price,
      images: trip.images || [],
      location: trip.location,
      lat,
      lng,
      startDate: trip.startDate,
      endDate: trip.endDate,
      [`name_${lang}`]: trip.name?.[lang] ?? null,
      [`description_${lang}`]: trip.description?.[lang] ?? null,
    };
  });

  return {
    data: formatted,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const listInternationalTripsService = async (page: number, limit: number, lang: Lang) => {
  const skip = (page - 1) * limit;

  const trips = await Trip.find({ tripType: 'international' })
    .select(`_id price images startDate endDate location name.${lang} description.${lang} geoLocation`)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Trip.countDocuments({ tripType: 'international' });

  const formatted = trips.map((trip: any) => {
    const { lat, lng } = extractLatLng(trip);
    return {
      id: trip._id,
      price: trip.price,
      images: trip.images || [],
      location: trip.location,
      startDate: trip.startDate,
      endDate: trip.endDate,
      lat,
      lng,
      [`name_${lang}`]: trip.name?.[lang] ?? null,
      [`description_${lang}`]: trip.description?.[lang] ?? null,
    };
  });

  return {
    data: formatted,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};


export const filterTripsService = async (filters: any, lang: Lang) => {
  const query: any = {};

  if (filters.minPrice) query.price = { $gte: Number(filters.minPrice) };
  if (filters.maxPrice) query.price = { ...query.price, $lte: Number(filters.maxPrice) };
  if (filters.rating) query.rating = Number(filters.rating);
  if (filters.type) query.tripType = filters.type;
  if (filters.company) query.company = new mongoose.Types.ObjectId(filters.company);

  const trips = await Trip.find(query)
    .select(`_id price location name.${lang} description.${lang} geoLocation`)
    .lean();

  return trips.map((trip: any) => {
    const { lat, lng } = extractLatLng(trip);
    return {
      id: trip._id,
      price: trip.price,
      location: trip.location,
      lat,
      lng,
      [`name_${lang}`]: trip.name?.[lang] ?? null,
      [`description_${lang}`]: trip.description?.[lang] ?? null,
    };
  });
};


export const advertisementTripsService = async (type: 'local' | 'international', lang: Lang) => {
  const trips = await Trip.find({ isAdvertisement: true, tripType: type })
    .select(`_id price location startDate endDate name.${lang} images description.${lang} geoLocation`)
    .lean();

  return trips.map((trip: any) => {
    const { lat, lng } = extractLatLng(trip);
    return {
      id: trip._id,
      price: trip.price,
      images: trip.images || [],
      location: trip.location,
      lat,
      lng,
      startDate: trip.startDate,
      endDate: trip.endDate,
      [`name_${lang}`]: trip.name?.[lang] ?? null,
      [`description_${lang}`]: trip.description?.[lang] ?? null,
    };
  });
};


export const getTripDetailsService = async (id: string, lang: Lang) => {
  const trip = await Trip.findById(id)
    .populate('company', `name.${lang} rating`)
    .populate('country', `name.${lang}`)
    .lean();

  if (!trip) return null;

  const { lat, lng } = extractLatLng(trip);

  return {
    id: trip._id,
    price: trip.price,
    location: trip.location,
    lat,
    lng,
    startDate: trip.startDate,
    endDate: trip.endDate,
    tripType: trip.tripType,
    rating: trip.rating,
    status: trip.status,
    images: trip.images || [],
    company: {
      name: (trip.company as any)?.name?.[lang] ?? null,
      rating: (trip.company as any)?.rating ?? 0,
    },
    country: (trip.country as any)?.name?.[lang] ?? null,
    name: trip.name?.[lang] ?? null,
    description: trip.description?.[lang] ?? null,
  };
};

export const localAdsTripsService = async (lang: Lang) => {
  const trips = await Trip.find({ isAdvertisement: true, tripType: "local" })
    .select(`_id price location name.${lang} images description.${lang} geoLocation rating`)
    .lean();

  return trips.map((trip: any) => {
    const { lat, lng } = extractLatLng(trip);
    return {
      id: trip._id,
      price: trip.price,
      images: trip.images || [],
      location: trip.location,
      rating: trip.rating ?? null,
      lat,
      lng,
      [`name_${lang}`]: trip.name?.[lang] ?? null,
      [`description_${lang}`]: trip.description?.[lang] ?? null,
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
      images: trip.images || [],
      location: trip.location,
      rating: trip.rating ?? null,
      startDate: trip.startDate,
      endDate: trip.endDate,
      lat,
      lng,
      [`name_${lang}`]: trip.name?.[lang] ?? null,
      [`description_${lang}`]: trip.description?.[lang] ?? null,
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
      startDate: trip.startDate ?? null,  // أضف هذا
      endDate: trip.endDate ?? null,      // وأضف هذا
    };
  });
};

