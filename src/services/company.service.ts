import Country from '../models/country.model';

export const createCountryService = async (data: any) => {
  return await Country.create(data);
};

export const updateCountryService = async (id: string, data: any) => {
  return await Country.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCountryService = async (id: string) => {
  return await Country.findByIdAndDelete(id);
};

export const listCountriesService = async () => {
  return await Country.find();
};
