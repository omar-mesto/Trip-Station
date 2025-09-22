import Favorite from '../models/favorite.model';

export const addFavoriteService = async (userId: string, tripId: string) => {
  const exists = await Favorite.findOne({ user: userId, trip: tripId });
  if (exists) return exists;
  return await Favorite.create({ user: userId, trip: tripId });
};

export const removeFavoriteService = async (userId: string, tripId: string) => {
  return await Favorite.findOneAndDelete({ user: userId, trip: tripId });
};

export const listFavoritesService = async (
  userId: string,
  lang: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const favorites = await Favorite.find({ user: userId })
    .populate({
      path: 'trip',
      select: `_id price images location startDate endDate geoLocation name.${lang} description.${lang}`,
    })
    .skip(skip)
    .limit(limit)
    .lean();

  const formatted = favorites
    .map((fav: any) => {
      const trip = fav.trip;
      if (!trip) return null;
      return {
        id: trip._id,
        price: trip.price,
        images: Array.isArray(trip.images) ? trip.images.map((img: string) => `${process.env.BASE_URL}/uploads/tripImages/${img}`) : [],
        location: trip.location,
        lat:trip.lat,
        lng:trip.lan,
        startDate: trip.startDate ?? null,
        endDate: trip.endDate ?? null,
        name: trip.name?.[lang] ?? null,
        description: trip.description?.[lang] ?? null,
      };
    })
    .filter(Boolean);

  const total = await Favorite.countDocuments({ user: userId });

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
