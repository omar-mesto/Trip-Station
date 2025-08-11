import Trip from '../models/trip.model';

export const createTripService = async (data: any) => {
  const trip = await Trip.create(data);
  return trip;
};

export const updateTripService = async (id: string, data: any) => {
  const updatedTrip = await Trip.findByIdAndUpdate(id, data, { new: true });
  return updatedTrip;
};

export const deleteTripService = async (id: string) => {
  const deletedTrip = await Trip.findByIdAndDelete(id);
  return deletedTrip;
};

export const listTripsService = async () => {
  const trips = await Trip.find();
  return trips;
};

export const updateTripAdvertisementService = async (id: string, isAdvertisement: boolean) => {
  const updatedTrip = await Trip.findByIdAndUpdate(id, { isAdvertisement }, { new: true });
  return updatedTrip;
};

export const getAdvertisementTripsService = async () => {
  const trips = await Trip.find({ isAdvertisement: true });
  return trips;
};
